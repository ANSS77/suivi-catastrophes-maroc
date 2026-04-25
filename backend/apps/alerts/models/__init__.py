from mongoengine import Document, StringField, BooleanField, DateTimeField, ObjectIdField, ListField
from datetime import datetime


class Alert(Document):
    userId = ObjectIdField(required=True)
    regionId = ObjectIdField(required=True)
    message = StringField(required=True)
    date = DateTimeField(default=datetime.utcnow)
    type = StringField(choices=['earthquake', 'flood', 'wildfire'])

    meta = {'collection': 'alerts'}


class Notification(Document):
    userId = ObjectIdField(required=True)
    regionIds = ListField(ObjectIdField())
    alertId = ObjectIdField()
    isRead = BooleanField(default=False)
    isActive = BooleanField(default=True)

    meta = {'collection': 'notifications'}