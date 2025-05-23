from rest_framework import serializers
from .models import Ticket, Comment, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'ticket', 'author', 'author_username', 'content', 'image', 'created_at']

class TicketSerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source='created_by.id')
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    category_name = serializers.ReadOnlyField(source='category.name')
    assigned_to = serializers.PrimaryKeyRelatedField(read_only=True)
    assigned_to_username = serializers.ReadOnlyField(source='assigned_to.username')

    class Meta:
        model = Ticket
        fields = [
            'id', 'title', 'description', 'category', 'category_name', 'status',
            'created_by', 'created_by_username',
            'assigned_to', 'assigned_to_username',
            'image_before',
            'created_at', 'updated_at'
        ]
