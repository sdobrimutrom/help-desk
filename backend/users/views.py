from rest_framework import generics, permissions, status, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_bytes
from django.http import JsonResponse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.views import View
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from .models import User
from .serializers import RegisterSerializer, UserSerializer
import logging
import json

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

class PublicPasswordResetView(View):
    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    
    def post(self, request):
        try:
            data = json.loads(request.body)
            email = data.get("email")
        except:
            return JsonResponse({"error": "Invalid JSON"}, status=400)
        
        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"detail": "If the email is valid, a reset link will be sent"}, status=200)
        
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        reset_link = f"http://localhost:3000/reset/{uid}/{token}"

        send_mail(
            subject="Password reset",
            message=f"Visit link to reset your password: {reset_link}",
            from_email="noreply@helpdesk.local",
            recipient_list=[email],
        )

        return JsonResponse({"detail": "Email is sent"}, status=200)

@csrf_exempt 
@api_view(["POST"])
@permission_classes([AllowAny])
def reset_password_confirm(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid Link"}, status=400)
    
    if not default_token_generator.check_token(user, token):
        return Response({"error": "Invalid or expired token"}, status=400)
    
    new_password1 = request.data.get("new_password1")
    new_password2 = request.data.get("new_password2")

    if new_password1 != new_password2 or not new_password1:
        return Response({"error": "Password do not match or empty"}, status=400)
    
    user.set_password(new_password1)
    user.save()
    
    return Response({"detail": "Password has been reset successfully"})
