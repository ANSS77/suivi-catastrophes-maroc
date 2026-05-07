from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.users.models import User

class UserListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Retourne la liste de tous les users."""
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


class ToggleUserView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, user_id):
        """Active ou désactive un user."""
        try:
            user = User.objects(id=user_id).first()
            if not user:
                return Response(
                    {"error": "User non trouvé"},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Toggle isActive
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
        
class DeleteUserView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, user_id):
        """Supprimer un user."""
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