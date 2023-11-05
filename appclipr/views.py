from rest_framework.decorators import api_view, action, permission_classes
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import (URLSerializer, SimpleURLSerializer)
from django.utils import timezone
from .models import URL, Click
from django.shortcuts import redirect
import urllib.request, urllib.parse, urllib.error, json, socket
import requests
from django.shortcuts import get_object_or_404


def get_public_ip():
    try:
        response = requests.get('http://httpbin.org/ip')
        if response.status_code == 200:
            data = response.json()
            public_ip = data.get('origin')
            return public_ip
        else:
            return None
    except Exception as e:
        print("Error:", e)
        return None


class URLViewSet(viewsets.ModelViewSet):
    queryset = URL.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'PATCH' or self.request.method == 'PUT':
            return SimpleURLSerializer
        return URLSerializer
        
    def list(self, request, *args, **kwargs):
        queryset = request.user.urls.all()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def retrieve(self, request, pk=None, *args, **kwargs):
        url = get_object_or_404(URL, pk=pk)
        if request.user == url.user:
            url = get_object_or_404(URL, pk=pk)
            serializer = self.get_serializer(url)
            return Response(serializer.data)
        else:
            return Response({'error': 'You do not have permission to view this URL'}, status=status.HTTP_403_FORBIDDEN)
        

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            validated_data['user'] = request.user
            url = URL.objects.create(**validated_data)
            
            return Response(URLSerializer(url).data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def update(self, request, pk=None, *args, **kwargs):
        url = get_object_or_404(URL, pk=pk)
        if request.user == url.user:
            url = get_object_or_404(URL, pk=pk)
            serializer = self.get_serializer(url, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'You do not have permission to update this URL'}, status=status.HTTP_403_FORBIDDEN)
    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
        
    def destroy(self, request, pk=None, *args, **kwargs):
        url = get_object_or_404(URL, pk=pk)
        if request.user == url.user:
            url.delete()
            return Response({'message': 'URL deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'You do not have permission to delete this URL'}, status=status.HTTP_403_FORBIDDEN)



@api_view(['GET'])
@permission_classes([])
def get_long_url(request, short_slug):
    if request.method == 'GET':
        url = URL.objects.get(short_slug=short_slug)
        url.clicks += 1
        url.save()

        # Capture click details
        public_ip = get_public_ip()
        serviceurl = 'http://www.geoplugin.net/json.gp?ip='+public_ip

        print('Retrieving', serviceurl)
        uh = urllib.request.urlopen(serviceurl)
        data = uh.read().decode()
        print('Retrieved', len(data), 'characters')
        js = json.loads(data)
        click = Click(url=url, clicked_at=timezone.now(), ip_address=public_ip)
        click.user_agent = request.META.get('HTTP_USER_AGENT')
        click.referrer = request.META.get('HTTP_REFERER')
        click.country = js['geoplugin_countryName']
        click.city = js['geoplugin_city']
        click.save()
        if not (url.original_url.startswith('http://') or url.original_url.startswith('https://')):
            url.original_url = 'http://' + url.original_url  # You can add 'https://' if preferred
        return redirect(url.original_url)