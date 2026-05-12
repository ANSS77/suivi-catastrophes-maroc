from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User
from bson import ObjectId


class UserModelTests(TestCase):
    """Tests pour le modèle User."""

    def setUp(self):
        """Créer un utilisateur de test."""
        self.user = User(
            nom="Test User",
            email="test@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("testpassword123")
        self.user.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        User.objects(email="test@example.com").delete()
        User.objects(email="newuser@example.com").delete()

    def test_create_user(self):
        """Test de création d'un utilisateur."""
        self.assertEqual(self.user.nom, "Test User")
        self.assertEqual(self.user.email, "test@example.com")
        self.assertEqual(self.user.role, "user")
        self.assertTrue(self.user.isActive)

    def test_password_hashing(self):
        """Test que le mot de passe est correctement hashé."""
        self.assertNotEqual(self.user.password, "testpassword123")
        self.assertTrue(self.user.check_password("testpassword123"))
        self.assertFalse(self.user.check_password("wrongpassword"))


class AuthAPITests(TestCase):
    """Tests pour les endpoints d'authentification."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()
        self.register_url = '/api/auth/register/'
        self.login_url = '/api/auth/login/'
        self.logout_url = '/api/auth/logout/'

        # Créer un utilisateur de test
        self.user = User(
            nom="Test User",
            email="test@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("password123")
        self.user.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        User.objects(email="test@example.com").delete()
        User.objects(email="newuser@example.com").delete()

    def test_register_success(self):
        """Test d'inscription réussie."""
        data = {
            "nom": "New User",
            "email": "newuser@example.com",
            "password": "password123",
            "regions": ["Casablanca-Settat"]
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, 201)

    def test_register_duplicate_email(self):
        """Test d'inscription avec email déjà utilisé."""
        data = {
            "nom": "Another User",
            "email": "test@example.com",
            "password": "password123",
            "regions": ["Casablanca-Settat"]
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, 400)

    def test_login_success(self):
        """Test de connexion réussie."""
        data = {
            "email": "test@example.com",
            "password": "password123"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.json())
        self.assertIn('refresh', response.json())

    def test_login_wrong_password(self):
        """Test de connexion avec mauvais mot de passe."""
        data = {
            "email": "test@example.com",
            "password": "wrongpassword"
        }
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, 401)
