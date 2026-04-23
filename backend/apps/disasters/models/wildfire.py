from mongoengine import Document, FloatField, StringField, IntField


class Wildfire(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    confidence = FloatField()
    daynight = StringField(choices=['D', 'N'])
    year = IntField()
    month = IntField()
    season = StringField(choices=['spring', 'summer', 'autumn', 'winter'])
    fire_risk = StringField(choices=['low', 'medium', 'high'])

    meta = {'collection': 'wildfires'}
    