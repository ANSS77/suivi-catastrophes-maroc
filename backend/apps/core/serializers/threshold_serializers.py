from rest_framework import serializers
from apps.core.constants import ALERT_THRESHOLDS


class ThresholdSerializer(serializers.Serializer):
    phenomenon = serializers.ChoiceField(
        choices=['earthquake', 'flood', 'wildfire']
    )
    threshold = serializers.FloatField(min_value=0.0, max_value=100.0)