from mongoengine import Document, FloatField, StringField, DateTimeField


class Earthquake(Document):
    latitude = FloatField(required=True)
    longitude = FloatField(required=True)
    depth = FloatField()
    mag = FloatField()
    magType = StringField()
    place = StringField()
    severity_label = StringField(choices=['low', 'medium', 'high'])
    date = DateTimeField()

    meta = {'collection': 'earthquakes'}