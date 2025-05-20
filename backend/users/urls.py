from django.urls import path
from .views import RegisterView, CurrentUserView, LoggingTokenObtainPairView, change_password, UserManagementViewSet, reset_password_confirm
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth import views as auth_views
from .views import PublicPasswordResetView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('token/', LoggingTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password/', change_password, name="change_password"),
    path('password-reset/', PublicPasswordResetView.as_view(), name='password_reset'),
    path('password-reset/done', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path("reset/<uidb64>/<token>/", reset_password_confirm, name="password_reset_api"),
    path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),
]

router = DefaultRouter()
router.register(r'users', UserManagementViewSet, basename='users')

urlpatterns += router.urls