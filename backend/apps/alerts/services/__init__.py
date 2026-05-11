from datetime import datetime, timezone
from apps.alerts.models import Alert, Notification


def create_alert_and_notify(phenomenon: str, region: str, score: float, severity: str):
    """
    Crée une Alert pour tous les niveaux (low, medium, high).
    Crée une nouvelle Notification (notif_type='alert') uniquement si severity medium ou high.
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

        # 1. Trouver les abonnements (notif_type='subscription') pour cette région
        subscriptions = Notification.objects(
            notif_type='subscription',
            regionIds=region,
            isActive=True
        )

        if not subscriptions:
            print(f"ℹ️ Aucun user abonné à {region}")
            return

        for sub in subscriptions:
            try:
                # ✅ Créer Alert pour tous (low, medium, high)
                alert = Alert(
                    userId=sub.userId,
                    regionId=region,
                    message=message,
                    date=datetime.now(timezone.utc),
                    type=phenomenon,
                )
                alert.save()

                # ✅ Créer une nouvelle Notification d'alerte si medium ou high
                if severity in ['medium', 'high']:
                    Notification(
                        userId=sub.userId,
                        alertId=alert.id,
                        regionIds=[region],
                        notif_type='alert',        # ← type abonnement vs alerte
                        type=phenomenon,           # ← pour l'icône frontend
                        phenomenon=phenomenon,
                        regionName=region,
                        date=datetime.now(timezone.utc),
                        isRead=False,
                        isActive=True,
                    ).save()
                    print(f"🔔 Notification créée → {sub.userId} — {region} — {severity}")
                else:
                    print(f"ℹ️ Alert low créée sans notification → {region}")

            except Exception as e:
                print(f"❌ Erreur pour {sub.userId}: {e}")
                continue

    except Exception as e:
        print(f"❌ Erreur create_alert_and_notify: {e}")