from mongoengine import Document, StringField, FloatField


class Region(Document):
    name = StringField(required=True, unique=True)
    latitude = FloatField()
    longitude = FloatField()
    riskLevel = StringField(choices=['low', 'medium', 'high'], default='low')

    meta = {'collection': 'regions'}