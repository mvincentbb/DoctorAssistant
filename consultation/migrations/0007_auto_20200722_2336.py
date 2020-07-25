# Generated by Django 3.0.7 on 2020-07-22 23:36

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0006_auto_20200722_2332'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='personne',
            name='create_date_time',
        ),
        migrations.RemoveField(
            model_name='personne',
            name='mod_date_time',
        ),
        migrations.AddField(
            model_name='patient',
            name='create_date_time',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='patient',
            name='created_by',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.DO_NOTHING, to='consultation.Medecin'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='patient',
            name='mod_date_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]