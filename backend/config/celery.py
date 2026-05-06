import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

app = Celery('disastertrack')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    # ─── Collector tasks ───
    'collect-wildfires-every-hour': {
        'task': 'collect_wildfires',
        'schedule': crontab(minute=0),          # toutes les heures
    },
    'collect-earthquakes-every-hour': {
        'task': 'collect_earthquakes',
        'schedule': crontab(minute=0),          # toutes les heures
    },
    'collect-floods-every-day': {
        'task': 'collect_floods',
        'schedule': crontab(hour=6, minute=0),  # tous les jours à 6h
    },

    # ─── Prediction tasks ───
    'predict-earthquakes-every-hour': {
        'task': 'predict_earthquakes',
        'schedule': crontab(minute=30),         # 30 min après collecte
    },
    'predict-wildfires-every-hour': {
        'task': 'predict_wildfires',
        'schedule': crontab(minute=30),         # 30 min après collecte
    },
    'predict-floods-every-day': {
        'task': 'predict_floods',
        'schedule': crontab(hour=6, minute=30), # 30 min après collecte floods
    },
}

app.conf.timezone = 'Africa/Casablanca'