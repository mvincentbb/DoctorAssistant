# Generated by Django 3.0.7 on 2020-07-19 17:41

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='DemandeConsultation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_consultation', models.DateTimeField()),
                ('status', models.IntegerField()),
            ],
            options={
                'db_table': 'demande_consultation',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Medecin',
            fields=[
                ('user_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('create_date_time', models.DateTimeField()),
                ('mod_date_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'medecin',
                'managed': True,
            },
            bases=('auth.user',),
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Personne',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nom', models.CharField(max_length=100)),
                ('prenom', models.CharField(max_length=150)),
                ('adresse', models.CharField(max_length=30)),
                ('create_date_time', models.DateTimeField()),
                ('mod_date_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'personne',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Specialite',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('libelle', models.CharField(max_length=150)),
                ('create_date_time', models.DateTimeField()),
                ('mod_date_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'specialite',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='StructureSanitaire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('denomination', models.CharField(max_length=150)),
                ('email', models.CharField(max_length=150)),
                ('telephone', models.CharField(max_length=150)),
                ('adresse', models.CharField(blank=True, max_length=100, null=True)),
                ('site_web', models.CharField(max_length=150)),
                ('create_date_time', models.DateTimeField()),
                ('mod_date_time', models.DateTimeField()),
            ],
            options={
                'db_table': 'structure_sanitaire',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('personne_ptr', models.OneToOneField(auto_created=True, on_delete=django.db.models.deletion.CASCADE, parent_link=True, primary_key=True, serialize=False, to='consultation.Personne')),
            ],
            options={
                'db_table': 'patient',
                'managed': True,
            },
            bases=('consultation.personne',),
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.CharField(blank=True, max_length=150, null=True)),
                ('status', models.IntegerField()),
                ('demande_consultation', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='consultation.DemandeConsultation')),
            ],
            options={
                'db_table': 'notification',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='MedecinStructureSanitaire',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_affiliation', models.DateTimeField()),
                ('create_date_time', models.DateTimeField()),
                ('mod_date_time', models.DateTimeField()),
                ('centre_medical', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='consultation.StructureSanitaire')),
                ('medecin', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.Medecin')),
            ],
            options={
                'db_table': 'medecin_structure_sanitaire',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='medecin',
            name='specialite',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.Specialite'),
        ),
        migrations.CreateModel(
            name='EmploiDuTemp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('horaire_start', models.TimeField()),
                ('horaire_end', models.TimeField()),
                ('jour', models.DateField()),
                ('medecin_structure_sanitaire', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.MedecinStructureSanitaire')),
            ],
            options={
                'db_table': 'emploi_du_temp',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='demandeconsultation',
            name='medecin_centre_medical',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.MedecinStructureSanitaire'),
        ),
        migrations.CreateModel(
            name='Consultation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('motif', models.CharField(max_length=150)),
                ('interrogatoire', models.CharField(max_length=150)),
                ('resume', models.CharField(max_length=150)),
                ('hypothese_diagnostique', models.CharField(max_length=150)),
                ('demande_consultation', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.DemandeConsultation')),
            ],
            options={
                'db_table': 'consultation',
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='demandeconsultation',
            name='patient',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.Patient'),
        ),
    ]
