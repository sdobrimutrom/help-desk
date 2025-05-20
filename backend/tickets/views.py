from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.cache import cache
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
        cache_key = f"ticket_list_{user.id}_{user.role}"
        cached_qs = cache.get(cache_key)

        if cached_qs:
            return cached_qs

        if user.is_admin():
            qs = Ticket.objects.all()
        elif user.is_technician():
            qs = Ticket.objects.filter(assigned_to=user)
        else:
            qs = Ticket.objects.filter(created_by=user)
        
        cache.set(cache_key, qs, timeout=60)
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
                technician = User.objects.get(id = user_id, role = User.Role.TECHNICIAN)
                instance.assigned_to = technician
                instance.save()
                logger.info(f"[TICKET UPDATED] {self.request.user.username} updated ticket ID {ticket.id}")
            except User.DoesNotExist:
                return Response({"error": "Technician is not found"}, status=400)
        return super().partial_update(request, *args, **kwargs)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, CanCommentOnTicket]

    def perform_create(self, serializer):
        comment = serializer.save(author=self.request.user)
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