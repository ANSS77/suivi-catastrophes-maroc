from datetime import datetime, timezone
from bson import ObjectId
from apps.alerts.models import Alert, Notification
from apps.users.models import User


def create_alert_and_notify(phenomenon: str, region: str, score: float, severity: str):
    """
    Crée une Alert et notifie tous les users abonnés à cette région.
    Appelé depuis predictions/services quand score >= seuil.
    """
    try:
        # 1. Trouver tous les users abonnés à cette région
        # Notification contient regionIds (liste de noms de régions)
        notifications = Notification.objects(
            regionIds=region,
            isActive=True
        )

        if not notifications:
            print(f"ℹ️ Aucun user abonné à {region}")
            return

        type_labels = {
            'earthquake': 'Séisme',
            'flood': 'Inondation',
            'wildfire': 'Incendie',
        }

        message = (
            f"{type_labels.get(phenomenon, phenomenon)} détecté — "
            f"Région {region} — "
            f"Risque {severity} — "
            f"Score {score:.1f}%"
        )

        # 2. Pour chaque user abonné → créer une Alert
        for notif in notifications:
            try:
                alert = Alert(
                    userId=notif.userId,
                    regionId=ObjectId(),  # région comme ObjectId fictif
                    message=message,
                    date=datetime.now(timezone.utc),
                    type=phenomenon,
                )
                alert.save()

                # 3. Mettre à jour la Notification avec l'alertId
                notif.alertId = alert.id
                notif.isRead = False
                notif.save()

                print(f"✅ Alert créée pour user {notif.userId} — {region}")

            except Exception as e:
                print(f"❌ Erreur création alert pour {notif.userId}: {e}")
                continue

    except Exception as e:
        print(f"❌ Erreur create_alert_and_notify: {e}")
