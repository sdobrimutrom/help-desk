from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, CommentViewSet, CategoryViewSet, ticket_statistics

router = DefaultRouter()
router.register(r'tickets', TicketViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns += [
    path("stats/overview/", ticket_statistics, name="ticket_statistics"),
]