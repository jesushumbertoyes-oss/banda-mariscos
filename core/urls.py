from django.urls import path
from .views import BandInfoView, FeaturedVideosView, AllVideosView

urlpatterns = [
    path('band-info/', BandInfoView.as_view(), name='band-info'),
    path('videos/featured/', FeaturedVideosView.as_view(), name='featured-videos'),
    path('videos/all/', AllVideosView.as_view(), name='all-videos'),
]
