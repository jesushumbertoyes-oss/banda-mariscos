from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import BandInfo, YouTubeVideo
from .serializers import BandInfoSerializer, YouTubeVideoSerializer

class BandInfoView(APIView):
    """Devuelve la información activa de la banda con sus videos"""
    def get(self, request):
        try:
            band = BandInfo.objects.filter(is_active=True).first()
            if not band:
                return Response({"detail": "No hay información de banda configurada"}, status=404)
            serializer = BandInfoSerializer(band)
            return Response(serializer.data)
        except Exception as e:
            return Response({"detail": str(e)}, status=500)


class FeaturedVideosView(generics.ListAPIView):
    """Lista los videos destacados y activos"""
    serializer_class = YouTubeVideoSerializer

    def get_queryset(self):
        return YouTubeVideo.objects.filter(is_active=True, is_featured=True)


class AllVideosView(generics.ListAPIView):
    """Lista todos los videos activos"""
    serializer_class = YouTubeVideoSerializer

    def get_queryset(self):
        return YouTubeVideo.objects.filter(is_active=True)
