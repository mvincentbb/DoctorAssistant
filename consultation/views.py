from django.shortcuts import render
from django.contrib.auth import authenticate

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, status
from rest_framework import mixins

from .models import Consultation, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification
from .serializers import *

# Create your views here.




class ConsultationList(generics.ListCreateAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer


class ConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Consultation.objects.all()
    serializer_class = ConsultationSerializer
from rest_framework import generics


class DemandeConsultationList(generics.ListCreateAPIView):
    queryset = DemandeConsultation.objects.all()
    serializer_class = DemandeConsultationSerializer


class DemandeConsultationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DemandeConsultation.objects.all()
    serializer_class = DemandeConsultationSerializer

class PatientList(generics.ListCreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


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
    queryset = StructureSanitaire.objects.all()
    serializer_class = StructureSanitaireSerializer


class StructureSanitaireDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = StructureSanitaire.objects.all()
    serializer_class = StructureSanitaireSerializer

class MedecinStructureSanitaireList(generics.ListCreateAPIView):
    queryset = MedecinStructureSanitaire.objects.all()
    serializer_class = MedecinStructureSanitaireSerializer


class MedecinStructureSanitaireDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = MedecinStructureSanitaire.objects.all()
    serializer_class = MedecinStructureSanitaireSerializer

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
    serializer_class = MedecinSerializer


class LoginView(APIView):
    permission_classes = ()
    def post(self, request,):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user:
            return Response({"token": user.auth_token.key})
        else:
            return Response({"error": "Wrong Credentials"}, status=status.HTTP_400_BAD_REQUEST)