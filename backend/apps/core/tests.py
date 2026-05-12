from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User
from apps.core.utils.auth_utils import generate_tokens


class ThresholdAPITests(TestCase):
    """Tests pour les endpoints de seuils d'alerte."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()

        # Créer un admin
        self.admin = User(
            nom="Admin User",
            email="admin@example.com",
            role="admin",
            isActive=True
        )
        self.admin.set_password("adminpass123")
        self.admin.save()

        # Créer un user normal
        self.user = User(
            nom="Normal User",
            email="user@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("userpass123")
        self.user.save()

        # Générer les tokens
        admin_tokens = generate_tokens(self.admin)
        user_tokens = generate_tokens(self.user)

        self.admin_token = admin_tokens['access']
        self.user_token = user_tokens['access']

    def tearDown(self):
        """Nettoyer après les tests."""
        User.objects(email="admin@example.com").delete()
        User.objects(email="user@example.com").delete()

    def test_get_thresholds_public(self):
        """Test que les seuils sont accessibles publiquement."""
        response = self.client.get('/api/admin/thresholds/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertTrue(len(data) > 0)

    def test_update_threshold_admin(self):
        """Test de mise à jour d'un seuil par admin."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.put('/api/admin/thresholds/', {
            'phenomenon': 'earthquake',
            'threshold': 80.0
        }, format='json')
        self.assertEqual(response.status_code, 200)

    def test_update_threshold_user_forbidden(self):
        """Test que les utilisateurs non-admin ne peuvent pas modifier les seuils."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.put('/api/admin/thresholds/', {
            'phenomenon': 'earthquake',
            'threshold': 80.0
        }, format='json')
        self.assertEqual(response.status_code, 403)

    def test_update_threshold_unauthenticated(self):
        """Test que les utilisateurs non-authentifiés ne peuvent pas modifier les seuils."""
        response = self.client.put('/api/admin/thresholds/', {
            'phenomenon': 'earthquake',
            'threshold': 80.0
        }, format='json')
        self.assertEqual(response.status_code, 401)


class UserManagementAPITests(TestCase):
    """Tests pour la gestion des utilisateurs (admin)."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()

        # Créer un admin
        self.admin = User(
            nom="Admin User",
            email="admin@example.com",
            role="admin",
            isActive=True
        )
        self.admin.set_password("adminpass123")
        self.admin.save()

        # Créer un user normal
        self.user = User(
            nom="Normal User",
            email="user@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("userpass123")
        self.user.save()

        # Générer les tokens
        admin_tokens = generate_tokens(self.admin)
        user_tokens = generate_tokens(self.user)

        self.admin_token = admin_tokens['access']
        self.user_token = user_tokens['access']

    def tearDown(self):
        """Nettoyer après les tests."""
        User.objects(email="admin@example.com").delete()
        User.objects(email="user@example.com").delete()

    def test_list_users_admin(self):
        """Test de liste des utilisateurs par admin."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)

    def test_list_users_user_forbidden(self):
        """Test que les utilisateurs non-admin ne peuvent pas lister les users."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get('/api/admin/users/')
        self.assertEqual(response.status_code, 403)

    def test_toggle_user_admin(self):
        """Test de toggle d'utilisateur par admin."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.patch(f'/api/admin/users/{str(self.user.id)}/toggle/')
        self.assertEqual(response.status_code, 200)

    def test_toggle_user_user_forbidden(self):
        """Test que les utilisateurs non-admin ne peuvent pas toggle."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.patch(f'/api/admin/users/{str(self.admin.id)}/toggle/')
        self.assertEqual(response.status_code, 403)

    def test_delete_user_admin(self):
        """Test de suppression d'utilisateur par admin."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.admin_token}')
        response = self.client.delete(f'/api/admin/users/{str(self.user.id)}/delete/')
        self.assertEqual(response.status_code, 200)

    def test_delete_user_user_forbidden(self):
        """Test que les utilisateurs non-admin ne peuvent pas supprimer."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.delete(f'/api/admin/users/{str(self.admin.id)}/delete/')
        self.assertEqual(response.status_code, 403)
