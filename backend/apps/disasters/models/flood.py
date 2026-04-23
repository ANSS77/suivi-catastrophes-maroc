from mongoengine import Document, FloatField, StringField, IntField


class Flood(Document):
    PRECTOTCORR = FloatField()
    T2M = FloatField()
    RH2M = FloatField()
    WS2M = FloatField()
    region = StringField()
    latitude = FloatField()
    longitude = FloatField()
    year = IntField()
    month = IntField()
    season = StringField(choices=['spring', 'autumn', 'winter'])
    flood_risk = StringField(choices=['low', 'medium', 'high'])

    meta = {'collection': 'floods'}