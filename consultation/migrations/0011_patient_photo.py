# Generated by Django 3.0.7 on 2020-08-14 08:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0010_auto_20200813_2311'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='photo',
            field=models.ImageField(null=True, upload_to='avatars/'),
        ),
    ]