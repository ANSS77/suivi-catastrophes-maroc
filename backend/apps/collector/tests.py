from django.test import TestCase
from rest_framework.test import APIClient
from apps.users.models import User
from apps.collector.models import Collector
from datetime import datetime
from apps.core.utils.auth_utils import generate_tokens


class CollectorModelTests(TestCase):
    """Tests pour le modèle Collector."""

    def setUp(self):
        """Créer un collecteur de test."""
        self.collector = Collector(
            schedule="every_hour",
            lastRun=datetime.utcnow(),
            status="idle"
        )
        self.collector.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Collector.objects.delete()

    def test_create_collector(self):
        """Test de création d'un collecteur."""
        self.assertEqual(self.collector.schedule, "every_hour")
        self.assertEqual(self.collector.status, "idle")


class CollectorAPITests(TestCase):
    """Tests pour les endpoints du collecteur."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()

        self.admin = User(
            nom="Admin User",
            email="admin@example.com",
            role="admin",
            isActive=True
        )
        self.admin.set_password("adminpass123")
        self.admin.save()

        self.user = User(
            nom="Normal User",
            email="user@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("userpass123")
        self.user.save()

        admin_tokens = generate_tokens(self.admin)
        user_tokens = generate_tokens(self.user)

        self.admin_token = admin_tokens['access']
        self.user_token = user_tokens['access']

    def tearDown(self):
        """Nettoyer après les tests."""
        User.objects(email="admin@example.com").delete()
        User.objects(email="user@example.com").delete()
        Collector.objects.delete()

    def test_manual_collection_user_forbidden(self):
        """Test que les utilisateurs non-admin ne peuvent pas lancer la collecte."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.post('/api/admin/collect/', {'source': 'all'}, format='json')
        self.assertEqual(response.status_code, 403)

    def test_manual_collection_unauthenticated(self):
        """Test que les utilisateurs non-authentifiés ne peuvent pas lancer la collecte."""
        response = self.client.post('/api/admin/collect/', {'source': 'all'}, format='json')
        self.assertEqual(response.status_code, 401)
