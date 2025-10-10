from django.contrib import admin
from .models import Room, Photo, DetectedObject, Quote

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'room_type', 'user', 'created_at', 'photo_count')
    list_filter = ('room_type', 'created_at')
    search_fields = ('name', 'user__username')
    readonly_fields = ('created_at', 'updated_at')
    
    def photo_count(self, obj):
        return obj.photos.count()
    photo_count.short_description = 'Photos'

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('filename', 'room', 'file_size', 'status', 'uploaded_at', 'object_count')
    list_filter = ('status', 'uploaded_at', 'room__room_type')
    search_fields = ('filename', 'room__name')
    readonly_fields = ('uploaded_at', 'width', 'height')
    
    def object_count(self, obj):
        return obj.detected_objects.count()
    object_count.short_description = 'Detected Objects'

@admin.register(DetectedObject)
class DetectedObjectAdmin(admin.ModelAdmin):
    list_display = ('object_class', 'photo', 'confidence', 'estimated_volume', 'estimated_weight', 'detected_at')
    list_filter = ('object_class', 'detected_at', 'photo__room__room_type')
    search_fields = ('object_class', 'photo__filename')
    readonly_fields = ('detected_at',)

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'final_price', 'total_volume', 'confidence_score', 'status', 'created_at')
    list_filter = ('status', 'created_at', 'confidence_score')
    search_fields = ('user__username',)
    readonly_fields = ('created_at', 'base_price', 'final_price', 'confidence_score')
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('user', 'status', 'created_at')
        }),
        ('Volume & Weight', {
            'fields': ('total_volume', 'total_weight')
        }),
        ('Pricing', {
            'fields': ('base_price', 'final_price', 'distance_km')
        }),
        ('AI Analysis', {
            'fields': ('confidence_score', 'services')
        }),
    )