from django.db import models
from django.contrib.auth.models import User


GENDER_CHOICES = [
    ('M', 'Masculin'),
    ('F', 'Feminin'),
]

class Consultation(models.Model):
    demande_consultation = models.ForeignKey('DemandeConsultation', models.DO_NOTHING)
    motif = models.TextField()
    interrogatoire = models.TextField()
    resume = models.TextField()
    hypothese_diagnostique = models.TextField()

    class Meta:
        managed = True
        db_table = 'consultation'


class DemandeConsultation(models.Model):
    medecin_centre_medical = models.ForeignKey('MedecinStructureSanitaire', models.CASCADE)
    date_consultation = models.DateTimeField()
    status = models.IntegerField()
    patient = models.ForeignKey('Patient', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'demande_consultation'


class EmploiDuTemp(models.Model):
    medecin_structure_sanitaire = models.ForeignKey('MedecinStructureSanitaire', models.CASCADE)
    horaire_start = models.TimeField()
    horaire_end = models.TimeField()
    jour = models.DateField()

    class Meta:
        managed = True
        db_table = 'emploi_du_temp'


class Medecin(User):
    specialite = models.ForeignKey('Specialite', models.DO_NOTHING, null=True)
    bio = models.TextField(null=True)
    genre = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='M',
    )
    telephone = models.CharField(max_length=200, null=True)
    adresse = models.CharField(max_length=200, null=True)
    date_naissance = models.DateField(null=True)
    create_date_time = models.DateTimeField(auto_now_add=True)
    mod_date_time = models.DateTimeField(auto_now=True)
    structure_sanitaires = models.ManyToManyField('StructureSanitaire', through='MedecinStructureSanitaire', related_name='medecins')

    class Meta:
        managed = True
        db_table = 'medecin'


class MedecinStructureSanitaire(models.Model):
    medecin = models.ForeignKey(Medecin, models.DO_NOTHING, related_name='medecin_structure_sanitaires')
    centre_medical = models.ForeignKey('StructureSanitaire', models.CASCADE, related_name='medecin_structure_sanitaires')
    status_demande = models.BooleanField(default=False)
    demandeur = models.CharField(max_length=1, choices=[('M', "Medecin"), ('S', "StructureSanitaire")])
    date_affiliation = models.DateTimeField(),
    create_date_time = models.DateTimeField(auto_now_add=True)
    mod_date_time = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'medecin_structure_sanitaire'


class Notification(models.Model):
    message = models.CharField(max_length=150, blank=True, null=True)
    demande_consultation = models.ForeignKey(DemandeConsultation, models.CASCADE, blank=True, null=True)
    status = models.IntegerField()

    class Meta:
        managed = True
        db_table = 'notification'


class Personne(models.Model):
    nom = models.CharField(max_length=100)
    prenom = models.CharField(max_length=150)
    adresse = models.CharField(max_length=30, null=True)
    telephone = models.CharField(max_length=30, null=True)
    date_naissance = models.DateField()
    genre = models.CharField(
        max_length=1,
        choices=GENDER_CHOICES,
        default='M',
    )

    class Meta:
        managed = True
        db_table = 'personne'


class Patient(Personne):
    doctor = models.ForeignKey(User, models.DO_NOTHING, null=False)
    groupage = models.CharField(max_length=3, null=True)
    allergies = models.CharField(max_length=2000, null=True)
    maladies = models.CharField(max_length=2000, null=True)
    habitude_alimentaires = models.CharField(max_length=2000, null=True)
    photo = models.ImageField(upload_to="avatars/", null=True)
    is_deleted = models.BooleanField(default=False)
    create_date_time = models.DateTimeField(auto_now_add=True)
    mod_date_time = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'patient'

    def get_consultaions(self, medecin=None):

        if medecin == None:
            consultations = Consultation.objects.filter(demande_consultation__patient=self)
            demande_consultations = DemandeConsultation.objects.filter(patient=self)

        else:
            consultations = Consultation.objects.filter(
                demande_consultation__medecin_centre_medical__medecin=medecin,
                demande_consultation__patient=self
            )
            demande_consultations = DemandeConsultation.objects.filter(
                medecin_centre_medical__medecin=medecin,
                patient=self
            )

        consultations = ConsultationSerializer(consultations, many=True).data
        demande_consultations = DemandeConsultationSerializer(demande_consultations, many=True).data
        structure_sanitaires = getDoctorHospitals(medecin)
        
        for consultation in consultations:
            demande_consultation = DemandeConsultation.objects.get(id=consultation['demande_consultation'])
            hopital = MedecinStructureSanitaire.objects.get(id=demande_consultation.medecin_centre_medical.id).centre_medical
            
            demande_consultation = DemandeConsultationSerializer(demande_consultation).data
            hopital = StructureSanitaireSerializer(hopital).data
            patient = PatientSerializer(self).data

            demande_consultation['hopital'] = hopital
            demande_consultation['patient'] = patient
            consultation['demande_consultation'] = demande_consultation


        return consultations


class Specialite(models.Model):
    libelle = models.CharField(max_length=150, null=False)
    icon = models.CharField(max_length=500, null=False)

    class Meta:
        managed = True
        db_table = 'specialite'


class StructureSanitaire(User):
    denomination = models.CharField(max_length=150)
    owner = models.ForeignKey(User, models.DO_NOTHING, related_name='+', null=True)
    telephone = models.CharField(max_length=150)
    adresse = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(null=True)
    is_deleted = models.BooleanField(default=False)
    create_date_time = models.DateTimeField(auto_now_add=True)
    mod_date_time = models.DateTimeField(auto_now=True)


    class Meta:
        managed = True
        db_table = 'structure_sanitaire'
        ordering = ['denomination']

class Constantes(models.Model):
    temprature = models.DecimalField(max_digits=4, decimal_places=2)
    pression_arterielle = models.DecimalField(max_digits=5, decimal_places=2)
    poids = models.DecimalField(max_digits=5, decimal_places=2)
    taille = models.DecimalField(max_digits=4, decimal_places=1)

    class Meta:
        managed = True
        db_table = 'constantes'


from .serializers import ConsultationSerializer, DemandeConsultationSerializer, StructureSanitaireSerializer, PatientSerializer
from .utils import getDoctorHospitals
