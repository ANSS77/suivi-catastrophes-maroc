from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.disasters.models import Disaster
from apps.disasters.serializers import DisasterSerializer
from apps.predictions.models import Prediction


def get_score(region: str, phenomenon: str) -> float:
    """Retourne le dernier score de prédiction pour une région + phénomène."""
    prediction = Prediction.objects(
        region=region,
        phenomenon=phenomenon
    ).order_by('-date').first()
    
    if prediction:
        return round(prediction.score * 100, 1)
    return 0.0


def serialize_disaster(d) -> dict:
    """Sérialise un Disaster avec son score."""
    data = DisasterSerializer(d).data
    data['score'] = get_score(d.region, d.type)
    return data


class DisasterView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        disasters = Disaster.objects.all()
        data = [serialize_disaster(d) for d in disasters]
        return Response(data, status=status.HTTP_200_OK)


class DisasterDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        disaster = Disaster.objects(id=pk).first()
        if disaster:
            return Response(serialize_disaster(disaster), status=status.HTTP_200_OK)
        return Response(
            {'error': 'Disaster introuvable.'},
            status=status.HTTP_404_NOT_FOUND
        )


class DisasterFilterView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        disaster_type = request.query_params.get('type')
        disasters = Disaster.objects(type=disaster_type)
        data = [serialize_disaster(d) for d in disasters]
        return Response(data, status=status.HTTP_200_OK)