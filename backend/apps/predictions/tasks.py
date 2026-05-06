from celery import shared_task
from apps.predictions.services import (
    run_earthquake_predictions,
    run_flood_predictions,
    run_wildfire_predictions,
)


@shared_task(name="predict_earthquakes")
def predict_earthquakes_task():
    """Prédit le severity_label pour tous les séismes non prédits."""
    try:
        count = run_earthquake_predictions()
        return {"status": "success", "predicted": count}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@shared_task(name="predict_floods")
def predict_floods_task():
    """Prédit le flood_risk pour toutes les inondations non prédites."""
    try:
        count = run_flood_predictions()
        return {"status": "success", "predicted": count}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@shared_task(name="predict_wildfires")
def predict_wildfires_task():
    """Prédit le fire_risk pour tous les incendies non prédits."""
    try:
        count = run_wildfire_predictions()
        return {"status": "success", "predicted": count}
    except Exception as e:
        return {"status": "error", "message": str(e)} 
