from django.urls import path
from apps.disasters.views import DisasterView, DisasterDetailView, DisasterFilterView

urlpatterns = [
    path('disasters/', DisasterView.as_view(), name='disaster-list'),
    path('disasters/filter/', DisasterFilterView.as_view(), name='disaster-filter'),
    path('disasters/<pk>/', DisasterDetailView.as_view(), name='disaster-detail'),
]