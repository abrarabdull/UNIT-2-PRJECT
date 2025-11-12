from django.urls import path
from . import views
app_name = "main"
urlpatterns = [path("", views.home_view, name="home"),
               path("about/", views.about_view, name="about"),
               path('transportation/', views.transportation, name='transportation'),
               path("toggle-theme/", views.toggle_theme, name="toggle_theme"),
               path("culture", views.culture_view, name="culture"),
               path("destinations/", views.destinations_view, name="destinations"),
               path("destinations/<str:city_name>/", views.city_detail_view, name="city_detail"),
               path("ai/", views.ai_view, name="ai"),
               path("ai/travel/", views.travel_ai, name="travel_ai"),
               ]