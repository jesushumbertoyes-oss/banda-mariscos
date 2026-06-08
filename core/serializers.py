from rest_framework import serializers
from .models import BandInfo, YouTubeVideo

class YouTubeVideoSerializer(serializers.ModelSerializer):
    embed_url = serializers.ReadOnlyField()
    watch_url = serializers.ReadOnlyField()

    class Meta:
        model = YouTubeVideo
        fields = ['id', 'title', 'youtube_id', 'description', 'thumbnail_url',
                  'is_featured', 'order', 'embed_url', 'watch_url', 'published_at']


class BandInfoSerializer(serializers.ModelSerializer):
    videos = YouTubeVideoSerializer(many=True, read_only=True)

    class Meta:
        model = BandInfo
        fields = ['id', 'name', 'slogan', 'description', 'founded_date',
                  'logo', 'contact_email', 'contact_whatsapp',
                  'youtube_channel_url', 'videos']
