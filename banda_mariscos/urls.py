from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from services.dashboard import panel_rustico

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls')),
    path('api/services/', include('services.urls')),
    
    # LA RUTA MAESTRA NUEVA
    path('buzon/', panel_rustico, name='buzon_cotizaciones'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
