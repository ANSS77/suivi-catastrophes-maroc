from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.serializers import RegisterSerializer, LoginSerializer
from apps.users.services import authenticate_user, generate_tokens


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Compte créé avec succès.'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
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
    def post(self, request):
        token = request.data.get('refresh')
        RefreshToken(token).blacklist()
        return Response({'message': 'Déconnecté avec succès.'}, status=status.HTTP_200_OK)