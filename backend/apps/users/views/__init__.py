from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import RegisterSerializer, LoginSerializer
from apps.users.services import authenticate_user, generate_tokens
from apps.alerts.models import Notification
from apps.users.serializers import ChooseRegionsSerializer
from bson import ObjectId
from rest_framework.permissions import AllowAny


class RegisterView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Compte créé avec succès.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate_user(
                input_email=serializer.validated_data['email'],
                input_password=serializer.validated_data['password']
            )
            if user:
                tokens = generate_tokens(user)
                return Response(tokens, status=status.HTTP_200_OK)
            return Response({'error': 'Email ou mot de passe incorrect.'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        return Response({'message': 'Déconnecté avec succès.'}, status=status.HTTP_200_OK)


class ChooseRegionsView(APIView):
    def post(self, request):
        serializer = ChooseRegionsSerializer(data=request.data)
        if serializer.is_valid():
            user_id = request.auth.get('user_id')
            region_ids = [ObjectId(r) for r in serializer.validated_data['regionIds']]
            
            notification = Notification.objects(userId=ObjectId(user_id)).first()
            if notification:
                notification.regionIds = region_ids
                notification.save()
            else:
                Notification(
                    userId=ObjectId(user_id), regionIds=region_ids).save()
            
            return Response({'message': 'Régions sauvegardées.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)