from mongoengine import Document, FloatField, StringField, IntField, DateTimeField


class Flood(Document):
    PRECTOTCORR = FloatField()
    RH2M = FloatField()
    T2M = FloatField()
    WS2M = FloatField()
    GWETTOP = FloatField()
    PS = FloatField()
    region = StringField()
    latitude = FloatField()
    longitude = FloatField()
    date = DateTimeField()
    month = IntField()
    day_of_year = IntField()
    flood_risk = StringField(choices=['low', 'medium', 'high'])

    meta = {'collection': 'floods'}