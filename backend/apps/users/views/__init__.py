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


from apps.core.utils.auth_utils import get_user_id_from_token

class ChooseRegionsView(APIView):
    def post(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = ChooseRegionsSerializer(data=request.data)
        if serializer.is_valid():
            region_ids = serializer.validated_data['regionIds']
            
            notification = Notification.objects(userId=ObjectId(user_id)).first()
            if notification:
                notification.regionIds = region_ids
                notification.save()
            else:
                Notification(
                    userId=ObjectId(user_id), regionIds=region_ids).save()
            
            return Response({'message': 'Régions sauvegardées.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateProfileView(APIView):
    def post(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        from apps.users.models import User
        user = User.objects(id=user_id).first()
        if not user:
            return Response({'error': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
            
        nom = request.data.get('nom')
        email = request.data.get('email')
        
        if email and email != user.email:
            if User.objects(email=email).first():
                return Response({'error': 'Cet email est déjà utilisé par un autre compte.'}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email
            
        if nom:
            user.nom = nom
            
        user.save()
        
        return Response({
            'message': 'Profil mis à jour.',
            'user': {
                'id': str(user.id),
                'nom': user.nom,
                'email': user.email,
                'role': user.role
            }
        }, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    def post(self, request):
        user_id = get_user_id_from_token(request)
        if not user_id:
            return Response({'error': 'Non authentifié.'}, status=status.HTTP_401_UNAUTHORIZED)
            
        from apps.users.models import User
        user = User.objects(id=user_id).first()
        if not user:
            return Response({'error': 'Utilisateur introuvable.'}, status=status.HTTP_404_NOT_FOUND)
            
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(current_password):
            return Response({'error': 'Le mot de passe actuel est incorrect.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if not new_password or len(new_password) < 6:
            return Response({'error': 'Le nouveau mot de passe doit contenir au moins 6 caractères.'}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        
        return Response({'message': 'Mot de passe mis à jour avec succès.'}, status=status.HTTP_200_OK)