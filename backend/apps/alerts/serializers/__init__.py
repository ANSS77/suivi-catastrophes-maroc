from rest_framework import serializers


class AlertSerializer(serializers.Serializer):
    userId = serializers.CharField()
    regionId = serializers.CharField()
    message = serializers.CharField()
    date = serializers.DateTimeField(read_only=True)
    type = serializers.ChoiceField(choices=['earthquake', 'flood', 'wildfire'])


class NotificationSerializer(serializers.Serializer):
    userId = serializers.CharField()
    regionIds = serializers.ListField(child=serializers.CharField())
    alertId = serializers.CharField()
    isRead = serializers.BooleanField(default=False)
    isActive = serializers.BooleanField(default=True)