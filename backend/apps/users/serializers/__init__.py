from rest_framework import serializers
from apps.users.models import User
from apps.alerts.models import Notification

class RegisterSerializer(serializers.Serializer):
    nom = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=6, write_only=True)
    regions = serializers.ListField(child=serializers.CharField(), required=False, default=[])

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("Email déjà utilisé.")
        return value

    def create(self, validated_data):
        
        user = User(
            nom=validated_data['nom'],
            email=validated_data['email'],
            role='user',
            isActive=True
        )
        user.set_password(validated_data['password'])
        user.save()
        
        # Sauvegarder les régions choisies lors de l'inscription
        regions = validated_data.get('regions', [])
        if regions:
            Notification(userId=user.id, regionIds=regions).save()
            
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChooseRegionsSerializer(serializers.Serializer):
    regionIds = serializers.ListField(
    child=serializers.CharField(), required=True)
