from django.db import models
from django.contrib.auth.models import User

class Room(models.Model):
    ROOM_TYPES = [
        ('bathroom', 'Salle de bain'),
        ('kitchen', 'Cuisine'),
        ('bedroom', 'Chambre'),
        ('living_room', 'Salon'),
        ('office', 'Bureau'),
        ('other', 'Autre'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_room_type_display()})"

class Photo(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(upload_to='room_photos/')
    filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    width = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='uploaded', choices=[
        ('uploaded', 'Uploadé'),
        ('analyzing', 'En cours d\'analyse'),
        ('analyzed', 'Analysé'),
        ('error', 'Erreur')
    ])
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Photo {self.filename} - {self.room.name}"

class DetectedObject(models.Model):
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='detected_objects')
    object_class = models.CharField(max_length=100)
    confidence = models.FloatField()
    bbox_x = models.FloatField()
    bbox_y = models.FloatField()
    bbox_width = models.FloatField()
    bbox_height = models.FloatField()
    estimated_volume = models.FloatField()
    estimated_weight = models.FloatField()
    detected_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.object_class} (conf: {self.confidence:.2f})"

class Quote(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_volume = models.FloatField()
    total_weight = models.FloatField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    confidence_score = models.FloatField()
    distance_km = models.FloatField(default=0)
    services = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending', choices=[
        ('pending', 'En attente'),
        ('approved', 'Approuvé'),
        ('rejected', 'Rejeté'),
        ('expired', 'Expiré')
    ])

    def __str__(self):
        return f"Devis #{self.id} - {self.final_price}€"

class RoomAnalysis(models.Model):
    """Stores the analysis results for a specific room"""
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='analyses')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    analysis_date = models.DateTimeField(auto_now_add=True)
    total_objects = models.IntegerField(default=0)
    total_volume = models.FloatField(default=0.0)
    is_finalized = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Analysis for {self.room.name} - {self.analysis_date}"

class RoomObject(models.Model):
    """Stores individual objects detected/added in a room analysis"""
    room_analysis = models.ForeignKey(RoomAnalysis, on_delete=models.CASCADE, related_name='room_objects')
    object_name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=1)
    volume_per_unit = models.FloatField(default=0.0)
    total_volume = models.FloatField(default=0.0)
    is_ai_detected = models.BooleanField(default=True)  # True if detected by AI, False if manually added
    confidence = models.FloatField(null=True, blank=True)  # Only for AI-detected objects
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        # Calculate total volume when saving
        self.total_volume = self.quantity * self.volume_per_unit
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.object_name} x{self.quantity} in {self.room_analysis.room.name}"
