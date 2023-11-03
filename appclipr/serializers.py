from rest_framework import serializers
from .models import URL
from account.models import User

class URLSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = URL
        fields = '__all__'

class URLCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ('id', 'original_url', 'short_slug', 'description')

class URLUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ('id','original_url', 'short_slug', 'description')