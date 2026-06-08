from django.urls import path
from .views import ServiceListView, QuoteRequestCreateView, QuoteRequestListView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('quote/', QuoteRequestCreateView.as_view(), name='quote-create'),
    path('quotes/', QuoteRequestListView.as_view(), name='quote-list'),
]
