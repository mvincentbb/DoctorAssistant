# Generated by Django 3.0.7 on 2020-07-28 13:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0009_auto_20200723_0052'),
    ]

    operations = [
        migrations.AddField(
            model_name='medecin',
            name='telephone',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
