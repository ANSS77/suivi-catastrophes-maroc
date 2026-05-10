import jwt
from django.conf import settings

def get_user_id_from_token(request):
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]
        try:
            # On utilise SECRET_KEY pour décoder car SIMPLE_JWT n'est pas activé globalement
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            return payload.get('user_id')
        except Exception as e:
            print(f"JWT Decode Error: {e}")
            return None
    return None
