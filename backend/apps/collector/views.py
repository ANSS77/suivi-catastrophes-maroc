from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.users.models import User
from apps.core.utils.auth_utils import get_user_id_from_token


def check_admin(request):
    """Vérifie que l'utilisateur est admin."""
    user_id = get_user_id_from_token(request)
    if not user_id:
        return False, Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)

    user = User.objects(id=user_id).first()
    if not user or user.role != 'admin':
        return False, Response({'error': 'Accès refusé. Admin requis.'}, status=status.HTTP_403_FORBIDDEN)
    return True, None


class ManualCollectionView(APIView):
    """
    Endpoint pour déclencher manuellement la collecte de données.
    Admin uniquement.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        """Déclenche la collecte manuelle."""
        is_authorized, error_response = check_admin(request)
        if not is_authorized:
            return error_response

        source = request.data.get('source', 'all')

        try:
            from apps.collector.tasks import (
                collect_wildfires_task,
                collect_earthquakes_task,
                collect_floods_task
            )

            results = {}

            if source == 'all':
                results['wildfires'] = collect_wildfires_task()
                results['earthquakes'] = collect_earthquakes_task()
                results['floods'] = collect_floods_task()
            elif source == 'usgs' or source == 'earthquakes':
                results['earthquakes'] = collect_earthquakes_task()
            elif source == 'nasa_firms' or source == 'wildfires':
                results['wildfires'] = collect_wildfires_task()
            elif source == 'nasa_power' or source == 'floods':
                results['floods'] = collect_floods_task()
            else:
                return Response(
                    {'error': f'Source invalide: {source}. Sources valides: all, usgs, nasa_firms, nasa_power'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            return Response({
                'message': 'Collecte terminée avec succès.',
                'results': results
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': f'Erreur lors de la collecte: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get(self, request):
        """Retourne le statut du collecteur."""
        is_authorized, error_response = check_admin(request)
        if not is_authorized:
            return error_response

        from apps.collector.models import Collector

        collectors = Collector.objects.all().order_by('-lastRun')[:10]
        data = [
            {
                'id': str(c.id),
                'schedule': c.schedule,
                'status': c.status,
                'lastRun': c.lastRun.isoformat() if c.lastRun else None
            }
            for c in collectors
        ]

        return Response(data, status=status.HTTP_200_OK)
