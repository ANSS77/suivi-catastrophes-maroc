from rest_framework import serializers


class AlertSerializer(serializers.Serializer):
    _id = serializers.CharField(source='pk')
    userId = serializers.CharField()
    regionId = serializers.CharField()
    message = serializers.CharField()
    date = serializers.DateTimeField(read_only=True)
    type = serializers.ChoiceField(choices=['earthquake', 'flood', 'wildfire'])


class NotificationSerializer(serializers.Serializer):
    _id = serializers.CharField(source='pk')
    userId = serializers.CharField()
    regionIds = serializers.ListField(child=serializers.CharField(), required=False)
    alertId = serializers.CharField(required=False, allow_null=True)
    isRead = serializers.BooleanField(default=False)
    isActive = serializers.BooleanField(default=True)
    notif_type = serializers.CharField(required=False, allow_null=True)

    # Champs d'alerte
    type = serializers.CharField(required=False, allow_null=True)
    phenomenon = serializers.CharField(required=False, allow_null=True)
    regionName = serializers.CharField(required=False, allow_null=True)
    date = serializers.DateTimeField(required=False, allow_null=True)