from django.urls import path
from apps.alerts.views import AlertView, NotificationView, MarkAllNotificationsReadView

urlpatterns = [
    path('alerts/', AlertView.as_view(), name='alerts-list'),
    path('notifications/', NotificationView.as_view(), name='notifications-list'),
    path('notifications/<str:pk>/read/', NotificationView.as_view(), name='notification-read'),
    path('notifications/mark-all-read/', MarkAllNotificationsReadView.as_view(), name='notifications-mark-all-read'),
]
