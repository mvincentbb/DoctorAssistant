from django.shortcuts import render
from django.contrib.auth import authenticate
from django.db import transaction
from django.db.models import Q
from django.urls import reverse

from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework import mixins
from rest_framework.decorators import api_view
import json

from .models import Consultation, Constantes, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification
from .serializers import *
from .utils import getDoctorHospitals, getToken

from datetime import *
from time import sleep


class ConsultationList(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def create(self, request, *args, **kwargs):
        constantes_data = request.data.get('constantes')
        if constantes_data :
            constante = Constantes(
                temperature = constantes_data.get('temperature'),
                poids = constantes_data.get('poids'),
                taille = constantes_data.get('taille'),
                systolique = constantes_data.get('systolique'),
                diastolique = constantes_data.get('diastolique'),
                glycemie = constantes_data.get('glycemie'),
                cholesterol = constantes_data.get('cholesterol'),
                pouls = constantes_data.get('pouls'),
            )
            constante.save()


        medecin_pk = request.data.get("medecin_pk")
        structure_sanitaire_pk = request.data.get('structure_sanitaire_pk')
        
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            
            dc = DemandeConsultation.objects.create(
                medecin_centre_medical= mss,
                patient= patient,
                status= request.data.get("status"),
                date_consultation= datetime.now()
            )
            
            Consultation.objects.create(
                constantes=constante, 
                demande_consultation=dc, 
                motif=request.data.get("motif"),
                resume=request.data.get("resume"), 
                interrogatoire= request.data.get("interrogatoire"),
                hypothese_diagnostique=request.data.get("hypothese_diagnostique")
            )
            return Response(status=status.HTTP_200_OK)

        dc = DemandeConsultation.objects.get(pk=request.data.get("demande_consultation"))
        Consultation.objects.create(
            constantes=constante, 
            demande_consultation=dc, 
            motif=request.data.get("motif"),
            resume=request.data.get("resume"), 
            interrogatoire= request.data.get("interrogatoire"),
            hypothese_diagnostique=request.data.get("hypothese_diagnostique")
        )
        return Response(status=status.HTTP_201_CREATED)

class ConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

class DemandeConsultationList(generics.ListCreateAPIView):
    serializer_class = DemandeConsultationSerializer
    queryset = DemandeConsultation.objects.all()

    def create(self, request, *args, **kwargs):
        medecin_pk = request.data.get("medecin")
        structure_sanitaire_pk = request.data.get('medecin_centre_medical')

        print(medecin_pk, structure_sanitaire_pk)
        
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            dc = DemandeConsultation.objects.create( medecin_centre_medical= mss,patient= patient,status= request.data.get("status"),date_consultation= datetime.now())
            return Response(data = DemandeConsultationSerializer(DemandeConsultation.objects.get(id=dc.pk)).data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class DemandeConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DemandeConsultation.objects.all()
    serializer_class = DemandeConsultationSerializer
    def update(self, request, *args, **kwargs):
        # print("===========")
        medecin_pk = request.data.get("medecin")
        structure_sanitaire_pk = request.data.get('centre_medical')
        
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            dc = DemandeConsultation(id=kwargs['pk'] ,medecin_centre_medical= mss,patient= patient,status= request.data.get("status"),date_consultation= datetime.now())
            dc.save()
            data = DemandeConsultationSerializer(DemandeConsultation.objects.get(id=dc.id)).data
            return Response(data = data , status=status.HTTP_200_OK)
        
        return Response(status=status.HTTP_400_BAD_REQUEST)

class PatientList(generics.ListCreateAPIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        # print(self.request.data)
        AUTHORIZATION = self.request.headers.get("Authorization")
        if not AUTHORIZATION:
            if self.request.user.is_authenticated and self.request.user.is_staff:
                queryset = Patient.objects.all()
            else:
                queryset = []
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            token = Token.objects.get(key=token_key)
            if Medecin.objects.get(id=token.user.id):
                queryset = Patient.objects.filter(doctor=token.user, is_deleted=False)
            else:
                queryset = []
        
        return queryset

class PatientDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        AUTHORIZATION = self.request.headers.get("Authorization")
        if not AUTHORIZATION:
            if self.request.user.is_authenticated and self.request.user.is_staff:
                queryset = Patient.objects.all()
            else:
                queryset = []
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            token = Token.objects.get(key=token_key)
            if Medecin.objects.get(id=token.user.id):
                queryset = Patient.objects.filter(doctor=token.user, is_deleted=False)
            else:
                queryset = []
        
        return queryset


    def get(self, request, *args, **kwargs):
        patient_pk = kwargs.get("pk")
        patient = Patient.objects.get(id=patient_pk)
        data = super().get(self, request, *args, **kwargs).data
        
        data['consultations'] = patient.get_consultaions(medecin=Medecin.objects.get(id=getToken(request).user.id))
        
        return Response( data, status=status.HTTP_200_OK )

    def delete(self, request, *args, **kwargs):
        patient_pk = kwargs.get("pk")
        if patient_pk:
            try:
                patient = Patient.objects.get(id=patient_pk)
            except Exception as e:
                patient = None

            if patient:
                patient.is_deleted = True
                patient.save()
                return Response( {}, status=status.HTTP_204_NO_CONTENT )

class PersonneList(generics.ListCreateAPIView):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer

class PersonneDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Personne.objects.all()
    serializer_class = PersonneSerializer

class MedecinList(generics.ListCreateAPIView):
    queryset = Medecin.objects.all()
    serializer_class = MedecinSerializer

class MedecinDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Medecin.objects.all()
    serializer_class = MedecinSerializer

class MedecinView(APIView):
    def post(self, request):
        AUTHORIZATION = self.request.headers.get("Authorization")
        if not AUTHORIZATION:
            return Response({"error": "UNAUTHORIZED"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            try:
                token = Token.objects.get(key=token_key)
                medecin = Medecin.objects.get(id=token.user.id)
            except Exception as e:
                token = None
            
            if not token:
                return Response({"error": "UNAUTHORIZED"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                if request.path == reverse('medecin_add_structure_sanitaire'):
                    denomination = request.data.get("denomination")
                    email = request.data.get("email")
                    adresse = request.data.get("adresse")
                    telephone = request.data.get("telephone")
                    username = request.data.get("username")
                    description = request.data.get("description")

                    ss = medecin.structure_sanitaires.create(denomination=denomination, email=email, adresse=adresse, telephone=telephone, username=username, description=description, owner=medecin)
                    mss = MedecinStructureSanitaire.objects.get(medecin=medecin, centre_medical=ss)
                    mss.demandeur = "M"
                    mss.status_demande = 1
                    mss.save()

                    # owned = getDoctorHospitals(medecin)
                    data = StructureSanitaire.objects.filter( Q(is_deleted=False) & (Q(owner__isnull=True) | Q(owner__id=medecin.id)) )
                    data = StructureSanitaireSerializer(data, many=True).data
                    return Response({'structure_sanitaires': data, 'id': ss.id}, status=status.HTTP_201_CREATED)

class SpecialiteList(generics.ListCreateAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer

class SpecialiteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer

class StructureSanitaireList(generics.ListCreateAPIView):
    serializer_class = StructureSanitaireSerializer

    def get_queryset(self):

        AUTHORIZATION = self.request.headers.get("Authorization")
        if not AUTHORIZATION:
            if self.request.user.is_authenticated and self.request.user.is_staff:
                queryset = StructureSanitaire.objects.all()
            else:
                queryset = []
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            token = Token.objects.get(key=token_key)
            medecin = Medecin.objects.get(id=token.user.id)
            if medecin:
                if self.request.path == reverse('structure_sanitaire_added'):
                    queryset = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=False)))
                
                elif self.request.path == reverse('structure_sanitaire_mine'):
                    queryset = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
                
                elif self.request.path == reverse("structure_sanitaires"):
                    queryset = StructureSanitaire.objects.filter( Q(is_deleted=False) & (Q(owner__isnull=True) | Q(owner__id=medecin.id)) )
                
                queryset = list(filter(lambda ss: not ss.is_deleted, queryset))
                # print(queryset)
            else:
                queryset = []
        
        return queryset

class StructureSanitaireDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StructureSanitaireSerializer

    def get_queryset(self):
        AUTHORIZATION = self.request.headers.get("Authorization")
        if not AUTHORIZATION:
            if self.request.user.is_authenticated and self.request.user.is_staff:
                queryset = StructureSanitaire.objects.all()
            else:
                queryset = []
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            token = Token.objects.get(key=token_key)
            medecin = Medecin.objects.get(id=token.user.id)
            if medecin:
                queryset = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
                queryset = list(filter(lambda ss: not ss.is_deleted, queryset))
                # print(queryset)
            else:
                queryset = []
        
        return queryset

    def get(self, request, *args, **kwargs):
        structure_sanitaire = None
        queryset = self.get_queryset()
        for s in queryset:
            if s.id == kwargs["pk"]:
                structure_sanitaire = s
                break
        if structure_sanitaire:
            data = StructureSanitaireSerializer(structure_sanitaire).data
            return Response( data, status=status.HTTP_200_OK )
        return Response( {"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND )

    def update(self, request, *args, **kwargs):
        structure_sanitaire = None
        queryset = self.get_queryset()
        
        for s in queryset:
            if s.id == kwargs["pk"]:
                structure_sanitaire = s
                break
        if structure_sanitaire:
            structure_sanitaire = StructureSanitaire.objects.filter(pk=kwargs["pk"])
            denomination = request.data["denomination"]
            adresse = request.data["adresse"]
            description = request.data["description"]
            email = request.data["email"]
            telephone = request.data["telephone"]
            structure_sanitaire.update(
                denomination=denomination, 
                adresse=adresse, 
                description=description, 
                email=email, 
                telephone=telephone
            )

            # data = StructureSanitaireSerializer(structure_sanitaire).data
            return Response( {}, status=status.HTTP_200_OK )
        return Response( {"error": "Not Found"}, status=status.HTTP_404_NOT_FOUND )

    def delete(self, request, *args, **kwargs):
        if kwargs.get("pk"): 
            try:
                hospital = StructureSanitaire.objects.get(id=kwargs.get("pk"))
                medecin = Medecin.objects.get(id=hospital.owner.id)
            except Exception as e:
                hospital = None
            
            if hospital:
                # print("deleted")
                hospital.is_deleted = True
                hospital.save()

            if request.query_params.get('return') == 'my_hos':
                return Response( getDoctorHospitals(medecin), status=status.HTTP_200_OK )
            return Response( {}, status=status.HTTP_204_NO_CONTENT )

class MedecinStructureSanitaireList(generics.ListCreateAPIView):
    queryset = MedecinStructureSanitaire.objects.all()
    serializer_class = MedecinStructureSanitaireSerializer

class MedecinStructureSanitaireDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedecinStructureSanitaire.objects.all()
    serializer_class = MedecinStructureSanitaireSerializer

    def delete(self, request, *args, **kwargs):
        medecin_pk = kwargs.get("medecin_pk")
        structure_sanitaire_pk = kwargs.get("structure_sanitaire_pk")

        if kwargs.get("pk"):
            return super().delete(self, request, *args, **kwargs)
        
        elif structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            medecin = mss.medecin
            mss.delete()
            
            if request.query_params.get('return') == 'my_hos':
                return Response( getDoctorHospitals(medecin), status=status.HTTP_200_OK )

            data = MedecinSerializer(Medecin.objects.get(id=medecin_pk)).data
            return Response( data, status=status.HTTP_200_OK )

class EmploiDuTempList(generics.ListCreateAPIView):
    queryset = EmploiDuTemp.objects.all()
    serializer_class = EmploiDuTempSerializer

class EmploiDuTempDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmploiDuTemp.objects.all()
    serializer_class = EmploiDuTempSerializer

class NotificationList(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class NotificationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

class UserCreate(generics.CreateAPIView):
    authentication_classes = ()
    permission_classes = ()
    serializer_class = AuthMedecinSerializer

class LoginView(APIView):
    permission_classes = ()
    def post(self, request):
        if request.path == reverse('assertuser'):
            token_key = request.data.get("token")
            token = Token.objects.get(key=token_key)
            if token and token.user:
                medecin = Medecin.objects.get(id=token.user.id)
                data = MedecinSerializer(medecin).data

                # print("@@@@@@@@@@@@@@@@@")
                # print(medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True))
                ss = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
                
                ss = filter(lambda s: not s.is_deleted, ss)
                ss = map(lambda i: i.id, ss)
                data["structure_sanitaires"] = ss
                # print(data["structure_sanitaires"])
                return Response({'user': data})
        
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            data = MedecinSerializer(Medecin.objects.get(id=user.id)).data
            return Response({"token": user.auth_token.key, "user_type": "medecin", 'user': data})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)

class ScheduleView(APIView):
    def get(self, request):
        AUTHORIZATION = request.headers.get("Authorization")
        if not AUTHORIZATION:
            return Response({"error": "UNAUTHORIZED"}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            token_key = AUTHORIZATION.split(" ")[1]
            try:
                token = Token.objects.get(key=token_key)
                medecin = Medecin.objects.get(id=token.user.id)
            except Exception as e:
                token = None
            
            if not token:
                return Response({"error": "UNAUTHORIZED"}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                consultations = Consultation.objects.filter(
                    demande_consultation__medecin_centre_medical__medecin=medecin
                )
                demande_consultations = DemandeConsultation.objects.filter(
                    medecin_centre_medical__medecin=medecin
                )

                consultations = ConsultationSerializer(consultations, many=True).data
                demande_consultations = DemandeConsultationSerializer(demande_consultations, many=True).data
                structure_sanitaires = getDoctorHospitals(medecin)
                
                for demande_consultation in demande_consultations:
                    hopital = MedecinStructureSanitaire.objects.get(id=demande_consultation['medecin_centre_medical']).centre_medical
                    hopital = StructureSanitaireSerializer(hopital).data

                    patient = Patient.objects.get(id=demande_consultation['patient'])
                    patient = PatientSerializer(patient).data
                    
                    demande_consultation['hopital'] = hopital
                    demande_consultation['patient'] = patient

                return Response({'consultations': consultations, 'demande_consultations': demande_consultations, 'structure_sanitaires': structure_sanitaires}, status=status.HTTP_200_OK)

def getDemandeConsultationWithName():
        demandes = []
        for obj in DemandeConsultation.objects.all():
            medecin = obj.medecin_centre_medical.medecin
            centre = obj.medecin_centre_medical.centre_medical
            patient = obj.patient
            dc = {"id":obj.pk,"medecin":medecin.first_name+" "+medecin.last_name,"centre_medical":centre.denomination, "date_consultation":obj.date_consultation.__str__(),"status":obj.status, "patient":patient.nom+" "+patient.prenom}
            demandes.append(dc)
        return demandes

@api_view(['GET'])
def allDemandeConsultation(request):
    if request.method == 'GET':
        return Response(data = getDemandeConsultationWithName())

@api_view(['POST'])
def countPatients(request, *args, **kwargs):
    print(request.data)
    if request.method == 'POST':
        patientsNumber = Patient.objects.filter(doctor=request.data.get("doctorpatients"), is_deleted=False)
        return Response(data = patientsNumber.count())
