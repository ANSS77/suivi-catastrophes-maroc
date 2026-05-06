import re
from pathlib import Path
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.core import constants
from apps.core.serializers.threshold_serializers import ThresholdSerializer


CONSTANTS_PATH = Path(__file__).resolve().parent.parent.parent / 'core' / 'constants.py'


class ThresholdView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Retourne les seuils actuels."""
        data = [
            {"phenomenon": k, "threshold": v}
            for k, v in constants.ALERT_THRESHOLDS.items()
        ]
        return Response(data, status=status.HTTP_200_OK)

    def put(self, request):
        """Modifie un seuil d'alerte."""
        serializer = ThresholdSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        phenomenon = serializer.validated_data['phenomenon']
        threshold  = serializer.validated_data['threshold']

        # Mettre à jour en mémoire
        constants.ALERT_THRESHOLDS[phenomenon] = threshold

        # Mettre à jour constants.py sur disque
        try:
            with open(CONSTANTS_PATH, 'r', encoding='utf-8') as f:
                content = f.read()

            content = re.sub(
                rf"'{phenomenon}':\s*[0-9.]+",
                f"'{phenomenon}': {threshold}",
                content
            )

            with open(CONSTANTS_PATH, 'w', encoding='utf-8') as f:
                f.write(content)

        except Exception as e:
            return Response(
                {"error": f"Erreur mise à jour fichier: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            {"message": f"Seuil {phenomenon} mis à jour → {threshold}%"},
            status=status.HTTP_200_OK
        )