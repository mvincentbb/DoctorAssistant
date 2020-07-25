# Generated by Django 3.0.7 on 2020-07-22 23:21

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0003_auto_20200719_1747'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='specialite',
            name='create_date_time',
        ),
        migrations.RemoveField(
            model_name='specialite',
            name='mod_date_time',
        ),
        migrations.AddField(
            model_name='medecin',
            name='adresse',
            field=models.CharField(default='agoe', max_length=200),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='medecin',
            name='bio',
            field=models.TextField(default='Ma bio'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='medecin',
            name='date_naissance',
            field=models.DateField(default=datetime.date(2020, 7, 22)),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='medecin',
            name='genre',
            field=models.CharField(choices=[('M', 'Masculin'), ('F', 'Feminin')], default='M', max_length=1),
        ),
    ]
