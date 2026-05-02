from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken


def authenticate_user(input_email, input_password):
    user = User.objects(email=input_email).first()
    if user and user.check_password(input_password):
        return user
    return None


def generate_tokens(user):
    # ✅ Créer token manuellement sans vérification Django Auth
    refresh = RefreshToken()
    refresh['user_id'] = str(user.id)   # ObjectId → string
    refresh['email']   = user.email
    refresh['role']    = user.role
    refresh['nom']     = user.nom
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }