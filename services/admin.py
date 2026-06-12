from django.contrib import admin
from .models import Service, QuoteRequest

# Registro directo y plano: la forma más segura para que Python 3.14 no truene
admin.site.register(Service)
admin.site.register(QuoteRequest)
