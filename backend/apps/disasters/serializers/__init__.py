from rest_framework import serializers


class DisasterSerializer(serializers.Serializer):
    type = serializers.ChoiceField(choices=['earthquake', 'flood', 'wildfire'])
    region = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    date = serializers.DateTimeField(read_only=True)
    severity = serializers.ChoiceField(choices=['low', 'medium', 'high'])
    source = serializers.CharField()
    isActive = serializers.BooleanField(default=True)
    score     = serializers.FloatField(default=0)