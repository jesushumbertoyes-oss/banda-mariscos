from django.db import models
from django.core.validators import RegexValidator

class ServiceType(models.TextChoices):
    INTRO_OUTRO = 'intro_outro', 'Intros y Outros para Contenido Digital'
    CUSTOM_SONG = 'custom_song', 'Corrido o Canción por Encargo'
    SOUNDSCAPE = 'soundscape', 'Paisajes Sonoros (Audio Ambiente)'
    SOUNDBITE = 'soundbite', 'Frases con Sabor / Sound Bites'


class Service(models.Model):
    """Catálogo de servicios musicales con precio fijo y link de Clip"""
    service_type = models.CharField(
        max_length=20,
        choices=ServiceType.choices,
        unique=True
    )
    title = models.CharField(max_length=150)
    short_description = models.CharField(max_length=300)
    full_description = models.TextField()
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        help_text="Precio fijo en MXN. Ej: 1500.00"
    )
    clip_link = models.URLField(
        blank=True,
        help_text="Link de pago de Clip para este servicio"
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
        return f"{self.title} — ${self.price:,.2f} MXN"


class QuoteRequest(models.Model):
    """Solicitudes de contratación con estado de pago"""
    phone_validator = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Número de teléfono debe contener entre 9 y 15 dígitos."
    )

    STATUS_CHOICES = [
        ('pending_payment', 'Pago Pendiente'),
        ('paid', 'Pagado'),
        ('in_progress', 'En Proceso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
    ]

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
        choices=STATUS_CHOICES,
        default='pending_payment',
        verbose_name="Estado"
    )
    admin_notes = models.TextField(blank=True, verbose_name="Notas internas")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Solicitud de Contratación"
        verbose_name_plural = "Solicitudes de Contratación"

    def __str__(self):
        return f"{self.full_name} — {self.service.title} ({self.get_status_display()})"
