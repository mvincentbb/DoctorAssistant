from django.db import models
from django.contrib.auth.models import User


class Consultation(models.Model):
    demande_consultation = models.ForeignKey('DemandeConsultation', models.DO_NOTHING)
    motif = models.CharField(max_length=150)
    interrogatoire = models.CharField(max_length=150)
    resume = models.CharField(max_length=150)
    hypothese_diagnostique = models.CharField(max_length=150)

    class Meta:
        managed = True
        db_table = 'consultation'


class DemandeConsultation(models.Model):
    medecin_centre_medical = models.ForeignKey('MedecinStructureSanitaire', models.DO_NOTHING)
    date_consultation = models.DateTimeField()
    status = models.IntegerField()
    patient = models.ForeignKey('Patient', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'demande_consultation'


class EmploiDuTemp(models.Model):
    medecin_structure_sanitaire = models.ForeignKey('MedecinStructureSanitaire', models.DO_NOTHING)
    horaire_start = models.TimeField()
    horaire_end = models.TimeField()
    jour = models.DateField()

    class Meta:
        managed = True
        db_table = 'emploi_du_temp'


class Medecin(User):
    specialite = models.ForeignKey('Specialite', models.DO_NOTHING, null=True)
    create_date_time = models.DateTimeField(auto_now_add=True)
    mod_date_time = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'medecin'


class MedecinStructureSanitaire(models.Model):
    medecin = models.ForeignKey(Medecin, models.DO_NOTHING)
    centre_medical = models.ForeignKey('StructureSanitaire', models.CASCADE)
    date_affiliation = models.DateTimeField()
    create_date_time = models.DateTimeField()
    mod_date_time = models.DateTimeField()

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
    adresse = models.CharField(max_length=30)
    create_date_time = models.DateTimeField()
    mod_date_time = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'personne'


class Patient(Personne):


    class Meta:
        managed = True
        db_table = 'patient'


class Specialite(models.Model):
    libelle = models.CharField(max_length=150)
    create_date_time = models.DateTimeField()
    mod_date_time = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'specialite'


class StructureSanitaire(models.Model):
    denomination = models.CharField(max_length=150)
    email = models.CharField(max_length=150)
    telephone = models.CharField(max_length=150)
    adresse = models.CharField(max_length=100, blank=True, null=True)
    site_web = models.CharField(max_length=150)
    create_date_time = models.DateTimeField()
    mod_date_time = models.DateTimeField()

    class Meta:
        managed = True
        db_table = 'structure_sanitaire'
