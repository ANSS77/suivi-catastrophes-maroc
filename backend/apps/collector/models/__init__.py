 
from mongoengine import Document, StringField, DateTimeField


class Collector(Document):
    schedule = StringField()
    lastRun = DateTimeField()
    status = StringField(
        choices=['running', 'idle', 'error'],
        default='idle'
    )

    meta = {'collection': 'collectors'}
