from django.db import models
from django.contrib.auth.models import User

from datetime import *

GENDER_CHOICES = [
    ('M', 'Masculin'),
    ('F', 'Feminin'),
]

class Consultation(models.Model):
    demande_consultation = models.ForeignKey('DemandeConsultation', models.DO_NOTHING, related_name='consultation')
    constantes = models.ForeignKey('Constantes', models.DO_NOTHING, null=False)
    motif = models.TextField()
    interrogatoire = models.TextField()
    resume = models.TextField()
    hypothese_diagnostique = models.TextField()

    class Meta:
        managed = True
        db_table = 'consultation'
        ordering = ['-id']

class DemandeConsultation(models.Model):
    medecin_centre_medical = models.ForeignKey('MedecinStructureSanitaire', models.CASCADE)
    date_consultation = models.DateTimeField()
    status = models.IntegerField()
    patient = models.ForeignKey('Patient', models.DO_NOTHING, related_name='demande_consultations')

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

    def get_dashboard_informations(self):
        data = {}

        patients = Patient.objects.filter(doctor=self, is_deleted=False)
        new_patients_counter = 0
        for patient in patients:
            if patient.demande_consultations.count() == 0:
                new_patients_counter += 1
        data["patients"] = { "total": patients.count(), "new": new_patients_counter }

        data["consultations"] = {
            "total": Consultation.objects.filter(demande_consultation__medecin_centre_medical__medecin=self).count(), 
            "a_venir": DemandeConsultation.objects.filter(consultation__isnull=True).count()
        }
        
        data["rdv"] = {
            "total": DemandeConsultation.objects.filter(medecin_centre_medical__medecin=self).count(), 
            "actuel": DemandeConsultation.objects.filter(medecin_centre_medical__medecin=self, consultation__isnull=True, date_consultation=date.today()).count(),
        }

        data["activites"] = self.get_activity_data()
        data["patients_incoming"] = self.patients_incoming_data()

        rdvs = DemandeConsultationSerializer(DemandeConsultation.objects.filter(medecin_centre_medical__medecin=self), many=True).data
        for rdv in rdvs:
            hopital = MedecinStructureSanitaire.objects.get(id=rdv['medecin_centre_medical']).centre_medical
            patient = Patient.objects.get(id=rdv['patient'])
            rdv['hopital'] = StructureSanitaireSerializer(hopital).data
            rdv['patient'] = PatientSerializer(patient).data
        data["rdv"]["liste"] = rdvs

        return data

    def get_activity_data(self):
        label, patient_nbres, consultation_nbres = [], [], []
        today = date.today()
        consultations = Consultation.objects.filter(demande_consultation__medecin_centre_medical__medecin=self)

        label.append(MONTHS[today.month - 1])
        
        consultation_nbres.append( 
            consultations.filter(
                demande_consultation__date_consultation__lte=today, 
                demande_consultation__date_consultation__gte=( today + timedelta(today.day-1) )
            ).count()
        )

        patient_nbres.append(
            len( self.get_distinct_patients(
                consultations.filter(
                    demande_consultation__date_consultation__lte=today, 
                    demande_consultation__date_consultation__gte=( today + timedelta(today.day-1) )
                )
            ))
        )

        previous = today-timedelta(today.day)
        for i in range(5):
            label.append(MONTHS[previous.month - 1])
        
            consultation_nbres.append( 
                consultations.filter(
                    demande_consultation__date_consultation__lte=previous, 
                    demande_consultation__date_consultation__gte=( previous + timedelta(previous.day-1) )
                ).count()
            )

            patient_nbres.append( 
                len( self.get_distinct_patients(
                    consultations.filter(
                        demande_consultation__date_consultation__lte=previous, 
                        demande_consultation__date_consultation__gte=( previous + timedelta(previous.day-1) )
                    )
                ))
            )
            previous = previous-timedelta(previous.day)

        return {"label": label, "patients": patient_nbres, "consultations": consultation_nbres}

    def patients_incoming_data(self):
        labels, males, females = [], [], []
        today = date.today()
        patients = Patient.objects.filter(doctor=self)

        labels.append(MONTHS[today.month - 1])
        
        males.append( 
            patients.filter(
                genre="M",
                create_date_time__lte=today,
                create_date_time__gte=( today + timedelta(today.day-1) )
            ).count()
        )

        females.append(
            patients.filter(
                genre="F",
                create_date_time__lte=today,
                create_date_time__gte=( today + timedelta(today.day-1) )
            ).count()
        )

        previous = today-timedelta(today.day)
        for i in range(5):
            labels.append(MONTHS[previous.month - 1])
        
            males.append( 
                patients.filter(
                    genre="M",
                    create_date_time__lte=previous,
                    create_date_time__gte=( previous + timedelta(previous.day-1) )
                ).count()
            )

            females.append(
                patients.filter(
                    genre="F",
                    create_date_time__lte=previous,
                    create_date_time__gte=( previous + timedelta(previous.day-1) )
                ).count()
            )
            previous = previous-timedelta(previous.day)

        return {"labels": labels, "males": males, "females": females}

    def get_distinct_patients(self, consultations):
        return {consultation.demande_consultation.patient for consultation in consultations}

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
            constantes = Constantes.objects.get(id=consultation['constantes'])
            
            demande_consultation = DemandeConsultationSerializer(demande_consultation).data
            hopital = StructureSanitaireSerializer(hopital).data
            constantes = ConstantesSerializer(constantes).data
            patient = PatientSerializer(self).data

            demande_consultation['hopital'] = hopital
            demande_consultation['patient'] = patient
            consultation['constantes'] = constantes
            consultation['demande_consultation'] = demande_consultation

        return consultations

    def get_last_constantes(self, medecin=None):
        if medecin == None:
            consultations = Consultation.objects.filter(demande_consultation__patient=self, constantes__isnull=False)

        else:
            consultations = Consultation.objects.filter(
                demande_consultation__medecin_centre_medical__medecin=medecin,
                demande_consultation__patient=self, constantes__isnull=False
            )

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
    temperature = models.DecimalField(max_digits=4, decimal_places=2)
    systolique = models.IntegerField(null=True)
    diastolique = models.IntegerField(null=True)
    glycemie = models.IntegerField(null=True)
    cholesterol = models.IntegerField(null=True)
    pouls = models.IntegerField(null=True)
    poids = models.DecimalField(max_digits=5, decimal_places=2)
    taille = models.DecimalField(max_digits=4, decimal_places=1)

    class Meta:
        managed = True
        db_table = 'constantes'


from .serializers import ConsultationSerializer, ConstantesSerializer, DemandeConsultationSerializer, StructureSanitaireSerializer, PatientSerializer, MedecinSerializer
from .utils import getDoctorHospitals, MONTHS
