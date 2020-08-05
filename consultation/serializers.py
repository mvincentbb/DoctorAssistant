from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.authtoken.models import Token
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
        extra_kwargs = {
            'date_consultation': {'required': False}
        }

class AuthMedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        fields = ('username', 'email', 'password', 'genre', 'specialite')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = Medecin(
            email=validated_data['email'],
            username=validated_data['username'],
            # genre=validated_data['genre'],
            # specialite=validated_data['specialite']
        )

        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user


class MedecinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medecin
        exclude = ('password', )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )

        user.set_password(validated_data['password'])
        user.save()
        Token.objects.create(user=user)
        return user