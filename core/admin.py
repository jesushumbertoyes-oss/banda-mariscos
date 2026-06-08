from django.contrib import admin
from .models import BandInfo, YouTubeVideo

@admin.register(BandInfo)
class BandInfoAdmin(admin.ModelAdmin):
    list_display = ['name', 'founded_date', 'contact_whatsapp', 'is_active']
    list_editable = ['is_active']


@admin.register(YouTubeVideo)
class YouTubeVideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'youtube_id', 'is_featured', 'order', 'is_active']
    list_filter = ['is_featured', 'is_active']
    list_editable = ['is_featured', 'order', 'is_active']
    search_fields = ['title', 'youtube_id']
