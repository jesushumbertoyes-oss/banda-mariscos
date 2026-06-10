from django.contrib import admin
from .models import Service, QuoteRequest

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'service_type', 'price_range', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['service_type', 'is_active']


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'service', 'phone', 'urgency', 'status', 'created_at']
    list_filter = ['status', 'urgency', 'service', 'created_at']
    list_editable = ['status']
    search_fields = ['full_name', 'phone', 'email', 'details']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Información del Cliente', {
            'fields': ('full_name', 'phone', 'email')
        }),
        ('Proyecto', {
            'fields': ('service', 'details', 'reference_links', 'budget_hint', 'urgency')
        }),
        ('Gestión Interna', {
            'fields': ('status', 'admin_notes', 'created_at', 'updated_at')
        }),
    )
