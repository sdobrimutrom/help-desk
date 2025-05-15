from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]