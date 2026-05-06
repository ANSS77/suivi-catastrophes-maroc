from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    id       = serializers.CharField()
    nom      = serializers.CharField()
    email    = serializers.EmailField()
    role     = serializers.CharField()
    isActive = serializers.BooleanField()


class ToggleUserSerializer(serializers.Serializer):
    isActive = serializers.BooleanField()