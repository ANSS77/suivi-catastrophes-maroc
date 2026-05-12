from django.test import TestCase
from rest_framework.test import APIClient
from apps.predictions.models import Prediction, AiModel
from datetime import datetime


class PredictionModelTests(TestCase):
    """Tests pour le modèle Prediction."""

    def setUp(self):
        """Créer une prédiction de test."""
        self.prediction = Prediction(
            score=0.75,
            region="Casablanca-Settat",
            phenomenon="earthquake",
            date=datetime.utcnow()
        )
        self.prediction.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Prediction.objects.delete()

    def test_create_prediction(self):
        """Test de création d'une prédiction."""
        self.assertEqual(self.prediction.score, 0.75)
        self.assertEqual(self.prediction.region, "Casablanca-Settat")
        self.assertEqual(self.prediction.phenomenon, "earthquake")


class AiModelTests(TestCase):
    """Tests pour le modèle AiModel."""

    def setUp(self):
        """Créer un modèle IA de test."""
        self.ai_model = AiModel(
            modelType="Random Forest",
            phenomenon="earthquake",
            accuracy=0.9367,
            lastTrained=datetime.utcnow()
        )
        self.ai_model.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        AiModel.objects.delete()

    def test_create_ai_model(self):
        """Test de création d'un modèle IA."""
        self.assertEqual(self.ai_model.modelType, "Random Forest")
        self.assertEqual(self.ai_model.phenomenon, "earthquake")
        self.assertAlmostEqual(self.ai_model.accuracy, 0.9367, places=3)


class PredictionAPITests(TestCase):
    """Tests pour les endpoints de prédictions."""

    def setUp(self):
        """Configuration initiale."""
        self.client = APIClient()
        self.prediction_url = '/api/predictions/'

        self.prediction = Prediction(
            score=0.85,
            region="Rabat-Salé-Kénitra",
            phenomenon="flood",
            date=datetime.utcnow()
        )
        self.prediction.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Prediction.objects.delete()

    def test_get_predictions(self):
        """Test de récupération des prédictions."""
        response = self.client.get(self.prediction_url)
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)
