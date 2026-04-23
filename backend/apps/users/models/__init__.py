from mongoengine import Document, StringField, BooleanField
from django.contrib.auth.hashers import make_password, check_password


class User(Document):
    nom = StringField(required=True)
    email = StringField(required=True, unique=True)
    password = StringField(required=True)
    role = StringField(choices=['admin', 'user'], default='user')
    isActive = BooleanField(default=True)

    meta = {'collection': 'users'}

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)