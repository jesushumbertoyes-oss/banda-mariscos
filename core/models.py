from django.db import models

class BandInfo(models.Model):
    """Información general de Banda Mariscos"""
    name = models.CharField(max_length=100, default="Banda Mariscos")
    slogan = models.CharField(max_length=200, blank=True)
    description = models.TextField(help_text="Historia y esencia de la banda")
    founded_date = models.DateField(help_text="Fecha de creación de la banda")
    logo = models.ImageField(upload_to='band/', blank=True, null=True)
    contact_email = models.EmailField(blank=True)
    contact_whatsapp = models.CharField(max_length=20, blank=True, help_text="Número con código de país")
    youtube_channel_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Información de la Banda"
        verbose_name_plural = "Información de la Banda"

    def __str__(self):
        return self.name


class YouTubeVideo(models.Model):
    """Videos del canal de YouTube embebidos en la página"""
    band = models.ForeignKey(BandInfo, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    youtube_id = models.CharField(max_length=20, unique=True, help_text="ID del video de YouTube (ej: dQw4w9WgXcQ)")
    description = models.TextField(blank=True)
    thumbnail_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False, help_text="Destacar en sección principal")
    order = models.PositiveIntegerField(default=0, help_text="Orden de aparición")
    is_active = models.BooleanField(default=True)
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-published_at']
        verbose_name = "Video de YouTube"
        verbose_name_plural = "Videos de YouTube"

    def __str__(self):
        return self.title

    @property
    def embed_url(self):
        return f"https://www.youtube.com/embed/{self.youtube_id}"

    @property
    def watch_url(self):
        return f"https://www.youtube.com/watch?v={self.youtube_id}"
