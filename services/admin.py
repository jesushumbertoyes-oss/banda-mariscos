from django.contrib import admin
from .models import Service, QuoteRequest


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'service_type', 'price', 'clip_link', 'order', 'is_active']
    list_editable = ['price', 'order', 'is_active']
    list_filter = ['service_type', 'is_active']
    search_fields = ['title', 'description']
    fieldsets = (
        ('Información', {
            'fields': ('service_type', 'title', 'short_description', 'full_description')
        }),
        ('Negocio', {
            'fields': ('price', 'clip_link', 'duration_info', 'includes')
        }),
        ('Presentación', {
            'fields': ('icon', 'order', 'is_active')
        }),
    )


@admin.register(QuoteRequest)
class QuoteRequestAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'service', 'phone', 'urgency', 'status', 'created_at']
    list_filter = ['status', 'urgency', 'service', 'created_at']
    list_editable = ['status']
    search_fields = ['full_name', 'phone', 'email', 'details']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Cliente', {
            'fields': ('full_name', 'phone', 'email')
        }),
        ('Proyecto', {
            'fields': ('service', 'details', 'reference_links', 'urgency')
        }),
        ('Gestión', {
            'fields': ('status', 'admin_notes', 'created_at', 'updated_at')
        }),
    )
    
    actions = ['mark_as_paid', 'mark_as_in_progress', 'mark_as_completed', 'mark_as_cancelled']

    @admin.action(description='Marcar como Pagado')
    def mark_as_paid(self, request, queryset):
        queryset.update(status='paid')

    @admin.action(description='Marcar como En Proceso')
    def mark_as_in_progress(self, request, queryset):
        queryset.update(status='in_progress')

    @admin.action(description='Marcar como Completado')
    def mark_as_completed(self, request, queryset):
        queryset.update(status='completed')

    @admin.action(description='Marcar como Cancelado')
    def mark_as_cancelled(self, request, queryset):
        queryset.update(status='cancelled')
