# Generated by Django 3.0.7 on 2020-09-02 13:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('consultation', '0019_auto_20200826_2133'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ordonnance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('create_date_time', models.DateTimeField(auto_now_add=True)),
                ('mod_date_time', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'ordonnance',
                'ordering': ['-id'],
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Produit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('denomination', models.CharField(max_length=300)),
                ('nom_commercial', models.CharField(max_length=300, null=True)),
                ('dosage', models.CharField(max_length=20, null=True)),
                ('forme', models.CharField(choices=[('Cp', 'Comprimé'), ('F', 'Suspension Buvable'), ('F', 'Solution Buvable'), ('F', 'Sirop'), ('F', 'Injection'), ('F', 'Inhalation'), ('F', 'Spray'), ('F', 'Sachets'), ('F', 'Pommade'), ('F', 'perlingual'), ('F', 'Gouttes'), ('F', 'Solution injectable et buvable'), ('F', 'Crème'), ('F', 'Perfusion'), ('F', 'Liquide'), ('F', 'Poudre'), ('F', 'Suppositoire'), ('F', 'Pommade ophtalmique'), ('F', 'Collyre'), ('F', 'Capsules'), ('F', 'Soluté perfusable'), ('F', 'Gélule'), ('F', 'Gouttes auriculaires')], default='Cp', max_length=5, null=True)),
            ],
            options={
                'db_table': 'produit',
                'ordering': ['-id'],
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='Prescription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantité', models.IntegerField()),
                ('posologie', models.CharField(max_length=500)),
                ('ordonnance', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prescriptions', to='consultation.Ordonnance')),
                ('produit', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='prescriptions', to='consultation.Produit')),
            ],
            options={
                'db_table': 'prescription',
                'ordering': ['-id'],
                'managed': True,
            },
        ),
        migrations.AddField(
            model_name='consultation',
            name='ordonnance',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='consultation', to='consultation.Ordonnance'),
        ),
    ]