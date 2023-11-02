from django.urls import path, include
from .views import user_activation

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('activate/<str:uid>/<str:token>', user_activation, name='activate'),
]