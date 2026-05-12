from django.test import TestCase
from apps.alerts.models import Alert, Notification
from apps.users.models import User
from datetime import datetime


class AlertModelTests(TestCase):
    """Tests pour le modèle Alert."""

    def setUp(self):
        """Créer des données de test."""
        self.user = User(
            nom="Test User",
            email="test@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("password123")
        self.user.save()

        self.alert = Alert(
            userId=self.user.id,
            regionId="Casablanca-Settat",
            message="Test alert message",
            date=datetime.utcnow(),
            type="earthquake"
        )
        self.alert.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Alert.objects.delete()
        User.objects(email="test@example.com").delete()

    def test_create_alert(self):
        """Test de création d'une alerte."""
        self.assertEqual(self.alert.userId, self.user.id)
        self.assertEqual(self.alert.regionId, "Casablanca-Settat")
        self.assertEqual(self.alert.type, "earthquake")


class NotificationModelTests(TestCase):
    """Tests pour le modèle Notification."""

    def setUp(self):
        """Créer des données de test."""
        self.user = User(
            nom="Test User",
            email="test@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("password123")
        self.user.save()

        self.notification = Notification(
            userId=self.user.id,
            regionIds=["Casablanca-Settat", "Rabat-Salé-Kénitra"],
            isRead=False,
            isActive=True,
            phenomenon="earthquake",
            regionName="Casablanca-Settat",
            date=datetime.utcnow()
        )
        self.notification.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Notification.objects.delete()
        User.objects(email="test@example.com").delete()

    def test_create_notification(self):
        """Test de création d'une notification."""
        self.assertEqual(len(self.notification.regionIds), 2)
        self.assertFalse(self.notification.isRead)
        self.assertTrue(self.notification.isActive)


class AlertServiceTests(TestCase):
    """Tests pour le service de création d'alertes."""

    def setUp(self):
        """Configuration initiale."""
        self.user = User(
            nom="Test User",
            email="test@example.com",
            role="user",
            isActive=True
        )
        self.user.set_password("password123")
        self.user.save()

        self.notification = Notification(
            userId=self.user.id,
            regionIds=["Casablanca-Settat"],
            isActive=True
        )
        self.notification.save()

    def tearDown(self):
        """Nettoyer après les tests."""
        Alert.objects.delete()
        Notification.objects.delete()
        User.objects(email="test@example.com").delete()

    def test_create_alert_and_notify(self):
        """Test de création d'alerte avec notification."""
        from apps.alerts.services import create_alert_and_notify

        create_alert_and_notify(
            phenomenon='earthquake',
            region='Casablanca-Settat',
            score=85.0,
            severity='high'
        )

        alerts = Alert.objects(userId=self.user.id)
        self.assertEqual(alerts.count(), 1)
        self.assertEqual(alerts.first().type, 'earthquake')
