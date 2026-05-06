from django.urls import path
from apps.core.views.threshold_views import ThresholdView

urlpatterns = [
    path('admin/thresholds/', ThresholdView.as_view(), name='thresholds'),
]