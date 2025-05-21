from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache
from django_redis import get_redis_connection
from .models import Ticket, Comment, Category
from .serializers import TicketSerializer, CommentSerializer, CategorySerializer
from .permissions import CanCommentOnTicket, CanDeleteTicket
from users.models import User
import logging

logger = logging.getLogger('helpdesk')

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated, CanDeleteTicket]

    def get_queryset(self):
        user = self.request.user
        cache_key = f"ticket_list_ids_{user.id}_{user.role}"
        logger.info(f"[CACHE] GET key={cache_key}")
        cached_ids = cache.get(cache_key)

        if cached_ids:
            logger.info(f"[CACHE] HIT")
            return Ticket.objects.filter(id__in=cached_ids)

        if user.is_admin():
            qs = Ticket.objects.all()
        elif user.is_technician():
            qs = Ticket.objects.filter(assigned_to=user)
        else:
            qs = Ticket.objects.filter(created_by=user)

        ids = list(qs.values_list("id", flat=True))
        cache.set(cache_key, ids, timeout=60)
        logger.info(f"[CACHE] MISS + SET IDs: {ids}")
        return qs

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)
        cache.delete(f"ticket_list_{self.request.user.id}_employee")
        logger.info(f"[TICKET CREATED] {self.request.user.username} created ticket ID {ticket.id}")

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user.is_admin() and "assigned_to" in request.data:
            user_id = request.data.get("assigned_to")
            try:
                technician = User.objects.get(id=user_id, role=User.Role.TECHNICIAN)
                instance.assigned_to = technician
                instance.save()

                from django_redis import get_redis_connection
                redis = get_redis_connection("default")
                for user_id in [instance.created_by.id, technician.id]:
                    keys = redis.keys(f"helpdesk:ticket_list_*_{user_id}")
                    for key in keys:
                        redis.delete(key)

                logger.info(f"[TICKET UPDATED] {request.user.username} assigned ticket {instance.id} to {technician.username}")
            except User.DoesNotExist:
                return Response({"error": "Technician not found"}, status=400)

        return super().partial_update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        user_id = instance.created_by.id

        cache.delete_pattern(f"ticket_list_ids_{user_id}_*")
        if instance.assigned_to:
            cache.delete_pattern(f"ticket_list_{instance.assigned_to.id}_*")

        return super().destroy(request, *args, **kwargs)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, CanCommentOnTicket]

    def perform_create(self, serializer):
        user = self.request.user
        ticket = serializer.validated_data.get("ticket")

        if user.is_admin():
            pass
        elif user.is_technician() and ticket.assigned_to != user:
            raise PermissionDenied("You don't have an access to this ticket.")
        elif user.is_employee() and ticket.created_by != user:
            raise PermissionDenied("You don't have an access to this ticket.")
        elif not user.is_admin() and not user.is_technician() and not user.is_employee():
            raise PermissionDenied("Permission denied.")
        
        comment = serializer.save(author=user)
        logger.info(f"[COMMENT ADDED] {self.request.user.username} added a comment to ticket {comment.ticket.id}")
        cache.delete_pattern(f"comments_ticket_{comment.ticket_id}_*")

    def get_queryset(self):
        user = self.request.user
        ticket_id = self.request.query_params.get("ticket")

        cache_key = f"comments_ticket_{ticket_id}_user_{user.id}_role_{user.role}"
        cached = cache.get(cache_key)
        if cached:
            return cached

        if user.is_admin():
            queryset = Comment.objects.all()
        elif user.is_technician():
            queryset = Comment.objects.filter(ticket__assigned_to=user)
        else:
            queryset = Comment.objects.filter(ticket__created_by=user)

        if ticket_id:
            queryset = queryset.filter(ticket_id=ticket_id)

        cache.set(cache_key, queryset, timeout=60)
        return queryset
    
    def options(self, request, *args, **kwargs):
        response = super().options(request, *args, **kwargs)
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return response
    
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

