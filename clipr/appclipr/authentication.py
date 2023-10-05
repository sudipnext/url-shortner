from datetime import datetime, timedelta
import jwt
from django.conf import settings
from django.contrib.auth.models import get_user_model
from rest_framework import authentication
from rest_framework.exceptions import AuthenticationFailed, ParseError
#initializing the user model
User = get_user_model()

#authentication class
class JWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get('HTTP_AUTHORIZATION')
        if jwt_token is None:
            return None
        jwt_token = JWTAuthentication.get_token_from_header(jwt_token)
        #decoding the jwt and verifying it's signature
        try:
            payload = jwt.decode(jwt_token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.exceptions.InvalidSignatureError:
            raise AuthenticationFailed('Invalid Token')
        except:
            raise ParseError()
        #getting the user from the database
        username_or_phone_number = payload.get('user_identifier')
        if username_or_phone_number is None:
            raise AuthenticationFailed('User Identifier not found in JWT')
        user = User.objects.filter(username=username_or_phone_number).first()
        if user is None:
            user = User.objects.filter(phone_number=username_or_phone_number).first()
            if user is None:
                raise AuthenticationFailed('User not found')
        return (user, payload)
    def authenticate_header(self, request):
        return 'Bearer'
    
    @classmethod
    def get_token_from_header(cls, token):
        token = token.replace('Bearer', '').replace(' ', '')
        return token
    @classmethod
    def create_jwt(cls, user):
        payload = {
            'user_identifier': user.username,
            'exp': int((datetime.utcnow() + timedelta(hours=settings.JWT_CONF['TOKEN_LIFETIME_HOURS'])).timestamp()),
            'iat': datetime.now().timestamp(),
            'username': user.username,
            'phone_number': user.phone_number
        }
        jwt_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        return jwt_token
