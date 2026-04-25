from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.alerts.models import Alert, Notification
from apps.alerts.serializers import AlertSerializer, NotificationSerializer


class AlertView(APIView):
    def get(self, request):
        alerts = Alert.objects(userId=request.user_id)
        data = [AlertSerializer(a).data for a in alerts]
        return Response(data, status=status.HTTP_200_OK)


class NotificationView(APIView):
    def get(self, request):
        notifications = Notification.objects(userId=request.user_id)
        data = [NotificationSerializer(n).data for n in notifications]
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        notification = Notification.objects(id=pk).first()
        if notification:
            notification.isRead = True
            notification.save()
            return Response({'message': 'Notification marquée comme lue.'}, status=status.HTTP_200_OK)
        return Response({'error': 'Notification introuvable.'}, status=status.HTTP_404_NOT_FOUND)