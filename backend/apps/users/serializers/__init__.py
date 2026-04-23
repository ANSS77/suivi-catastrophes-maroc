from rest_framework import serializers
from apps.users.models import User


class RegisterSerializer(serializers.Serializer):
    nom = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, min_length=6, write_only=True)

    def validate_email(self, value):
        if User.objects(email=value).first():
            raise serializers.ValidationError("Email déjà utilisé.")
        return value

    def create(self, validated_data):
        user = User(
            nom=validated_data['nom'],
            email=validated_data['email'],
            role='user',        # par défaut
            isActive=True       # par défaut
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)