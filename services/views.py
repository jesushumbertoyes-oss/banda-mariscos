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
    Recibe formulario de cotización desde React.
    Rate limit: 5 solicitudes por hora por IP.
    """
    throttle_classes = [QuoteThrottle]

    def post(self, request):
        serializer = QuoteRequestCreateSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save()
            return Response({
                "success": True,
                "message": "¡Solicitud enviada con éxito! Te contactaremos pronto por WhatsApp.",
                "quote_id": quote.id,
                "service": quote.service.title
            }, status=status.HTTP_201_CREATED)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class QuoteRequestListView(generics.ListAPIView):
    """Para panel admin (requiere autenticación en producción)"""
    queryset = QuoteRequest.objects.all()
    serializer_class = QuoteRequestSerializer
