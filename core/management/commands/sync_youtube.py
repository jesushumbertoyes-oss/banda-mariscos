import os
from django.core.management.base import BaseCommand
from googleapiclient.discovery import build
from core.models import BandInfo, YouTubeVideo

class Command(BaseCommand):
    help = 'Sincroniza automáticamente los videos más recientes del canal de YouTube'

    def handle(self, *args, **options):
        api_key = os.getenv('YOUTUBE_API_KEY')
        channel_id = os.getenv('YOUTUBE_CHANNEL_ID')

        if not api_key or not channel_id:
            self.stderr.write("Error: Falta configurar YOUTUBE_API_KEY o YOUTUBE_CHANNEL_ID en el .env")
            return

        # Buscamos la info de la banda para amarrar los videos
        band = BandInfo.objects.filter(is_active=True).first()
        if not band:
            self.stderr.write("Error: No hay una Banda activa registrada en BandInfo para asignarle los videos.")
            return

        self.stdout.write("Conectando con los servidores de Google YouTube...")
        
        try:
            youtube = build('youtube', 'v3', developerKey=api_key)
            
            # Pedimos los últimos 5 videos subidos al canal
            request = youtube.search().list(
                channelId=channel_id,
                part='id,snippet',
                order='date',
                maxResults=5,
                type='video'
            )
            response = request.execute()

            count = 0
            for item in response.get('items', []):
                video_id = item['id']['videoId']
                snippet = item['snippet']
                title = snippet['title']
                description = snippet['description']
                thumbnail = snippet['thumbnails'].get('maxres', snippet['thumbnails'].get('high', {})).get('url', '')

                # Si el video ya lo teníamos guardado, no hacemos nada. Si es nuevo, se registra solo.
                obj, created = YouTubeVideo.objects.get_or_create(
                    youtube_id=video_id,
                    defaults={
                        'band': band,
                        'title': title,
                        'description': description,
                        'thumbnail_url': thumbnail,
                        'is_featured': True, # Lo mostramos en la web principal de una vez
                        'is_active': True
                    }
                )

                if created:
                    count += 1
                    self.stdout.write(f"🎉 ¡Video nuevo detectado y guardado!: {title}")

            self.stdout.write(f" Sincronización terminada. Se añadieron {count} videos nuevos.")

        except Exception as e:
            self.stderr.write(f"Ocurrió un error al conectar con YouTube: {str(e)}")
