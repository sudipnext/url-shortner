from django.urls import path, include
from rest_framework import routers
from .views import URLViewSet, get_long_url

router = routers.DefaultRouter()
router.register('api/urls', URLViewSet, 'urls')

urlpatterns = [
    path('', include(router.urls)),
    path('s/<str:short_url>/', get_long_url, name='get_long_url'),
    path('api/urls/<str:short_url>/qr_code', URLViewSet.as_view({'get': 'qr_code'}), name='generate_qr_code'),
]
