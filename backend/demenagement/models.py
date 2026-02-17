from django.db import models


class ClientInformation(models.Model):
    # Choices for floor
    ETAGE_CHOICES = [
        ('RDC', 'RDC'),
        ('1', '1'), ('2', '2'), ('3', '3'), ('4', '4'), ('5', '5'),
        ('6', '6'), ('7', '7'), ('8', '8'), ('9', '9'), ('10', '10'),
        ('11', '11'), ('12', '12'), ('13', '13'), ('14', '14'), ('15', '15'),
        ('16', '16'), ('17', '17'), ('18', '18'), ('19', '19'), ('20', '20'),
    ]
    
    # Choices for elevator
    ASCENSEUR_CHOICES = [
        ('Non', 'Non'),
        ('2-3 personnes', '2-3 personnes'),
        ('3-4 personnes', '3-4 personnes'),
        ('4-6 personnes', '4-6 personnes'),
        ('6-8 personnes ou plus', '6-8 personnes ou plus'),
    ]
    
    # Informations personnelles
    nom = models.CharField(max_length=30, verbose_name="Nom de famille")
    prenom = models.CharField(max_length=30, verbose_name="Prénom")
    email = models.EmailField(verbose_name="Adresse email")
    phone = models.CharField(max_length=20, verbose_name="Numéro de téléphone")
    
    # Date de déménagement
    date_demenagement = models.DateField(verbose_name="Date de déménagement")
    
    # Adresse de départ
    adresse_depart = models.TextField(verbose_name="Adresse de départ", default='')
    etage_depart = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        default='RDC',
        verbose_name="Étage de départ"
    )
    ascenseur_depart = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        verbose_name="Ascenseur au départ"
    )
    options_depart = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options départ",
        help_text="Options: monte_meuble, cave_ou_garage, cours_a_traverser, distance_portage"
    )
    
    # Escale (optionnelle)
    has_stopover = models.BooleanField(default=False, verbose_name="Escale intermédiaire")
    escale_adresse = models.TextField(blank=True, default='', verbose_name="Adresse escale")
    escale_etage = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        blank=True,
        default='RDC',
        verbose_name="Étage escale"
    )
    escale_ascenseur = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        blank=True,
        verbose_name="Ascenseur à l'escale"
    )
    escale_options = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options escale"
    )
    
    # Adresse d'arrivée
    adresse_arrivee = models.TextField(verbose_name="Adresse d'arrivée", default='')
    etage_arrivee = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        default='RDC',
        verbose_name="Étage d'arrivée"
    )
    ascenseur_arrivee = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        verbose_name="Ascenseur à l'arrivée"
    )
    options_arrivee = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options arrivée"
    )
    
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
    
    # Custom heavy objects added by user (JSON format)
    # Example: {"Piano personnalisé": {"quantity": 1, "length": 150, "width": 60, "height": 100}}
    custom_heavy_objects = models.JSONField(
        default=dict,
        verbose_name="Objets lourds personnalisés",
        help_text="Objets lourds ajoutés manuellement par l'utilisateur avec dimensions"
    )
    
    # Method used for calculation
    METHOD_CHOICES = [
        ('manual', 'Sélection manuelle'),
        ('ai', 'Analyse IA'),
        ('superficie', 'Calcul superficie'),
    ]
    
    method = models.CharField(
        max_length=25,
        choices=METHOD_CHOICES,
        default='manual',
        verbose_name="Méthode de calcul"
    )
    
    # Superficie calculation fields
    surface_area = models.FloatField(
        null=True,
        blank=True,
        verbose_name="Surface (m²)",
        help_text="Surface du logement en mètres carrés"
    )
    
    calculated_volumes = models.JSONField(
        default=dict,
        verbose_name="Volumes calculés",
        help_text="Volumes calculés selon les formules (vhouse, vfurniture, total_volume)"
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
    
    # Price fields
    base_price = models.FloatField(
        default=0.0,
        verbose_name="Prix de base (€)",
        help_text="Prix calculé avant ajustements"
    )
    
    final_price = models.FloatField(
        default=0.0,
        verbose_name="Prix final (€)",
        help_text="Prix final après tous les ajustements"
    )
    
    # Status tracking
    STATUS_CHOICES = [
        ('draft', 'Brouillon'),
        ('completed', 'Terminé'),
        ('validated', 'Validé'),
    ]
    
    status = models.CharField(
        max_length=25,
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

        # Add custom objects
        for obj_name, obj_data in self.custom_objects.items():
            if isinstance(obj_data, dict) and 'quantity' in obj_data:
                count = obj_data['quantity']
                if count > 0:
                    if obj_name in all_objects:
                        all_objects[obj_name] += count
                    else:
                        all_objects[obj_name] = count
        
        # Add custom heavy objects
        for obj_name, obj_data in self.custom_heavy_objects.items():
            if isinstance(obj_data, dict) and 'quantity' in obj_data:
                count = obj_data['quantity']
                if count > 0:
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
    
class Address(models.Model):
    """
    Model to store moving addresses (departure, stopover, arrival)
    """
    # Choices for floor
    ETAGE_CHOICES = [
        ('RDC', 'RDC'),
        ('1', '1'),
        ('2', '2'),
        ('3', '3'),
        ('4', '4'),
        ('5', '5'),
        ('6', '6'),
        ('7', '7'),
        ('8', '8'),
        ('9', '9'),
        ('10', '10'),
        ('11', '11'),
        ('12', '12'),
        ('13', '13'),
        ('14', '14'),
        ('15', '15'),
        ('16', '16'),
        ('17', '17'),
        ('18', '18'),
        ('19', '19'),
        ('20', '20'),
    ]
    
    # Choices for elevator
    ASCENSEUR_CHOICES = [
        ('Non', 'Non'),
        ('2-3 personnes', '2-3 personnes'),
        ('3-4 personnes', '3-4 personnes'),
        ('4-6 personnes', '4-6 personnes'),
        ('6-8 personnes ou plus', '6-8 personnes ou plus'),
    ]
    
    # Link to client information
    client_info = models.ForeignKey(
        ClientInformation,
        on_delete=models.CASCADE,
        related_name='addresses',
        verbose_name="Information Client"
    )
    
    # Departure address
    adresse_depart = models.TextField(verbose_name="Adresse de départ")
    etage_depart = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        default='RDC',
        verbose_name="Étage de départ", 
        help_text="RDC ou nombre entre 1 et 20"
    )
    ascenseur_depart = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        verbose_name="Ascenseur au départ"
    )
    demi_etage_depart = models.BooleanField(
        default=False,
        verbose_name="Ascenseur desservant uniquement un demi-étage (départ)"
    )
    options_depart = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options départ",
        help_text="Options: monte_meuble, cave_ou_garage, cours_a_traverser, distance_portage"
    )
    
    # Stopover address (optional)
    has_stopover = models.BooleanField(default=False, verbose_name="Escale intermédiaire")
    escale_adresse = models.TextField(blank=True, null=True, verbose_name="Adresse escale")
    escale_etage = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        blank=True, 
        null=True,
        default='RDC',
        verbose_name="Étage escale",
        help_text="RDC ou nombre entre 1 et 20"
    )
    escale_ascenseur = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        blank=True,
        null=True,
        verbose_name="Ascenseur à l'escale"
    )
    demi_etage_escale = models.BooleanField(
        default=False,
        verbose_name="Ascenseur desservant uniquement un demi-étage (escale)"
    )
    escale_options = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options escale",
        help_text="Options: monte_meuble, cave_ou_garage, cours_a_traverser, distance_portage"
    )
    
    # Arrival address
    adresse_arrivee = models.TextField(verbose_name="Adresse d'arrivée")
    etage_arrivee = models.CharField(
        max_length=10,
        choices=ETAGE_CHOICES,
        default='RDC',
        verbose_name="Étage d'arrivée", 
        help_text="RDC ou nombre entre 1 et 20"
    )
    ascenseur_arrivee = models.CharField(
        max_length=25,
        choices=ASCENSEUR_CHOICES,
        default='Non',
        verbose_name="Ascenseur à l'arrivée"
    )
    demi_etage_arrivee = models.BooleanField(
        default=False,
        verbose_name="Ascenseur desservant uniquement un demi-étage (arrivée)"
    )
    options_arrivee = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Options arrivée",
        help_text="Options: monte_meuble, cave_ou_garage, cours_a_traverser, distance_portage"
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Créé le")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Modifié le")
    
    class Meta:
        verbose_name = "Adresse"
        verbose_name_plural = "Adresses"
        ordering = ['-created_at']
    
    def __str__(self):
        if self.has_stopover:
            return f"{self.adresse_depart} → {self.escale_adresse} → {self.adresse_arrivee}"
        return f"{self.adresse_depart} → {self.adresse_arrivee}"