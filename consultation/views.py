from django.shortcuts import render
from django.contrib.auth import authenticate
from django.db import transaction
from django.urls import reverse

from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework import mixins
from rest_framework.decorators import api_view
import json

from .models import Consultation, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification
from .serializers import *

from datetime import *


class ConsultationList(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def create(self, request, *args, **kwargs):
        medecin_pk = request.data.get("medecin_pk")
        structure_sanitaire_pk = request.data.get('structure_sanitaire_pk')
        
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            dc = DemandeConsultation.objects.create( medecin_centre_medical= mss,patient= patient,status= request.data.get("status"),date_consultation= datetime.now())
            Consultation.objects.create(demande_consultation=dc, motif=request.data.get("motif"),resume=request.data.get("resume"), interrogatoire= request.data.get("interrogatoire"),hypothese_diagnostique=request.data.get("hypothese_diagnostique"))

            return Response(status=status.HTTP_200_OK)
        dc = DemandeConsultation.objects.get(pk=request.data.get("demande_consultation"))
        Consultation.objects.create(demande_consultation=dc, motif=request.data.get("motif"),resume=request.data.get("resume"), interrogatoire= request.data.get("interrogatoire"),hypothese_diagnostique=request.data.get("hypothese_diagnostique"))
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
        
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            dc = DemandeConsultation.objects.create( medecin_centre_medical= mss,patient= patient,status= request.data.get("status"),date_consultation= datetime.now())
            return Response(data = DemandeConsultationSerializer(DemandeConsultation.objects.get(id=dc.pk)).data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

class DemandeConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DemandeConsultation.objects.all()
    serializer_class = DemandeConsultationSerializer

class PatientList(generics.ListCreateAPIView):
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
                queryset = Patient.objects.filter(created_by=token.user)
            else:
                queryset = []
        
        return queryset

class PatientDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PatientSerializer

    def get_queryset(self):
        # print(self.request.headers)
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
                queryset = Patient.objects.filter(created_by=token.user)
            else:
                queryset = []
        
        return queryset

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

                    data = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
                    print(data)
                    data = StructureSanitaireSerializer(data, many=True).data
                    return Response(data, status=status.HTTP_201_CREATED)

            



class SpecialiteList(generics.ListCreateAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer

class SpecialiteDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Specialite.objects.all()
    serializer_class = SpecialiteSerializer

class StructureSanitaireList(generics.ListCreateAPIView):
    serializer_class = StructureSanitaireSerializer

    def get_queryset(self):
        print(self.request.path)
        if self.request.path == "/structureSanitaires/":
            return StructureSanitaire.objects.all()

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
            else:
                queryset = []
        
        return queryset

class StructureSanitaireDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StructureSanitaireSerializer

    def get_queryset(self):
        print(self.request.path)
        if self.request.path == "/structureSanitaires/":
            return StructureSanitaire.objects.all()

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
                # queryset = StructureSanitaire.objects.filter(created_by=token.user)
            else:
                queryset = []
        
        return queryset

    def delete(self, request, *args, **kwargs):
        if request.query_params.get('return') == 'my_hos':
            
            try:
                hospital = StructureSanitaire.objects.get(id=kwargs.get("pk"))
                medecin = Medecin.objects.get(id=hospital.owner.id)
            except Exception as e:
                hospital = None
            
            if hospital:
                print("delete")
                hospital.delete()
            return getDoctorHospitals(medecin)

        if kwargs.get("pk"):
            return super().delete(self, request, *args, **kwargs)

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
            
            if request.DELETE.get('return') == 'my_hos':
                return getDoctorHospitals(medecin)

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
                ss = list(map(lambda x: x.centre_medical.id, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
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


def getDoctorHospitals(doctor):
    hospitals = list(map(lambda x: x.centre_medical, doctor.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=doctor.id, status_demande=True)))
    data = StructureSanitaireSerializer(hospitals, many=True).data
    return Response( data, status=status.HTTP_200_OK )

def getDemandeConsultationWithName():
        demandes = []
        for obj in DemandeConsultation.objects.all():
            medecin = obj.medecin_centre_medical.medecin
            centre = obj.medecin_centre_medical.centre_medical
            patient = obj.patient
            dc = {"id":obj.pk,"medecin":medecin.first_name+" "+medecin.last_name,"centre_medical":centre.denomination, "date_consultation":obj.date_consultation.__str__(),"status":obj.status, "patient":patient.nom+" "+patient.prenom}
            demandes.append(dc)
        print(demandes)
        return demandes

@api_view(['GET'])
def allDemandeConsultation(request):
    if request.method == 'GET':
        return Response(data = getDemandeConsultationWithName())
