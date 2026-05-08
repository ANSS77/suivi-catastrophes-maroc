import jwt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.alerts.models import Alert, Notification
from apps.alerts.serializers import AlertSerializer, NotificationSerializer
from bson import ObjectId
from rest_framework.permissions import AllowAny


def get_user_id_from_token(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            # On utilise SECRET_KEY pour décoder car SIMPLE_JWT n'est pas activé globalement
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return payload.get('user_id')
        except Exception as e:
            print(f"JWT Decode Error: {e}")
            return None
    return None

class AlertView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)
        
        alerts = Alert.objects(userId=ObjectId(user_id))
        data = [AlertSerializer(a).data for a in alerts]
        return Response(data, status=status.HTTP_200_OK)


class NotificationView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        notifications = Notification.objects(userId=ObjectId(user_id))
        data = [NotificationSerializer(n).data for n in notifications]
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        notification = Notification.objects(id=pk).first()
        if notification:
            notification.isRead = True
            notification.save()
            return Response({'message': 'Notification marquée comme lue.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Notification introuvable.'}, status=status.HTTP_404_NOT_FOUND)