from rest_framework import serializers
from .models import Consultation, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification

class PersonneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personne
        fields = '__all__'

class ConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consultation
        fields = '__all__'

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class SpecialiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialite
        fields = '__all__'

class StructureSanitaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = StructureSanitaire
        fields = '__all__'

class MedecinStructureSanitaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedecinStructureSanitaire
        fields = '__all__'

class EmploiDuTempSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmploiDuTemp
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class DemandeConsultationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DemandeConsultation
        fields = '__all__'

class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = '__all__'