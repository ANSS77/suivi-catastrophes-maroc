from apps.users.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from apps.alerts.models import Notification

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
    
    # Récupérer les régions de l'utilisateur
    notification = Notification.objects(userId=user.id).first()
    refresh['regionIds'] = notification.regionIds if notification else []
    
    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }