from rest_framework import serializers
from .models import Ticket, Comment, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'author_username', 'content', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'category', 'status',
            'created_by', 'created_by_username',
            'assigned_to', 'assigned_to_username',
            'created_at', 'updated_at'
        ]