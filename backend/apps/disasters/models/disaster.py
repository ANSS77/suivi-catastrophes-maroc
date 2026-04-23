from mongoengine import Document, FloatField, StringField, DateTimeField, BooleanField


class Disaster(Document):
    type = StringField(required=True, choices=['earthquake', 'flood', 'wildfire'])
    region = StringField()
    latitude = FloatField()
    longitude = FloatField()
    date = DateTimeField()
    severity = StringField(choices=['low', 'medium', 'high'])
    source = StringField()
    isActive = BooleanField(default=True)

    meta = {'collection': 'disasters'}