from rest_framework import serializers
from .models import URL, Tag, Click
from account.models import User

class URLSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = URL
        fields = '__all__'

class SimpleURLSerializer(serializers.ModelSerializer):
    class Meta:
        model = URL
        fields = ('id', 'original_url', 'short_slug', 'qr_code')

class SimpleClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Click
        fields = "__all__"