from rest_framework import generics, permissions
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class CurrentUserView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    