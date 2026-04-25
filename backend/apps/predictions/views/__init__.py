 
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.predictions.models import Prediction
from apps.predictions.serializers import PredictionSerializer


class PredictionView(APIView):
    def get(self, request):
        predictions = Prediction.objects.all()
        data = [PredictionSerializer(p).data for p in predictions]
        return Response(data, status=status.HTTP_200_OK)