from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from .models import Service, QuoteRequest
from .serializers import (
    ServiceSerializer,
    QuoteRequestSerializer,
    QuoteRequestCreateSerializer
)


class QuoteThrottle(AnonRateThrottle):
    rate = '5/hour'


class ServiceListView(generics.ListAPIView):
    """Lista todos los servicios activos ordenados"""
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer


class QuoteRequestCreateView(APIView):
    """
    POST /api/services/quote/
    Recibe formulario de contratación, guarda en DB y devuelve clip_link.
    Rate limit: 5 solicitudes por hora por IP.
    """
    throttle_classes = [QuoteThrottle]

    def post(self, request):
        serializer = QuoteRequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save(status='pending_payment')
            return Response({
                "success": True,
                "message": "Solicitud guardada. Procede al pago para confirmar tu contratación.",
                "quote_id": quote.id,
                "service": quote.service.title,
                "price": str(quote.service.price),
                "clip_link": quote.service.clip_link,
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class QuoteRequestListView(generics.ListAPIView):
    """Para panel admin (requiere autenticación en producción)"""
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer
