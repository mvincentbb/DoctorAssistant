# Generated by Django 3.0.7 on 2020-08-06 20:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0003_auto_20200806_1341'),
    ]

    operations = [
        migrations.AddField(
            model_name='patient',
            name='is_deleted',
            field=models.BooleanField(default=False),
        ),
    ]