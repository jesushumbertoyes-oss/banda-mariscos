from rest_framework import serializers
from .models import Service, QuoteRequest, ServiceType


class ServiceSerializer(serializers.ModelSerializer):
    service_type_display = serializers.CharField(source='get_service_type_display', read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'service_type', 'service_type_display', 'title',
            'short_description', 'full_description', 'price_range',
            'duration_info', 'includes', 'icon', 'order'
        ]


class QuoteRequestSerializer(serializers.ModelSerializer):
    service_title = serializers.CharField(source='service.title', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = QuoteRequest
        fields = [
            'id', 'service', 'service_title', 'full_name', 'phone',
            'email', 'details', 'reference_links', 'budget_hint',
            'urgency', 'status', 'status_display', 'created_at'
        ]
        read_only_fields = ['status', 'created_at']


class QuoteRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer exclusivo para crear solicitudes desde el frontend"""
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.filter(is_active=True))

    class Meta:
        model = QuoteRequest
        fields = [
            'service', 'full_name', 'phone', 'email',
            'details', 'reference_links', 'budget_hint', 'urgency'
        ]

    def validate_details(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError(
                "Por favor proporciona más detalles sobre tu proyecto (mínimo 20 caracteres)."
            )
        return value
