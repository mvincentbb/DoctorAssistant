from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="login"),
    path("assert_user_by_token/", views.LoginView.as_view(), name="assertuser"),
    path("register/", views.UserCreate.as_view(), name="user_create"),
    
    path('notifications/', views.NotificationList.as_view()),
    path('notifications/<int:pk>/', views.NotificationDetail.as_view()),

    path('consultations/', views.ConsultationList.as_view()),
    path('consultations/<int:pk>/', views.ConsultationDetail.as_view()),

    path('demandeConsultations/', views.DemandeConsultationList.as_view()),
    path('demandeConsultations/<int:pk>/', views.DemandeConsultationDetail.as_view()),

    path('patients/', views.PatientList.as_view()),
    path('patients/<int:pk>/', views.PatientDetail.as_view()),

    path('personnes/', views.PersonneList.as_view()),
    path('personnes/<int:pk>/', views.PersonneDetail.as_view()),

    path('medecins/', views.MedecinList.as_view()),
    path('medecins/<int:pk>/', views.MedecinDetail.as_view()),

    path('specialites/', views.SpecialiteList.as_view()),
    path('specialites/<int:pk>/', views.SpecialiteDetail.as_view()),

    path('structureSanitaires/', views.StructureSanitaireList.as_view()),
    path('structureSanitaires/my/', views.StructureSanitaireList.as_view()),
    path('structureSanitaires/<int:pk>/', views.StructureSanitaireDetail.as_view()),

    path('medecinStructureSanitaires/', views.MedecinStructureSanitaireList.as_view()),
    path('medecinStructureSanitaires/<int:pk>/', views.MedecinStructureSanitaireDetail.as_view()),
    path('medecinStructureSanitaires/<int:medecin_pk>/<int:structure_sanitaire_pk>/', views.MedecinStructureSanitaireDetail.as_view()),

    path('emploiDuTemps/', views.EmploiDuTempList.as_view()),
    path('emploiDuTemps/<int:pk>/', views.EmploiDuTempDetail.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)