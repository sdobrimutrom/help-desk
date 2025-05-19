from rest_framework import generics, permissions, status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, action
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

class CurrentUserView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user
    
class LoggingTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        logger.info(f"[LOGIN] Success login: {self.user.username}")
        return data

class LoggingTokenObtainPairView(TokenObtainPairView):
    serializer_class = LoggingTokenObtainPairSerializer

class isAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_admin()

class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [isAdminOnly]

    @action(detail=False, methods=["post"], permission_classes=[isAdminOnly])
    def create_technician(self, request):
        data = request.data.copy()
        data["role"] = User.Role.TECHNICIAN
        serializer = RegisterSerializer(data=data)

        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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