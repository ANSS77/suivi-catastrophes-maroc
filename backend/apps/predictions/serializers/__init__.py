 
from rest_framework import serializers


class PredictionSerializer(serializers.Serializer):
    score = serializers.FloatField()
    region = serializers.CharField()
    phenomenon = serializers.ChoiceField(
        choices=['earthquake', 'flood', 'wildfire']
    )
    date = serializers.DateTimeField(read_only=True)