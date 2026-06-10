from django.db import models
from django.core.validators import RegexValidator

class ServiceType(models.TextChoices):
    INTRO_OUTRO = 'intro_outro', 'Intros y Outros para Contenido Digital'
    CUSTOM_SONG = 'custom_song', 'Corrido o Canción por Encargo'
    SOUNDSCAPE = 'soundscape', 'Paisajes Sonoros (Audio Ambiente)'
    SOUNDBITE = 'soundbite', 'Frases con Sabor / Sound Bites'


class Service(models.Model):
    """Catálogo de servicios musicales"""
    service_type = models.CharField(
        max_length=20,
        choices=ServiceType.choices,
        unique=True
    )
    title = models.CharField(max_length=150)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField()
    price_range = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ej: Desde $1,500 MXN"
    )
    duration_info = models.CharField(
        max_length=100,
        blank=True,
        help_text="Ej: 5-10 segundos"
    )
    includes = models.JSONField(
        default=list,
        help_text="Lista de lo que incluye el servicio"
    )
    icon = models.CharField(
        max_length=50,
        blank=True,
        help_text="Nombre del icono o emoji representativo"
    )
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Servicio"
        verbose_name_plural = "Servicios"

    def __str__(self):
        return f"{self.title} ({self.get_service_type_display()})"


class QuoteRequest(models.Model):
    """Solicitudes de cotización de clientes"""
    phone_validator = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Número de teléfono debe contener entre 9 y 15 dígitos."
    )

    service = models.ForeignKey(
        Service,
        on_delete=models.PROTECT,
        related_name='quote_requests'
    )
    full_name = models.CharField(max_length=150, verbose_name="Nombre completo")
    phone = models.CharField(
        max_length=20,
        validators=[phone_validator],
        verbose_name="Teléfono / WhatsApp"
    )
    email = models.EmailField(blank=True, verbose_name="Correo electrónico")
    details = models.TextField(
        verbose_name="Detalles del proyecto",
        help_text="Historia, datos del negocio, dedicatoria, etc."
    )
    reference_links = models.TextField(
        blank=True,
        verbose_name="Links de referencia",
        help_text="YouTube, Spotify, ejemplos de estilo deseado"
    )
    budget_hint = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Presupuesto aproximado"
    )
    urgency = models.CharField(
        max_length=20,
        choices=[
            ('low', 'Sin prisa'),
            ('normal', 'Normal (1-2 semanas)'),
            ('high', 'Urgente (menos de 1 semana)'),
        ],
        default='normal',
        verbose_name="Urgencia"
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pendiente'),
            ('contacted', 'Contactado'),
            ('in_progress', 'En proceso'),
            ('completed', 'Completado'),
            ('cancelled', 'Cancelado'),
        ],
        default='pending',
        verbose_name="Estado"
    )
    admin_notes = models.TextField(blank=True, verbose_name="Notas internas")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Solicitud de Cotización"
        verbose_name_plural = "Solicitudes de Cotización"

    def __str__(self):
        return f"{self.full_name} - {self.service.title} ({self.created_at.strftime('%d/%m/%Y')})"
