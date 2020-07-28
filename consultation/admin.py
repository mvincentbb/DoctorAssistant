from django.contrib import admin
from .models import Consultation, DemandeConsultation , Patient, Personne, Medecin, Specialite, StructureSanitaire, MedecinStructureSanitaire, EmploiDuTemp, Notification

# Register your models here.
class MedecinAdmin(admin.ModelAdmin):
	pass

class PatientAdmin(admin.ModelAdmin):
	pass

class SpecialiteAdmin(admin.ModelAdmin):
	pass

class ConsultationAdmin(admin.ModelAdmin):
	pass

admin.site.register(Medecin, MedecinAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Specialite, SpecialiteAdmin)
admin.site.register(Consultation, ConsultationAdmin)