# Generated by Django 3.0.7 on 2020-07-23 00:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0008_auto_20200723_0051'),
    ]

    operations = [
        migrations.AlterField(
            model_name='medecin',
            name='date_naissance',
            field=models.DateField(null=True),
        ),
    ]
