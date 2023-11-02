from rest_framework.decorators import api_view, action, permission_classes
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import URLSerializer
import random, string, pyqrcode
from django.utils import timezone
from .models import URL, Click
from django.http import FileResponse
from django.shortcuts import redirect

##random short URL SLUG Generator
def random_slug():
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(6))
#generate qr code
def generate_qr_code(url):
    url = pyqrcode.create(url)
    url.png('media/qr_codes/' + url.short_url + '.png', scale=8)

class URLViewSet(viewsets.ModelViewSet):
    queryset = URL.objects.all()
    serializer_class = URLSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        # Set the user field with the primary key of the authenticated user
        request.data['user'] = request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)


    @action(detail=True, methods=['get'])
    def qr_code(self, request, pk=None):
        url = self.get_object()
        if url.qr_code:
            qr_code_path = url.qr_code.path
            response = FileResponse(open(qr_code_path, 'rb'), content_type='image/png')
            response['Content-Disposition'] = f'attachment; filename="{url.short_url}.png"'
            return response
        return Response({'detail': 'QR code not available for this URL.'}, status=404)


@api_view(['GET'])
@permission_classes([])
def get_long_url(request, short_url):
    if request.method == 'GET':
        url = URL.objects.get(short_url=short_url)
        url.clicks += 1
        url.save()

        # Capture click details
        click = Click(url=url, clicked_at=timezone.now(), ip_address=request.META.get('REMOTE_ADDR'))
        click.user_agent = request.META.get('HTTP_USER_AGENT')
        click.referrer = request.META.get('HTTP_REFERER')
        click.country = request.META.get('GEOIP_COUNTRY_NAME', 'Unknown')  # If using a GeoIP database
        click.city = request.META.get('GEOIP_CITY', 'Unknown')  # If using a GeoIP database
        click.save()
        if not (url.original_url.startswith('http://') or url.original_url.startswith('https://')):
            url.original_url = 'http://' + url.original_url  # You can add 'https://' if preferred

        return redirect(url.original_url)