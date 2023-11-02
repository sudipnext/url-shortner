from rest_framework import serializers
from .models import URL
from account.models import User

class URLSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = URL
        fields = '__all__'
