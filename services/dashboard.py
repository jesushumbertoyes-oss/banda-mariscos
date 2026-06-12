from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from .models import QuoteRequest

@staff_member_required
def panel_rustico(request):
    quotes = QuoteRequest.objects.all().order_by('-created_at')
    
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex, nofollow">
        <title>Buzón Privado - Banda Mariscos</title>
    </head>
    <body style="font-family: sans-serif; background-color: #1a1a1a; color: #f3f4f6; padding: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; margin-bottom: 20px;">
            <h1 style="color: #fbbf24; margin: 0;">🔒 Buzón Privado</h1>
            
            <form action="/admin/logout/" method="post">
                <input type="hidden" name="csrfmiddlewaretoken" value='""" + request.COOKIES.get('csrftoken', '') + """'>
                <button type="submit" style="background: none; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 0.9rem;">Cerrar Sesión ❌</button>
            </form>
        </div>
    """
    
    if not quotes:
        html += "<p>Aún no han caído cotizaciones, pariente.</p>"
        
    for q in quotes:
        wa_num = "".join(filter(str.isdigit, q.phone))
        if not wa_num.startswith("52") and len(wa_num) == 10:
            wa_num = "52" + wa_num
            
        html += f"""
        <div style="background-color: #262626; border: 1px solid #404040; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <h2 style="margin-top: 0; color: #fbbf24; font-size: 1.2rem;">👤 {q.full_name}</h2>
            <p style="margin: 5px 0;"><b>📱 Teléfono:</b> {q.phone} 
               <a href="https://wa.me/{wa_num}" target="_blank" style="background-color: #10b981; color: white; padding: 3px 8px; text-decoration: none; border-radius: 5px; font-size: 0.8rem; margin-left: 10px;">🟢 Abrir WhatsApp</a>
            </p>
            <p style="margin: 5px 0;"><b>🎵 Servicio:</b> {q.service.title}</p>
            <p style="margin: 5px 0;"><b>💰 Presupuesto:</b> {q.budget_hint or 'No especificó'}</p>
            <p style="margin: 5px 0;"><b>⏱️ Urgencia:</b> {q.get_urgency_display()}</p>
            <div style="background-color: #171717; padding: 10px; border-radius: 5px; margin-top: 10px;">
                <p style="margin: 0; font-size: 0.9rem; color: #a3a3a3;"><b>📝 Detalles del proyecto:</b></p>
                <p style="margin: 5px 0 0 0; font-size: 0.95rem; line-height: 1.4;">{q.details}</p>
            </div>
        </div>
        """
        
    html += "</body></html>"
    return HttpResponse(html)
