from rest_framework import generics, permissions, status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import RegisterSerializer, UserSerializer
import logging

logger = logging.getLogger('helpdesk')

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        logger.info(f"[REGISTER] New User: {user.username}, role: {user.role}")

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class LoggingTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        logger.info(f"[LOGIN] Success login: {self.user.username}")
        return data

class LoggingTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoggingTokenObtainPairSerializer

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    user = request.user
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not user.check_password(old_password):
        return Response({"detail": "Wrong old password"}, status=400)
    if not new_password or len(new_password) < 6:
        return Response({"detail": "Password is to short"}, status=400)
    
    user.set_password(new_password)
    user.save()

    return Response({"detail": "Password is changed successfully"}, status=200)