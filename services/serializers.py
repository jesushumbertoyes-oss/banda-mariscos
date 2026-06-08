from rest_framework import serializers
from .models import Service, QuoteRequest


class ServiceSerializer(serializers.ModelSerializer):
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)
    price_formatted = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'service_type', 'service_type_display', 'title',
            'short_description', 'full_description', 'price',
            'price_formatted', 'clip_link', 'duration_info',
            'includes', 'icon', 'order'
        ]

    def get_price_formatted(self, obj):
        return f"${obj.price:,.2f} MXN"


class QuoteRequestSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    clip_link = serializers.CharField(source='service.clip_link', read_only=True)

    class Meta:
        model = QuoteRequest
        fields = [
            'id', 'service', 'service_title', 'full_name', 'phone',
            'email', 'details', 'reference_links', 'urgency',
            'status', 'status_display', 'clip_link', 'created_at'
        ]
        read_only_fields = ['status', 'created_at', 'clip_link']


class QuoteRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer exclusivo para crear solicitudes desde el frontend"""
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.filter(is_active=True)
    )

    class Meta:
        model = QuoteRequest
        fields = [
            'service', 'full_name', 'phone', 'email',
            'details', 'reference_links', 'urgency'
        ]

    def validate_details(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError(
                "Por favor proporciona más detalles sobre tu proyecto (mínimo 20 caracteres)."
            )
        return value
