from mongoengine import Document, StringField, BooleanField, DateTimeField, ObjectIdField, ListField
from datetime import datetime


class Alert(Document):
    userId = ObjectIdField(required=True)
    regionId = StringField(required=True)
    message = StringField(required=True)
    date = DateTimeField(default=datetime.utcnow)
    type = StringField(choices=['earthquake', 'flood', 'wildfire'])

    meta = {'collection': 'alerts'}


class Notification(Document):
    userId = ObjectIdField(required=True)
    regionIds = ListField(StringField())
    alertId = ObjectIdField()
    isRead = BooleanField(default=False)
    isActive = BooleanField(default=True)

    # 'subscription' = abonnement régions | 'alert' = notification d'alerte
    notif_type = StringField(choices=['subscription', 'alert'], default='subscription')

    # Champs pour les notifications d'alerte
    type = StringField(choices=['earthquake', 'flood', 'wildfire'])
    phenomenon = StringField()
    regionName = StringField()
    date = DateTimeField(default=datetime.utcnow)

    meta = {
        'collection': 'notifications',
        'strict': False
    }