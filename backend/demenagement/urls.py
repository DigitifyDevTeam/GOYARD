from django.urls import path
from . import views

app_name = 'demenagement'

urlpatterns = [
    # Client information endpoints
    path('client-info/', views.submit_client_information, name='submit_client_information'),
    path('client-info/<int:client_id>/', views.get_client_information, name='get_client_information'),
    path('clients/', views.list_client_information, name='list_client_information'),
    
    # Room and objects endpoints
    path('rooms/objects/', views.get_room_objects, name='get_room_objects'),
    path('heavy-objects/', views.get_heavy_objects, name='get_heavy_objects'),
    
    # Manual selection endpoints
    path('rooms/', views.create_manual_selection, name='create_manual_selection'),
    path('selection/manual/<int:selection_id>/', views.get_manual_selection, name='get_manual_selection'),
    path('selections/manual/', views.list_manual_selections, name='list_manual_selections'),
]
