from django.shortcuts import render
from django.contrib.auth import authenticate

from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework import mixins

from .models import Consultation, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification
from .serializers import *

from datetime import *
class ConsultationList(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

    def create(self, request, *args, **kwargs):
        medecin_pk = request.GET.get("medecin_pk",default=None)
        structure_sanitaire_pk = request.GET.get('structure_sanitaire_pk',default=None)
        # print(medecin_pk + "----"+ structure_sanitaire_pk)
        if structure_sanitaire_pk and medecin_pk:
            mss = MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk)
            patient = Patient.objects.get(pk = request.data.get("patient"))
            dc = DemandeConsultation.objects.create( medecin_centre_medical= mss,patient= patient,status= request.data.get("status"),date_consultation= datetime.now())
            Consultation.objects.create(demande_consultation=dc, motif=request.data.get("motif"),resume=request.data.get("resume"), interrogatoire= request.data.get("interrogatoire"),hypothese_diagnostique=request.data.get("hypothese_diagnostique"))

            return Response(status=status.HTTP_201_CREATED)
        dc = DemandeConsultation.objects.get(pk=request.data.get("demande_consultation"))
        Consultation.objects.create(demande_consultation=dc, motif=request.data.get("motif"),resume=request.data.get("resume"), interrogatoire= request.data.get("interrogatoire"),hypothese_diagnostique=request.data.get("hypothese_diagnostique"))
        return Response(status=status.HTTP_201_CREATED)

class ConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer

class DemandeConsultationList(generics.ListCreateAPIView):
    queryset = DemandeConsultation.objects.all()
    serializer_class = DemandeConsultationSerializer

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
                queryset = list(map(lambda x: x.centre_medical, medecin.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=medecin.id, status_demande=True)))
                # queryset = StructureSanitaire.objects.filter(created_by=token.user)
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
            MedecinStructureSanitaire.objects.get(medecin__id=medecin_pk, centre_medical__id=structure_sanitaire_pk).delete()
            
            #map(lambda x: x.id, ss)
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
    def post(self, request,):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            data = MedecinSerializer(Medecin.objects.get(id=user.id)).data
            return Response({"token": user.auth_token.key, "user_type": "medecin", 'user': data})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)