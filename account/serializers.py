from djoser.serializers import UserCreateSerializer
from account.models import User

#name is same but it's inhereting from djoser's UserCreateSerializer
class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id','email', 'name', 'password')