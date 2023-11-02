from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from account.models import User

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'name', 'password')
