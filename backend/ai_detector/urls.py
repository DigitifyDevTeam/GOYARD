from django.urls import path
from . import views
from . import room_analysis_views
from . import duplicate_detection

app_name = 'ai_model'

urlpatterns = [
    # Photo upload and analysis
    path('upload/', views.upload_photos, name='upload_photos'),
    path('analyze/', views.analyze_photos, name='analyze_photos'),
    
    # YOLO object detection
    path('predict/', views.predict_objects, name='predict_objects'),
    path('images/', views.view_processed_images, name='view_processed_images'),
    path('images/<str:folder>/<str:filename>', views.serve_processed_image, name='serve_processed_image'),
    path('organized-images/', views.view_organized_images, name='view_organized_images'),
    
    # Quote generation
    path('generate-quote/', views.generate_quote, name='generate_quote'),
    path('quotes/', views.user_quotes, name='user_quotes'),
    path('quote/<int:quote_id>/', views.quote_detail, name='quote_detail'),
    
    # Room management
    path('rooms/', views.room_list, name='room_list'),
    
    # Testing
    path('test/', views.test_ai_model, name='test_ai_model'),
    
    # Manual furniture selection
    path('furniture/room/', views.get_furniture_by_room, name='get_furniture_by_room'),
    path('furniture/all/', views.get_all_rooms_furniture, name='get_all_rooms_furniture'),
    path('furniture/calculate/', views.calculate_manual_quote, name='calculate_manual_quote'),
    
    # Furniture with heavy objects
    path('furniture/room-with-heavy/', views.get_furniture_with_heavy_objects, name='get_furniture_with_heavy_objects'),
    path('furniture/all-with-heavy/', views.get_all_rooms_with_heavy_objects, name='get_all_rooms_with_heavy_objects'),
    
    # Room-by-room analysis and object management
    path('room-analysis/', room_analysis_views.get_room_analysis, name='get_room_analysis'),
    path('update-object-quantity/', room_analysis_views.update_object_quantity, name='update_object_quantity'),
    path('add-object-to-room/', room_analysis_views.add_object_to_room, name='add_object_to_room'),
    path('remove-object-from-room/', room_analysis_views.remove_object_from_room, name='remove_object_from_room'),
    
    # Duplicate detection
    path('check-duplicates/', duplicate_detection.check_duplicate_images, name='check_duplicate_images'),
    
    # AI Detection Results
    path('ai-results/', views.get_ai_detection_results, name='get_ai_detection_results'),
    
]
