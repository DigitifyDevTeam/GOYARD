from rest_framework import serializers
from .models import ClientInformation, ManualSelection
from ai_detector.views import ROOM_OBJECTS, OBJECT_VOLUMES


class ClientInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClientInformation
        fields = ['id', 'prenom', 'nom', 'email', 'phone', 'adresse_depart', 'date_demenagement', 'created_at', 'updated_at']
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
    
    def validate_adresse_depart(self, value):
        """Validate departure address"""
        if len(value.strip()) < 10:
            raise serializers.ValidationError("L'adresse doit contenir au moins 10 caractères")
        
        return value.strip()


class ManualSelectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualSelection
        fields = [
            'id', 'client_info', 'room_selections', 'heavy_objects', 'custom_objects',
            'total_volume', 'total_objects_count', 'status', 
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
