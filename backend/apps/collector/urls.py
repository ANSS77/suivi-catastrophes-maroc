from django.urls import path
from apps.collector.views import ManualCollectionView

urlpatterns = [
    path('admin/collect/', ManualCollectionView.as_view(), name='manual-collect'),
]
