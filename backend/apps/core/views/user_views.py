
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.users.models import User
from apps.core.utils.auth_utils import get_user_id_from_token


class IsAdminMixin:
    """Mixin pour vérifier que l'utilisateur est admin."""
    def check_admin(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return False, Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)

        user = User.objects(id=user_id).first()
        if not user or user.role != 'admin':
            return False, Response({'error': 'Accès refusé. Admin requis.'}, status=status.HTTP_403_FORBIDDEN)
        return True, None


class UserListView(APIView, IsAdminMixin):
    permission_classes = [AllowAny]

    def get(self, request):
        is_authorized, error_response = self.check_admin(request)
        if not is_authorized:
            return error_response

        users = User.objects.all()
        data = [
            {
                "id"      : str(user.id),
                "nom"     : user.nom,
                "email"   : user.email,
                "role"    : user.role,
                "isActive": user.isActive,
            }
            for user in users
        ]
        return Response(data, status=status.HTTP_200_OK)


class ToggleUserView(APIView, IsAdminMixin):
    permission_classes = [AllowAny]

    def patch(self, request, user_id):
        is_authorized, error_response = self.check_admin(request)
        if not is_authorized:
            return error_response

        try:
            user = User.objects(id=user_id).first()
            if not user:
                return Response(
                    {"error": "User non trouvé"},
                    status=status.HTTP_404_NOT_FOUND
                )

            user.isActive = not user.isActive
            user.save()

            return Response(
                {
                    "message" : f"User {user.email} {'activé' if user.isActive else 'désactivé'}",
                    "isActive": user.isActive,
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteUserView(APIView, IsAdminMixin):
    permission_classes = [AllowAny]

    def delete(self, request, user_id):
        is_authorized, error_response = self.check_admin(request)
        if not is_authorized:
            return error_response

        try:
            user = User.objects(id=user_id).first()
            if not user:
                return Response(
                    {"error": "User non trouvé"},
                    status=status.HTTP_404_NOT_FOUND
                )

            user.delete()

            return Response(
                {"message": f"User {user.email} supprimé"},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
