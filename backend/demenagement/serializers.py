from rest_framework import serializers
from .models import ClientInformation, ManualSelection, Address
from ai_detector.views import ROOM_OBJECTS, OBJECT_VOLUMES


class ClientInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInformation
        fields = [
            'id', 'prenom', 'nom', 'email', 'phone', 'date_demenagement',
            'adresse_depart', 'etage_depart', 'ascenseur_depart', 'options_depart',
            'has_stopover', 'escale_adresse', 'escale_etage', 'escale_ascenseur', 'escale_options',
            'adresse_arrivee', 'etage_arrivee', 'ascenseur_arrivee', 'options_arrivee',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def validate_phone(self, value):
        """Validate French phone number format - only numbers allowed"""
        import re
        
        # Remove only spaces, dots, dashes, parentheses (common formatting)
        phone_clean = re.sub(r'[\s\-\.\(\)]', '', value)
        
        # Check if contains any non-digit characters (except + for international)
        if re.search(r'[^\d\+]', phone_clean):
            raise serializers.ValidationError("Le numéro de téléphone ne peut contenir que des chiffres")
        
        # Convert +33 to 0 for French format standardization
        if phone_clean.startswith('+33'):
            phone_clean = '0' + phone_clean[3:]
        
        # Check if it's exactly a valid French phone number (10 digits starting with 0)
        if not re.match(r'^0[1-9][0-9]{8}$', phone_clean):
            raise serializers.ValidationError("Format de téléphone français invalide. Doit être 10 chiffres commençant par 0 (ex: 0123456789)")
        
        # Ensure it's exactly 10 digits
        if len(phone_clean) != 10:
            raise serializers.ValidationError("Le numéro de téléphone français doit contenir exactement 10 chiffres")
        
        return phone_clean
    
    def validate_date_demenagement(self, value):
        """Validate moving date"""
        from datetime import date
        
        # Check if date is not in the past
        if value < date.today():
            raise serializers.ValidationError("La date de déménagement ne peut pas être dans le passé")
        
        return value
    
    def validate_etage(self, value, field_name):
        """Helper method to validate floor values"""
        if not value:
            raise serializers.ValidationError(f"L'étage est requis pour {field_name}")
        
        value = value.strip().upper()
        
        # Check if it's RDC
        if value == 'RDC':
            return value
        
        # Check if it's a valid number between 1 and 20
        try:
            etage_num = int(value)
            if 1 <= etage_num <= 20:
                return str(etage_num)
            else:
                raise serializers.ValidationError(
                    f"L'étage doit être 'RDC' ou un nombre entre 1 et 20 pour {field_name}"
                )
        except ValueError:
            raise serializers.ValidationError(
                f"L'étage doit être 'RDC' ou un nombre entre 1 et 20 pour {field_name}"
            )
    
    def validate_etage_depart(self, value):
        """Validate departure floor"""
        return self.validate_etage(value, "le départ")
    
    def validate_etage_arrivee(self, value):
        """Validate arrival floor"""
        return self.validate_etage(value, "l'arrivée")
    
    def validate_escale_etage(self, value):
        """Validate stopover floor"""
        if value:
            return self.validate_etage(value, "l'escale")
        return value
    
    def validate_ascenseur(self, value, field_name):
        """Helper method to validate elevator values"""
        valid_choices = ['Non', '2-3 personnes', '3-4 personnes', '4-6 personnes', '6-8 personnes ou plus']
        
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Valeur invalide pour l'ascenseur {field_name}. "
                f"Choisissez parmi: {', '.join(valid_choices)}"
            )
        return value
    
    def validate_ascenseur_depart(self, value):
        """Validate departure elevator"""
        return self.validate_ascenseur(value, "au départ")
    
    def validate_ascenseur_arrivee(self, value):
        """Validate arrival elevator"""
        return self.validate_ascenseur(value, "à l'arrivée")
    
    def validate_escale_ascenseur(self, value):
        """Validate stopover elevator"""
        if value:
            return self.validate_ascenseur(value, "à l'escale")
        return value
    
    def validate_options(self, value, field_name):
        """Helper method to validate options"""
        if not isinstance(value, dict):
            raise serializers.ValidationError(f"Les options pour {field_name} doivent être un objet JSON")
        
        # Valid option keys
        valid_keys = ['monte_meuble', 'cave_ou_garage', 'cours_a_traverser', 'distance_portage']
        
        # Check for invalid keys
        for key in value.keys():
            if key not in valid_keys:
                raise serializers.ValidationError(
                    f"Clé invalide '{key}' dans les options {field_name}. "
                    f"Clés valides: {', '.join(valid_keys)}"
                )
        
        # Validate that values are boolean
        for key, val in value.items():
            if not isinstance(val, bool):
                raise serializers.ValidationError(
                    f"La valeur de '{key}' doit être true ou false dans les options {field_name}"
                )
        
        return value
    
    def validate_options_depart(self, value):
        """Validate departure options"""
        return self.validate_options(value, "du départ")
    
    def validate_options_arrivee(self, value):
        """Validate arrival options"""
        return self.validate_options(value, "de l'arrivée")
    
    def validate_escale_options(self, value):
        """Validate stopover options"""
        if value:
            return self.validate_options(value, "de l'escale")
        return value
    
    def validate(self, data):
        """Validate stopover data if has_stopover is True"""
        has_stopover = data.get('has_stopover', False)
        
        if has_stopover:
            # If stopover is enabled, validate stopover requirements
            if not data.get('escale_etage'):
                raise serializers.ValidationError({
                    'escale_etage': "L'étage d'escale est requis quand l'escale est activée"
                })
        
        return data


class ManualSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualSelection
        fields = [
            'id', 'client_info', 'room_selections', 'heavy_objects', 'custom_objects', 'custom_heavy_objects',
            'method', 'surface_area', 'calculated_volumes',
            'total_volume', 'total_objects_count', 'base_price', 'final_price', 'status', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'total_volume', 'total_objects_count', 'created_at', 'updated_at']
    
    def validate_room_selections(self, value):
        """Validate that room selections contain valid rooms and objects"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Room selections must be a dictionary")
        
        errors = {}
        
        for room_name, objects in value.items():
            # Check if room exists in ROOM_OBJECTS
            if room_name not in ROOM_OBJECTS:
                errors[room_name] = f"Room '{room_name}' is not valid. Available rooms: {list(ROOM_OBJECTS.keys())}"
                continue
            
            # Check if objects in this room are valid
            if not isinstance(objects, dict):
                errors[room_name] = "Objects must be a dictionary with object names as keys and counts as values"
                continue
            
            room_errors = {}
            available_objects = ROOM_OBJECTS[room_name]
            
            for obj_name, count in objects.items():
                # Check if object exists in this room
                if obj_name not in available_objects:
                    room_errors[obj_name] = f"Object '{obj_name}' is not available in {room_name}. Available objects: {available_objects}"
                
                # Check if count is valid
                if not isinstance(count, int) or count < 0:
                    room_errors[obj_name] = "Count must be a positive integer"
            
            if room_errors:
                errors[room_name] = room_errors
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value
    
    def validate_heavy_objects(self, value):
        """Validate heavy objects selection"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Heavy objects must be a dictionary")
        
        # Get heavy objects from OBJECT_VOLUMES (objects with weight restrictions)
        heavy_object_names = [obj for obj in OBJECT_VOLUMES.keys() if 'max' in obj.lower() and 'kg' in obj.lower()]
        
        errors = {}
        for obj_name, count in value.items():
            # Check if it's a valid heavy object
            if obj_name not in heavy_object_names:
                errors[obj_name] = f"'{obj_name}' is not a valid heavy object. Available: {heavy_object_names}"
            
            # Check count
            if not isinstance(count, int) or count < 0:
                errors[obj_name] = "Count must be a positive integer"
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value
    
    def validate_custom_objects(self, value):
        """Validate custom objects selection"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Custom objects must be a dictionary")
        
        errors = {}
        for obj_name, obj_data in value.items():
            if not isinstance(obj_data, dict):
                errors[obj_name] = "Object data must be a dictionary with name, quantity, length, width, height"
                continue
                
            # Check required fields
            required_fields = ['name', 'quantity', 'length', 'width', 'height']
            obj_errors = {}
            
            for field in required_fields:
                if field not in obj_data:
                    obj_errors[field] = f"Field '{field}' is required"
                elif field == 'name':
                    # Validate name field (string, not empty)
                    if not isinstance(obj_data[field], str) or not obj_data[field].strip():
                        obj_errors[field] = f"Field '{field}' must be a non-empty string"
                elif not isinstance(obj_data[field], (int, float)) or obj_data[field] <= 0:
                    obj_errors[field] = f"Field '{field}' must be a positive number"
            
            if obj_errors:
                errors[obj_name] = obj_errors
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value
    
    def validate_custom_heavy_objects(self, value):
        """Validate custom heavy objects selection"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Custom heavy objects must be a dictionary")
        
        errors = {}
        for obj_name, obj_data in value.items():
            if not isinstance(obj_data, dict):
                errors[obj_name] = "Object data must be a dictionary with name, quantity, length, width, height"
                continue
                
            # Check required fields
            required_fields = ['name', 'quantity', 'length', 'width', 'height']
            obj_errors = {}
            
            for field in required_fields:
                if field not in obj_data:
                    obj_errors[field] = f"Field '{field}' is required"
                elif field == 'name':
                    # Validate name field (string, not empty)
                    if not isinstance(obj_data[field], str) or not obj_data[field].strip():
                        obj_errors[field] = f"Field '{field}' must be a non-empty string"
                elif not isinstance(obj_data[field], (int, float)) or obj_data[field] <= 0:
                    obj_errors[field] = f"Field '{field}' must be a positive number"
            
            if obj_errors:
                errors[obj_name] = obj_errors
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return value
    
    def create(self, validated_data):
        """Create ManualSelection and calculate totals"""
        selection = ManualSelection.objects.create(**validated_data)
        selection.calculate_totals()  # Calculate volume and object count
        return selection
    
    def update(self, instance, validated_data):
        """Update ManualSelection and recalculate totals"""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        instance.calculate_totals()  # Recalculate totals
        return instance


class AddressSerializer(serializers.ModelSerializer):
    # Add choices as extra fields for frontend
    etage_choices = serializers.SerializerMethodField(read_only=True)
    ascenseur_choices = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Address
        fields = [
            'id', 'client_info',
            'adresse_depart', 'etage_depart', 'ascenseur_depart', 'options_depart',
            'has_stopover', 'escale_adresse', 'escale_etage', 'escale_ascenseur', 'escale_options',
            'adresse_arrivee', 'etage_arrivee', 'ascenseur_arrivee', 'options_arrivee',
            'created_at', 'updated_at',
            'etage_choices', 'ascenseur_choices'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'etage_choices', 'ascenseur_choices']
    
    def get_etage_choices(self, obj):
        """Return available floor choices"""
        return [choice[0] for choice in Address.ETAGE_CHOICES]
    
    def get_ascenseur_choices(self, obj):
        """Return available elevator choices"""
        return [choice[0] for choice in Address.ASCENSEUR_CHOICES]
    
    def validate_etage(self, value, field_name):
        """Helper method to validate floor values"""
        if not value:
            raise serializers.ValidationError(f"L'étage est requis pour {field_name}")
        
        value = value.strip().upper()
        
        # Check if it's RDC
        if value == 'RDC':
            return value
        
        # Check if it's a valid number between 1 and 20
        try:
            etage_num = int(value)
            if 1 <= etage_num <= 20:
                return str(etage_num)
            else:
                raise serializers.ValidationError(
                    f"L'étage doit être 'RDC' ou un nombre entre 1 et 20 pour {field_name}"
                )
        except ValueError:
            raise serializers.ValidationError(
                f"L'étage doit être 'RDC' ou un nombre entre 1 et 20 pour {field_name}"
            )
    
    def validate_etage_depart(self, value):
        """Validate departure floor"""
        return self.validate_etage(value, "le départ")
    
    def validate_etage_arrivee(self, value):
        """Validate arrival floor"""
        return self.validate_etage(value, "l'arrivée")
    
    def validate_escale_etage(self, value):
        """Validate stopover floor"""
        if value:
            return self.validate_etage(value, "l'escale")
        return value
    
    def validate_ascenseur(self, value, field_name):
        """Helper method to validate elevator values"""
        valid_choices = ['Non', '2-3 personnes', '3-4 personnes', '4-6 personnes', '6-8 personnes ou plus']
        
        if value not in valid_choices:
            raise serializers.ValidationError(
                f"Valeur invalide pour l'ascenseur {field_name}. "
                f"Choisissez parmi: {', '.join(valid_choices)}"
            )
        return value
    
    def validate_ascenseur_depart(self, value):
        """Validate departure elevator"""
        return self.validate_ascenseur(value, "au départ")
    
    def validate_ascenseur_arrivee(self, value):
        """Validate arrival elevator"""
        return self.validate_ascenseur(value, "à l'arrivée")
    
    def validate_escale_ascenseur(self, value):
        """Validate stopover elevator"""
        if value:
            return self.validate_ascenseur(value, "à l'escale")
        return value
    
    def validate_options(self, value, field_name):
        """Helper method to validate options"""
        if not isinstance(value, dict):
            raise serializers.ValidationError(f"Les options pour {field_name} doivent être un objet JSON")
        
        # Valid option keys
        valid_keys = ['monte_meuble', 'cave_ou_garage', 'cours_a_traverser', 'distance_portage']
        
        # Check for invalid keys
        for key in value.keys():
            if key not in valid_keys:
                raise serializers.ValidationError(
                    f"Clé invalide '{key}' dans les options {field_name}. "
                    f"Clés valides: {', '.join(valid_keys)}"
                )
        
        # Validate that values are boolean
        for key, val in value.items():
            if not isinstance(val, bool):
                raise serializers.ValidationError(
                    f"La valeur de '{key}' doit être true ou false dans les options {field_name}"
                )
        
        return value
    
    def validate_options_depart(self, value):
        """Validate departure options"""
        return self.validate_options(value, "du départ")
    
    def validate_options_arrivee(self, value):
        """Validate arrival options"""
        return self.validate_options(value, "de l'arrivée")
    
    def validate_escale_options(self, value):
        """Validate stopover options"""
        if value:
            return self.validate_options(value, "de l'escale")
        return value
    
    def validate(self, data):
        """Validate stopover data if has_stopover is True"""
        has_stopover = data.get('has_stopover', False)
        
        if has_stopover:
            # If stopover is enabled, validate stopover requirements
            if not data.get('escale_etage'):
                raise serializers.ValidationError({
                    'escale_etage': "L'étage d'escale est requis quand l'escale est activée"
                })
        
        return data
