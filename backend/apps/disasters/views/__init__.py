from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.disasters.models import Disaster
from apps.disasters.serializers import DisasterSerializer


class DisasterView(APIView):
    def get(self, request):
        disasters = Disaster.objects.all()
        data = [DisasterSerializer(d).data for d in disasters]
        return Response(data, status=status.HTTP_200_OK)


class DisasterDetailView(APIView):
    def get(self, request, pk):
        disaster = Disaster.objects(id=pk).first()
        if disaster:
            return Response(DisasterSerializer(disaster).data, status=status.HTTP_200_OK)
        return Response({'error': 'Disaster introuvable.'}, status=status.HTTP_404_NOT_FOUND)


class DisasterFilterView(APIView):
    def get(self, request):
        disaster_type = request.query_params.get('type')
        disasters = Disaster.objects(type=disaster_type)
        data = [DisasterSerializer(d).data for d in disasters]
        return Response(data, status=status.HTTP_200_OK)