from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.users.urls.urls')),
    path('api/', include('apps.disasters.urls.urls')),
    path('api/', include('apps.alerts.urls.urls')),
    path('api/', include('apps.predictions.urls.urls')),
    path('api/', include('apps.core.urls')),
    path('api/', include('apps.collector.urls')),
]
