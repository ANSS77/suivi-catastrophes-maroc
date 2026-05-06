from django.urls import path
from apps.core.views.threshold_views import ThresholdView
from apps.core.views.user_views import UserListView, ToggleUserView

urlpatterns = [
    path('admin/users/', UserListView.as_view(), name='users-list'),
    path('admin/users/<str:user_id>/toggle/', ToggleUserView.as_view(), name='users-toggle'),
    path('admin/thresholds/', ThresholdView.as_view(), name='thresholds'),
] 
