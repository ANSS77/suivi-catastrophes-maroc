 
from mongoengine import Document, FloatField, StringField, DateTimeField
from datetime import datetime


class Prediction(Document):
    score = FloatField(min_value=0.0, max_value=1.0)
    region = StringField()
    phenomenon = StringField(choices=['earthquake', 'flood', 'wildfire'])
    date = DateTimeField(default=datetime.utcnow)

    meta = {'collection': 'predictions'}


class AiModel(Document):
    modelType = StringField()
    phenomenon = StringField(choices=['earthquake', 'flood', 'wildfire'])
    accuracy = FloatField()
    lastTrained = DateTimeField()

    meta = {'collection': 'ai_models'}