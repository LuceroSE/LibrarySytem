from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Allow owners and admin users to access objects.
    """

    def has_object_permission(self, request, view, obj):
        # Admin users can access anything
        if request.user.is_staff:
            return True

        # Regular users can only access their own objects
        return obj.user == request.user