 
from django.urls import path
from apps.predictions.views import PredictionView

urlpatterns = [
    path('predictions/', PredictionView.as_view(), name='predictions-list'),
]