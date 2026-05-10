from datetime import datetime, timezone
from apps.alerts.models import Alert, Notification


def create_alert_and_notify(phenomenon: str, region: str, score: float, severity: str):
    """
    Crée une Alert pour tous les niveaux (low, medium, high).
    Notifie via Notification uniquement si severity medium ou high.
    """
    try:
        type_labels = {
            'earthquake': 'Séisme',
            'flood'     : 'Inondation',
            'wildfire'  : 'Incendie',
        }

        message = (
            f"{type_labels.get(phenomenon, phenomenon)} Détecté — "
            f"Région {region} — "
            f"Risque {severity.capitalize()} — "
        )

        # 1. Trouver les users abonnés à cette région
        notifications = Notification.objects(regionIds=region, isActive=True)

        if not notifications:
            print(f"ℹ️ Aucun user abonné à {region}")
            return

        for notif in notifications:
            try:
                # ✅ Créer Alert pour tous (low, medium, high)
                alert = Alert(
                    userId=notif.userId,
                    regionId=region,
                    message=message,
                    date=datetime.now(timezone.utc),
                    type=phenomenon,
                )
                alert.save()

                # ✅ Notifier via Notification uniquement si medium ou high
                if severity in ['medium', 'high']:
                    notif.alertId = alert.id
                    notif.isRead = False
                    notif.save()
                    print(f"🔔 Notification envoyée → {notif.userId} — {region} — {severity}")
                else:
                    print(f"ℹ️ Alert low créée sans notification → {region}")

            except Exception as e:
                print(f"❌ Erreur pour {notif.userId}: {e}")
                continue

    except Exception as e:
        print(f"❌ Erreur create_alert_and_notify: {e}")