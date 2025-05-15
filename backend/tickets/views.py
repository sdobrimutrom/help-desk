from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Ticket, Comment, Category
from .serializers import TicketSerializer, CommentSerializer, CategorySerializer
from .permissions import CanCommentOnTicket, CanDeleteTicket
import logging

logger = logging.getLogger('helpdesk')

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated, CanDeleteTicket]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Ticket.objects.all().order_by('-created_at')
        elif user.is_technician():
            return Ticket.objects.filter(assigned_to=user).order_by('-created_at')
        else:
            return Ticket.objects.filter(created_by=user).order_by('-created_at')

    def perform_create(self, serializer):
        ticket = serializer.save(created_by=self.request.user)
        logger.info(f"[TICKET CREATED] {self.request.user.username} created ticket ID {ticket.id}")

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, CanCommentOnTicket]

    def perform_create(self, serializer):
        comment = serializer.save(author=self.request.user)
        logger.info(f"[COMMENT ADDED] {self.request.user.username} added a comment to ticket {comment.ticket.id}")

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Comment.objects.all()
        if user.is_technician():
            return Comment.objects.filter(ticket__assigned_to=user)
        return Comment.objects.filter(ticket__created_by=user)
    
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