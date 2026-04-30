from celery import shared_task
from datetime import datetime
from apps.collector.adapters.nasa_firms import fetch_wildfires
from apps.collector.models import Collector


@shared_task(name="collect_wildfires")
def collect_wildfires_task():
    """
    Tâche Celery — collecte les incendies depuis NASA FIRMS.
    Lancée automatiquement toutes les heures.
    """

    # Mettre le collector en status "running"
    collector = Collector(
        schedule="every_hour",
        lastRun=datetime.utcnow(),
        status="running"
    )
    collector.save()

    try:
        result = fetch_wildfires(days=1)

        # Mettre à jour le status
        collector.status = "idle"
        collector.lastRun = datetime.utcnow()
        collector.save()

        return {
            "status": "success",
            "created": result["created"],
            "skipped": result["skipped"],
            "errors": result["errors"],
        }

    except Exception as e:
        collector.status = "error"
        collector.lastRun = datetime.utcnow()
        collector.save()

        return {
            "status": "error",
            "message": str(e),
        } 
