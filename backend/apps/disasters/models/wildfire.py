from mongoengine import Document, FloatField, StringField, IntField, DateTimeField


class Wildfire(Document):
    latitude   = FloatField(required=True)
    longitude  = FloatField(required=True)
    bright_ti4 = FloatField()
    bright_ti5 = FloatField()
    scan       = FloatField()
    track      = FloatField()
    confidence = IntField()
    daynight   = StringField(choices=['D', 'N'])
    type       = IntField()
    acq_date   = DateTimeField()
    month        = IntField()
    day_of_year  = IntField()
    daynight_enc = IntField(choices=[0, 1]) 
    fire_risk = StringField(choices=['low', 'medium', 'high'])

    meta = {'collection': 'wildfires'}