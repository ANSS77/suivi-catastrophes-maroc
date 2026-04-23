from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken


def authenticate_user(input_email, input_password):
    user = User.objects(email=input_email).first() # chercher en DB
    if user and user.check_password(input_password): # vérifier password hashé
        return user
    return None


def generate_tokens(user):
    token = RefreshToken()
    token['user_id'] = str(user.id)
    return {
        'access': str(token.access_token),
        'refresh': str(token)
    }