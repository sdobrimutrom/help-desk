from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.core.cache import cache
from django_redis import get_redis_connection
from django.db.models import Count, Avg, F, ExpressionWrapper, DurationField, Case, When, Value, CharField
from django.db.models.functions import TruncDate
from django.utils.timezone import now
from .models import Ticket, Comment, Category
from .serializers import TicketSerializer, CommentSerializer, CategorySerializer
from .permissions import CanCommentOnTicket, CanDeleteTicket
from users.models import User
from datetime import timedelta
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

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ticket_statistics(request):
    if not request.user.is_admin():
        return Response({"detail": "Access denied"}, status=403)

    status_counts = Ticket.objects.values("status").annotate(count=Count("id"))

    category_counts = Ticket.objects.values("category__name").annotate(count=Count("id"))

    closed_tickets = Ticket.objects.filter(status="closed", updated_at__isnull=False)
    duration_expr = ExpressionWrapper(
        F("updated_at") - F("created_at"),
        output_field=DurationField()
    )
    avg_duration = closed_tickets.annotate(
        resolution_time=duration_expr
    ).aggregate(avg=Avg("resolution_time"))["avg"]
    formatted_duration = str(avg_duration).split(".")[0] if avg_duration else None

    top_tech = (
        Ticket.objects.filter(status="closed", assigned_to__isnull=False)
        .values("assigned_to__username")
        .annotate(total=Count("id"))
        .order_by("-total")
        .first()
    )

    tickets_by_day = (
        Ticket.objects.annotate(day=TruncDate("created_at"))
        .values("day").annotate(count=Count("id"))
        .order_by("day")
    )

    time_buckets = [
        When(resolution_time__lt=timedelta(hours=1), then=Value("<1h")),
        When(resolution_time__lt=timedelta(hours=4), then=Value("1–4h")),
        When(resolution_time__lt=timedelta(hours=24), then=Value("4–24h")),
        When(resolution_time__lt=timedelta(days=3), then=Value("1–3d")),
        When(resolution_time__gte=timedelta(days=3), then=Value(">3d")),
    ]
    resolution_distribution = (
        closed_tickets.annotate(resolution_time=duration_expr)
        .annotate(bucket=Case(*time_buckets, output_field=CharField()))
        .values("bucket").annotate(count=Count("id"))
    )

    technician_load = (
        Ticket.objects.filter(assigned_to__isnull=False)
        .values("assigned_to__username")
        .annotate(count=Count("id"))
    )

    status_ratio = {x["status"]: x["count"] for x in status_counts}

    unassigned = Ticket.objects.filter(assigned_to__isnull=True).count()

    top_users = (
        Ticket.objects.values("created_by__username")
        .annotate(count=Count("id"))
        .order_by("-count")[:5]
    )

    return Response({
        "status_counts": {x["status"]: x["count"] for x in status_counts},
        "category_counts": {x["category__name"] or "Uncategorized": x["count"] for x in category_counts},
        "average_resolution_time": formatted_duration,
        "top_technician": {
            "username": top_tech["assigned_to__username"],
            "resolved_tickets": top_tech["total"]
        } if top_tech else None,

        # New blocks
        "tickets_by_day": list(tickets_by_day),
        "resolution_distribution": {x["bucket"]: x["count"] for x in resolution_distribution},
        "technician_load": {x["assigned_to__username"]: x["count"] for x in technician_load},
        "status_ratio": status_ratio,
        "unassigned_tickets": unassigned,
        "most_active_users": {x["created_by__username"]: x["count"] for x in top_users}
    })