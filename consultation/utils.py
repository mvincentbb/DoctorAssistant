from .serializers import StructureSanitaireSerializer
from rest_framework.authtoken.models import Token


MONTHS = ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"]

def getDoctorHospitals(doctor):
	hospitals = list(map(lambda x: x.centre_medical, doctor.medecin_structure_sanitaires.filter(demandeur="M", medecin__id=doctor.id, status_demande=True)))
	hospitals = list(filter(lambda ss: not ss.is_deleted, hospitals))
	data = StructureSanitaireSerializer(hospitals, many=True).data
	return data

def getToken(request) :
	AUTHORIZATION = request.headers.get("Authorization")
	return Token.objects.get(key=AUTHORIZATION.split(" ")[1])
