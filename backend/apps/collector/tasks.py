from celery import shared_task
from datetime import datetime, timezone
from apps.collector.adapters.nasa_firms import fetch_wildfires
from apps.collector.adapters.usgs import fetch_earthquakes
from apps.collector.adapters.nasa_power import fetch_floods
from apps.collector.models import Collector


def update_collector(collector, status):
    collector.status = status
    collector.lastRun = datetime.now(timezone.utc)
    collector.save()


@shared_task(name="collect_wildfires")
def collect_wildfires_task():
    """Collecte les incendies depuis NASA FIRMS."""
    collector = Collector(
        schedule="every_hour",
        lastRun=datetime.now(timezone.utc),
        status="running"
    )
    collector.save()

    try:
        result = fetch_wildfires(days=1)
        update_collector(collector, "idle")
        return {"status": "success", **result}
    except Exception as e:
        update_collector(collector, "error")
        return {"status": "error", "message": str(e)}


@shared_task(name="collect_earthquakes")
def collect_earthquakes_task():
    """Collecte les séismes depuis USGS."""
    collector = Collector(
        schedule="every_hour",
        lastRun=datetime.now(timezone.utc),
        status="running"
    )
    collector.save()

    try:
        result = fetch_earthquakes(days=1)
        update_collector(collector, "idle")
        return {"status": "success", **result}
    except Exception as e:
        update_collector(collector, "error")
        return {"status": "error", "message": str(e)}


@shared_task(name="collect_floods")
def collect_floods_task():
    """Collecte les données météo depuis NASA POWER."""
    collector = Collector(
        schedule="every_day",
        lastRun=datetime.now(timezone.utc),
        status="running"
    )
    collector.save()

    try:
        result = fetch_floods(days=1)
        update_collector(collector, "idle")
        return {"status": "success", **result}
    except Exception as e:
        update_collector(collector, "error")
        return {"status": "error", "message": str(e)}