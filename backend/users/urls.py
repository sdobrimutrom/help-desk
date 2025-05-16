from django.urls import path
from .views import RegisterView, CurrentUserView, LoggingTokenObtainPairView, change_password, UserManagementViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('token/', LoggingTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', change_password, name="change_password")
]

router = DefaultRouter()
router.register(r'users', UserManagementViewSet, basename='users')

urlpatterns += router.urls