from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    id       = serializers.CharField()
    nom      = serializers.CharField()
    email    = serializers.EmailField()
    role     = serializers.CharField()
    isActive = serializers.BooleanField()


class ToggleUserSerializer(serializers.Serializer):
    isActive = serializers.BooleanField()

class ThresholdSerializer(serializers.Serializer):
    phenomenon = serializers.ChoiceField(
        choices=['earthquake', 'flood', 'wildfire']
    )
    threshold = serializers.FloatField(min_value=0.0, max_value=100.0) 
