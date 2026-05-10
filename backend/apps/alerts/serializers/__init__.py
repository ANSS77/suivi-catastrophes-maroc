from rest_framework import serializers


class AlertSerializer(serializers.Serializer):
    userId = serializers.CharField()
    regionId = serializers.CharField()
    message = serializers.CharField()
    date = serializers.DateTimeField(read_only=True)
    type = serializers.ChoiceField(choices=['earthquake', 'flood', 'wildfire'])


class NotificationSerializer(serializers.Serializer):
    _id       = serializers.CharField(source='pk')
    userId = serializers.CharField()
    regionIds = serializers.ListField(child=serializers.CharField(), required=False)
    alertId = serializers.CharField(required=False)
    isRead = serializers.BooleanField(default=False)
    isActive = serializers.BooleanField(default=True)
    
    # Nouveaux champs pour le contenu des notifications
    phenomenon = serializers.CharField(required=False)
    regionName = serializers.CharField(required=False)
    date = serializers.DateTimeField(required=False)