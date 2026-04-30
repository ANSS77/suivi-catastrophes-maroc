from mongoengine import Document, FloatField, StringField, IntField, DateTimeField


class Earthquake(Document):

    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    depth = FloatField()
    mag = FloatField()
    magType = StringField()
    nst = IntField()
    gap = FloatField()
    net = StringField()
    type = StringField()
    locationSource = StringField()
    magSource = StringField()
    usgs_id = StringField()
    place = StringField()
    time = DateTimeField()
    updated = DateTimeField()
    status = StringField()
    dmin = FloatField()
    rms = FloatField()
    severity_label = StringField(choices=['low', 'medium', 'high'])

    meta = {'collection': 'earthquakes'}