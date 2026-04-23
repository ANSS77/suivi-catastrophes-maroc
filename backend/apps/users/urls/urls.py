from django.urls import path
from apps.users.views import RegisterView, LoginView, LogoutView


# APIView → utiliser .as_view() pour convertir la classe en vue
urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='auth-register'),
    path('auth/login/',    LoginView.as_view(),    name='auth-login'),
    path('auth/logout/',   LogoutView.as_view(),   name='auth-logout'),
]