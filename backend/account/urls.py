from django.urls import path, include
from .views import LogoutView, LoginVerifyView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/verify/", LoginVerifyView.as_view()),
]