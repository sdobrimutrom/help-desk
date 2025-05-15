from rest_framework.permissions import BasePermission, SAFE_METHODS

class CanCommentOnTicket(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        ticket = obj.ticket

        if user.is_admin():
            return True
        if user.is_technician():
            return ticket.assigned_to == user
        if user.is_employee():
            return ticket.created_by == user
        return False
    
class CanDeleteTicket(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method == "DELETE":
            return obj.created_by == request.user or request.user.is_admin()
        return True