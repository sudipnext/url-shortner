from django.urls import path, include
from rest_framework import routers
from .views import URLViewSet, get_long_url, index, ClickViewSet

router = routers.DefaultRouter()
router.register('api/urls', URLViewSet, 'urls')
router.register('api/clicks', ClickViewSet, 'clicks')

urlpatterns = [
    path('', include(router.urls)),
    path("home", index, name='home'),
    path('s/<str:short_slug>/', get_long_url, name='get_long_url'),
    path('api/urls/<str:short_slug>/qr_code',
         URLViewSet.as_view({'get': 'qr_code'}), name='generate_qr_code'),
]
