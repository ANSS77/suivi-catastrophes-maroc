import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.alerts.models import Alert, Notification
from apps.alerts.serializers import AlertSerializer, NotificationSerializer
from apps.predictions.models import Prediction
from bson import ObjectId
from rest_framework.permissions import AllowAny
from apps.core.utils.auth_utils import get_user_id_from_token


def get_prediction(region: str, phenomenon: str) -> dict:
    """Retourne score + severity depuis la dernière Prediction."""
    prediction = Prediction.objects(
        region=region,
        phenomenon=phenomenon
    ).order_by('-date').first()

    if prediction:
        return {
            'score': round(prediction.score * 100, 1),
            'severity': prediction.severity or 'low',
        }
    return {'score': 0.0, 'severity': 'low'}


class AlertView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)

        alerts = Alert.objects(userId=ObjectId(user_id))
        data = []
        for a in alerts:
            alert_data = AlertSerializer(a).data
            pred = get_prediction(a.regionId, a.type)
            alert_data['score']    = pred['score']
            alert_data['severity'] = pred['severity']  # ← AJOUTÉ
            data.append(alert_data)
        return Response(data, status=status.HTTP_200_OK)


class NotificationView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)

        notifications = Notification.objects(
            userId=ObjectId(user_id),
            notif_type='alert'
        ).order_by('-date')

        data = [NotificationSerializer(n).data for n in notifications]
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        notification = Notification.objects(id=pk).first()
        if notification:
            notification.isRead = True
            notification.save()
            return Response(
                {'message': 'Notification marquée comme lue.'},
                status=status.HTTP_200_OK
            )
        return Response(
            {'error': 'Notification introuvable.'},
            status=status.HTTP_404_NOT_FOUND
        )