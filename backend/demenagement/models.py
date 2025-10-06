from django.db import models


class ClientInformation(models.Model):
    # Informations personnelles
    nom = models.CharField(max_length=30, verbose_name="Nom de famille")
    prenom = models.CharField(max_length=30, verbose_name="Prénom")
    email = models.EmailField(verbose_name="Adresse email")
    phone = models.CharField(max_length=20, verbose_name="Numéro de téléphone")
    
    # Informations de déménagement
    adresse_depart = models.TextField(verbose_name="Adresse de départ")
    date_demenagement = models.DateField(verbose_name="Date de déménagement")
    
    # Métadonnées
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Information Client"
        verbose_name_plural = "Informations Clients"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.prenom} {self.nom} - {self.email}"


class ManualSelection(models.Model):
    """
    Model to store manual object selection by clients
    """
    # Link to client information
    client_info = models.ForeignKey(
        ClientInformation, 
        on_delete=models.CASCADE, 
        related_name='manual_selections',
        verbose_name="Information Client"
    )
    
    # Room-based selections (JSON format)
    # Example: {"entree": {"Banc": 2, "Cadre": 1}, "salon": {"Canapé": 1}}
    room_selections = models.JSONField(
        default=dict,
        verbose_name="Sélections par pièce",
        help_text="Objets sélectionnés organisés par pièce"
    )
    
    # Heavy objects selections (JSON format)  
    # Example: {"Piano droit (max 200kgs)": 1, "Armoire forte (max 200kgs)": 0}
    heavy_objects = models.JSONField(
        default=dict,
        verbose_name="Objets lourds (+80kg)",
        help_text="Objets particuliers ou de plus de 80kg"
    )
    
    # Custom objects added by user (JSON format)
    # Example: {"Table personnalisée": {"quantity": 1, "length": 120, "width": 80, "height": 75}}
    custom_objects = models.JSONField(
        default=dict,
        verbose_name="Objets personnalisés",
        help_text="Objets ajoutés manuellement par l'utilisateur avec dimensions"
    )
    
    # Calculated totals
    total_volume = models.FloatField(
        default=0.0,
        verbose_name="Volume total (m³)",
        help_text="Volume total calculé en mètres cubes"
    )
    
    total_objects_count = models.IntegerField(
        default=0,
        verbose_name="Nombre total d'objets",
        help_text="Nombre total d'objets sélectionnés"
    )
    
    # Status tracking
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('completed', 'Terminé'),
        ('validated', 'Validé'),
    ]
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft',
        verbose_name="Statut"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Sélection Manuelle"
        verbose_name_plural = "Sélections Manuelles"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Sélection #{self.id} - {self.client_info.prenom} {self.client_info.nom}"
    
    def get_total_rooms(self):
        """Return number of rooms with selections"""
        return len([room for room, objects in self.room_selections.items() if objects])
    
    def get_heavy_objects_count(self):
        """Return number of heavy objects selected"""
        return sum(count for count in self.heavy_objects.values() if count > 0)
    
    def get_room_volume(self, room_name):
        """Calculate volume for a specific room"""
        if room_name not in self.room_selections:
            return 0.0
        
        room_objects = self.room_selections[room_name]
        if not room_objects:
            return 0.0
            
        # Import here to avoid circular imports
        from ai_detector.views import calculate_total_volume
        volume_calc = calculate_total_volume(room_objects)
        return volume_calc['total_volume']
    
    def calculate_totals(self):
        """Calculate and update total volume and object count"""
        from ai_detector.views import calculate_total_volume
        
        # Combine all room selections into one dictionary
        all_objects = {}
        
        # Add room objects
        for room_name, room_objects in self.room_selections.items():
            for obj_name, count in room_objects.items():
                if obj_name in all_objects:
                    all_objects[obj_name] += count
                else:
                    all_objects[obj_name] = count
        
        # Add heavy objects
        for obj_name, count in self.heavy_objects.items():
            if count > 0:  # Only add if count > 0
                if obj_name in all_objects:
                    all_objects[obj_name] += count
                else:
                    all_objects[obj_name] = count
        
        # Calculate totals
        volume_calc = calculate_total_volume(all_objects)
        
        # Update model fields
        self.total_volume = volume_calc['total_volume']
        self.total_objects_count = sum(all_objects.values())
        
        # Save the changes
        self.save(update_fields=['total_volume', 'total_objects_count', 'updated_at'])
    
