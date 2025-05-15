from rest_framework import viewsets
from .models import Ticket, Comment, Category
from .serializers import TicketSerializer, CommentSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated
from .permissions import CanCommentOnTicket

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Ticket.objects.all().order_by('-created_at')
        elif user.is_technician():
            return Ticket.objects.filter(assigned_to=user).order_by('-created_at')
        else:
            return Ticket.objects.filter(created_by=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('created_at')
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated, CanCommentOnTicket]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Comment.objects.all()
        if user.is_technician():
            return Comment.objects.filter(ticket__assigned_to=user)
        return Comment.objects.filter(ticket__created_by=user)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]