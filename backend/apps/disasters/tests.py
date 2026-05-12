from django.test import TestCase
from rest_framework.test import APIClient
from apps.disasters.models import Disaster
from datetime import datetime
from bson import ObjectId


class DisasterModelTests(TestCase):
    """Tests pour les modèles de catastrophes."""

    def setUp(self):
        """Créer des données de test."""
        self.disaster = Disaster(
            type='earthquake',
            region='Casablanca-Settat',
            latitude=33.6,
            longitude=-7.6,
            date=datetime.utcnow(),
            severity='medium',
            source='USGS',
            isActive=True
        )
        self.disaster.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Disaster.objects.delete()

    def test_create_disaster(self):
        """Test de création d'une catastrophe."""
        self.assertEqual(self.disaster.type, 'earthquake')
        self.assertEqual(self.disaster.region, 'Casablanca-Settat')
        self.assertEqual(self.disaster.severity, 'medium')
        self.assertTrue(self.disaster.isActive)


class DisasterAPITests(TestCase):
    """Tests pour les endpoints de catastrophes."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()
        self.disaster_url = '/api/disasters/'

        self.disaster = Disaster(
            type='earthquake',
            region='Rabat-Salé-Kénitra',
            latitude=34.0,
            longitude=-6.8,
            date=datetime.utcnow(),
            severity='high',
            source='USGS',
            isActive=True
        )
        self.disaster.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Disaster.objects.delete()

    def test_get_all_disasters(self):
        """Test de récupération de toutes les catastrophes."""
        response = self.client.get(self.disaster_url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_disaster_by_id(self):
        """Test de récupération d'une catastrophe par ID."""
        response = self.client.get(f'{self.disaster_url}{str(self.disaster.id)}/')
        self.assertEqual(response.status_code, 200)

    def test_get_nonexistent_disaster(self):
        """Test de récupération d'une catastrophe inexistante."""
        fake_id = str(ObjectId())
        response = self.client.get(f'{self.disaster_url}{fake_id}/')
        self.assertEqual(response.status_code, 404)

    def test_filter_disasters_by_type(self):
        """Test de filtrage par type de catastrophe."""
        response = self.client.get(f'{self.disaster_url}filter/?type=earthquake')
        self.assertEqual(response.status_code, 200)
