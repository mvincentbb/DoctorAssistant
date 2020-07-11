# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


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


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class EmploiDuTemp(models.Model):
    medecin_structure_sanitaire = models.ForeignKey('MedecinStructureSanitaire', models.DO_NOTHING)
    horaire_start = models.TimeField()
    horaire_end = models.TimeField()
    jour = models.DateField()

    class Meta:
        managed = True
        db_table = 'emploi_du_temp'


class Medecin(AuthUser):
    specialite = models.ForeignKey('Specialite', models.DO_NOTHING)
    create_date_time = models.DateTimeField()
    mod_date_time = models.DateTimeField()

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
