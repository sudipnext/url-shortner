from django.shortcuts import redirect
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny


# Create your views here.
@api_view(['GET'])
@permission_classes([AllowAny,])
def user_activation(request, uid, token):
    target_url = f"http://localhost:3000/activate/{uid}/{token}"
    return redirect(target_url)