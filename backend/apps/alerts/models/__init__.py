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
    
    # Noyaux champs pour les notifications d'alertes
    phenomenon = StringField()
    regionName = StringField()
    date = DateTimeField()

    meta = {
        'collection': 'notifications',
        'strict': False  # Permet d'ignorer les champs non définis sans planter
    }