from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def inicio_api(request):
    return JsonResponse({
        "proyecto": "Banda Mariscos API",
        "estado": "Servidor en línea y funcionando al puro centavo 🎺",
        "autor": "Jesús Humberto"
    })

urlpatterns = [
    path('', inicio_api, name='inicio'),
    path('admin/', admin.site.urls),
    path('api/core/', include('core.urls') if 'core' in settings.INSTALLED_APPS else admin.site.urls),
    path('api/services/', include('services.urls') if 'services' in settings.INSTALLED_APPS else admin.site.urls),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
