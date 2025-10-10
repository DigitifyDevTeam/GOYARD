from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ClientInformation, ManualSelection, Address
from .serializers import ClientInformationSerializer, ManualSelectionSerializer, AddressSerializer

# Import volume calculation functions from ai_detector
from ai_detector.views import calculate_total_volume, calculate_quote, OBJECT_VOLUMES, ROOM_OBJECTS


@api_view(['POST'])
def submit_client_information(request):
    """
    API endpoint to submit client information with address details for quote request
    
    Expected JSON data:
    {
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@email.com",
        "phone": "0123456789",
        "date_demenagement": "2024-12-25",
        "adresse_depart": "123 Rue de la Paix, 75001 Paris",
        "etage_depart": "3",
        "ascenseur_depart": "2 personnes",
        "options_depart": {
            "monte_meuble": false,
            "cave_ou_garage": true,
            "cours_a_traverser": false
        },
        "has_stopover": false,
        "adresse_arrivee": "456 Avenue Victor Hugo, 75016 Paris",
        "etage_arrivee": "RDC",
        "ascenseur_arrivee": "Non",
        "options_arrivee": {
            "monte_meuble": true,
            "cave_ou_garage": false,
            "cours_a_traverser": true
        }
    }
    """
    serializer = ClientInformationSerializer(data=request.data)
    
    if serializer.is_valid():
        client_info = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Informations client enregistrées avec succès',
            'data': ClientInformationSerializer(client_info).data
        }, status=status.HTTP_201_CREATED)
    
    else:
        print("Serializer errors:", serializer.errors)
        return Response({
            'success': False,
            'message': 'Données invalides',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_client_information(request, client_id):
    """
    API endpoint to retrieve client information by ID
    """
    try:
        client_info = ClientInformation.objects.get(id=client_id)
        serializer = ClientInformationSerializer(client_info)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except ClientInformation.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Client non trouvé'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def list_client_information(request):
    """
    API endpoint to list all client information (for admin purposes)
    """
    clients = ClientInformation.objects.all().order_by('-created_at')
    serializer = ClientInformationSerializer(clients, many=True)
    
    return Response({
        'success': True,
        'count': clients.count(),
        'data': serializer.data
    }, status=status.HTTP_200_OK)


# ==================== MANUAL SELECTION API ====================

@api_view(['GET'])
def get_room_objects(request):
    """
    API endpoint to get available objects for all rooms or specific room
    
    Usage:
    GET /api/demenagement/rooms/objects/           - Get all rooms and objects
    GET /api/demenagement/rooms/objects/?room=salon - Get objects for specific room
    """
    room_param = request.GET.get('room')
    
    if room_param:
        # Get objects for specific room
        if room_param not in ROOM_OBJECTS:
            return Response({
                'success': False,
                'message': f"Room '{room_param}' not found",
                'available_rooms': list(ROOM_OBJECTS.keys())
            }, status=status.HTTP_404_NOT_FOUND)
        
        return Response({
            'success': True,
            'room': room_param,
            'objects': ROOM_OBJECTS[room_param]
        }, status=status.HTTP_200_OK)
    
    else:
        # Get all rooms and objects
        return Response({
            'success': True,
            'rooms': ROOM_OBJECTS
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_heavy_objects(request):
    """
    API endpoint to get available heavy objects (+80kg)
    """
    heavy_objects = [obj for obj in OBJECT_VOLUMES.keys() if 'max' in obj.lower() and 'kg' in obj.lower()]
    
    return Response({
        'success': True,
        'heavy_objects': heavy_objects,
        'count': len(heavy_objects)
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_manual_selection(request):
    """
    API endpoint to create manual object selection
    
    Expected JSON data:
    {
        "client_info": 1,
        "room_selections": {
            "entree": {"Banc": 2, "Cadre": 1},
            "salon": {"Canapé 3 places (-80KG)": 1, "Fauteuil": 2}
        },
        "heavy_objects": {
            "Piano droit (max 200kgs)": 1,
            "Armoire forte (max 200kgs)": 0
        }
    }
    """
    print("Request data:", request.data)
    
    # Get client_info from request
    client_info_id = request.data.get('client_info')
    if not client_info_id:
        return Response({
            'success': False,
            'message': 'client_info is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if client already has existing selections
    existing_selections = ManualSelection.objects.filter(client_info_id=client_info_id)
    
    if existing_selections.exists():
        # Delete all previous selections for this client
        deleted_count = existing_selections.count()
        existing_selections.delete()
        print(f"Deleted {deleted_count} previous selections for client {client_info_id}")
    
    # Also delete any AI-related data for this client (if they switch from AI to manual)
    try:
        from ai_detector.models import Room, Photo, DetectedObject, Quote, RoomAnalysis, RoomObject
        from django.contrib.auth.models import User
        
        # Get the client information to find the email
        client_info = ClientInformation.objects.get(id=client_info_id)
        client_email = client_info.email
        
        # Find users with matching email (in case there are multiple users with same email)
        matching_users = User.objects.filter(email=client_email)
        
        if matching_users.exists():
            for user in matching_users:
                # Delete AI quotes for this user
                ai_quotes = Quote.objects.filter(user=user)
                if ai_quotes.exists():
                    ai_quotes_count = ai_quotes.count()
                    ai_quotes.delete()
                    print(f"Deleted {ai_quotes_count} AI quotes for user {user.email} (manual method chosen)")
                
                # Delete room objects for this user
                ai_room_objects = RoomObject.objects.filter(room_analysis__user=user)
                if ai_room_objects.exists():
                    ai_room_objects_count = ai_room_objects.count()
                    ai_room_objects.delete()
                    print(f"Deleted {ai_room_objects_count} AI room objects for user {user.email} (manual method chosen)")
                
                # Delete room analyses for this user
                ai_analyses = RoomAnalysis.objects.filter(user=user)
                if ai_analyses.exists():
                    ai_analyses_count = ai_analyses.count()
                    ai_analyses.delete()
                    print(f"Deleted {ai_analyses_count} AI room analyses for user {user.email} (manual method chosen)")
                
                # Delete detected objects for this user
                ai_objects = DetectedObject.objects.filter(photo__room__user=user)
                if ai_objects.exists():
                    ai_objects_count = ai_objects.count()
                    ai_objects.delete()
                    print(f"Deleted {ai_objects_count} AI detected objects for user {user.email} (manual method chosen)")
                
                # Delete photos for this user
                ai_photos = Photo.objects.filter(room__user=user)
                if ai_photos.exists():
                    ai_photos_count = ai_photos.count()
                    ai_photos.delete()
                    print(f"Deleted {ai_photos_count} AI photos for user {user.email} (manual method chosen)")
                
                # Delete rooms for this user
                ai_rooms = Room.objects.filter(user=user)
                if ai_rooms.exists():
                    ai_rooms_count = ai_rooms.count()
                    ai_rooms.delete()
                    print(f"Deleted {ai_rooms_count} AI rooms for user {user.email} (manual method chosen)")
        else:
            print(f"No matching user found for client email {client_email}")
            
    except Exception as e:
        print(f"Error deleting AI data for client {client_info_id}: {e}")
        # Continue with manual selection creation even if AI deletion fails
    
    # Create new selection
    serializer = ManualSelectionSerializer(data=request.data)
    
    if serializer.is_valid():
        selection = serializer.save()
        print(f"Manual selection created with ID: {selection.id}")
        
        # Calculate quote
        all_objects = {}
        
        # Combine room selections
        for room_objects in selection.room_selections.values():
            for obj_name, count in room_objects.items():
                all_objects[obj_name] = all_objects.get(obj_name, 0) + count
        
        # Add heavy objects
        for obj_name, count in selection.heavy_objects.items():
            if count > 0:
                all_objects[obj_name] = all_objects.get(obj_name, 0) + count
        
        # Add custom objects (manual, non-heavy)
        if selection.custom_objects:
            for obj_name, obj_data in selection.custom_objects.items():
                try:
                    qty = int(obj_data.get('quantity', 0)) if isinstance(obj_data, dict) else 0
                except (TypeError, ValueError):
                    qty = 0
                if qty > 0:
                    all_objects[obj_name] = all_objects.get(obj_name, 0) + qty

        # Add custom heavy objects
        if selection.custom_heavy_objects:
            for obj_name, obj_data in selection.custom_heavy_objects.items():
                try:
                    qty = int(obj_data.get('quantity', 0)) if isinstance(obj_data, dict) else 0
                except (TypeError, ValueError):
                    qty = 0
                if qty > 0:
                    all_objects[obj_name] = all_objects.get(obj_name, 0) + qty
        
        # Calculate volume and quote
        volume_calc = calculate_total_volume(all_objects)
        quote_calc = calculate_quote(volume_calc)
        
        return Response({
            'success': True,
            'message': 'Sélection manuelle créée avec succès',
            'data': {
                'selection_id': selection.id,
                'client_info': selection.client_info.id,
                'total_volume': selection.total_volume,
                'total_objects': selection.total_objects_count,
                'rooms_selected': selection.get_total_rooms(),
                'heavy_objects_count': selection.get_heavy_objects_count(),
                'status': selection.status
            },
            'volume_calculation': volume_calc,
            'quote_estimation': quote_calc
        }, status=status.HTTP_201_CREATED)
    
    else:
        print("Serializer errors:", serializer.errors)
        return Response({
            'success': False,
            'message': 'Données invalides',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_manual_selection(request, selection_id):
    """
    API endpoint to retrieve manual selection by ID
    """
    try:
        selection = ManualSelection.objects.get(id=selection_id)
        serializer = ManualSelectionSerializer(selection)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except ManualSelection.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Sélection non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def list_manual_selections(request):
    """
    API endpoint to list manual selections (optionally filtered by client)
    """
    client_id = request.GET.get('client_id')
    print(f"List manual selections - client_id: {client_id}")
    
    if client_id:
        selections = ManualSelection.objects.filter(client_info_id=client_id)
        print(f"Found {selections.count()} selections for client {client_id}")
    else:
        selections = ManualSelection.objects.all()
        print(f"Found {selections.count()} total selections")
    
    serializer = ManualSelectionSerializer(selections, many=True)
    
    return Response({
        'success': True,
        'count': selections.count(),
        'data': serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_superficie_calculation(request):
    """Create superficie calculation with formulas: vhouse = x * 2.5, vfurniture = 40 m³"""
    try:
        data = request.data
        
        # Extract superficie calculation data
        client_info_id = data.get('client_info')
        surface_area = data.get('surface_area')
        calculated_volumes = data.get('calculated_volumes', {})
        heavy_objects = data.get('heavy_objects', {})
        custom_heavy_objects = data.get('custom_heavy_objects', {})
        special_objects_selected = data.get('special_objects_selected', False)
        special_object_quantities = data.get('special_object_quantities', {})
        
        print(f"Superficie calculation request: {data}")
        
        # Validate required fields
        if not client_info_id:
            return Response({
                'success': False,
                'error': 'Client information is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not surface_area or surface_area <= 0:
            return Response({
                'success': False,
                'error': 'Valid surface area is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get client information
        try:
            client_info = ClientInformation.objects.get(id=client_info_id)
        except ClientInformation.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Client not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        # Calculate volumes using the formulas
        vhouse = surface_area * 2.5  # vhouse = x * 2.5
        vfurniture = 40  # vfurniture = 500 * 0.08 = 40 m³
        total_volume = vhouse + vfurniture
        
        # Calculate quote based on total volume
        PRICE_PER_M3 = 15  # Price per cubic meter
        base_price = total_volume * PRICE_PER_M3
        final_price = base_price  # Can add additional calculations here
        
        # Create superficie calculation record
        superficie_calculation = ManualSelection.objects.create(
            client_info=client_info,
            method='superficie',
            surface_area=surface_area,
            calculated_volumes={
                'vhouse': vhouse,
                'vfurniture': vfurniture,
                'total_volume': total_volume
            },
            heavy_objects=heavy_objects,
            custom_heavy_objects=custom_heavy_objects,
            total_volume=total_volume,
            total_objects_count=len(heavy_objects) + len(custom_heavy_objects),
            base_price=base_price,
            final_price=final_price,
            status='completed'
        )
        
        print(f"Superficie calculation created with ID: {superficie_calculation.id}")
        
        return Response({
            'success': True,
            'message': 'Superficie calculation created successfully',
            'calculation_id': superficie_calculation.id,
            'calculated_volumes': {
                'vhouse': vhouse,
                'vfurniture': vfurniture,
                'total_volume': total_volume
            },
            'quote': {
                'base_price': base_price,
                'final_price': final_price,
                'volume_breakdown': f"Volume maison: {vhouse}m³, Volume mobilier: {vfurniture}m³"
            }
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        print(f"Error creating superficie calculation: {str(e)}")
        return Response({
            'success': False,
            'error': f'Error creating superficie calculation: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_volume_calculation(request):
    """Get volume calculation from surface area and heavy objects data"""
    try:
        # Get surface area from query parameters
        surface_area = request.GET.get('surface_area')
        client_id = request.GET.get('client_id')
        
        if not surface_area:
            return Response({
                'success': False,
                'error': 'Surface area (surface_area) parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            surface_area = float(surface_area)
            if surface_area <= 0:
                raise ValueError("Surface area must be positive")
        except ValueError:
            return Response({
                'success': False,
                'error': 'Invalid surface area. Must be a positive number.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate volumes using the formulas
        vhouse = surface_area * 2.5  # vhouse = x * 2.5
        vfurniture = 40  # vfurniture = 500 * 0.08 = 40 m³
        total_volume = vhouse + vfurniture
        
        # Calculate quote
        PRICE_PER_M3 = 15  # Price per cubic meter
        base_price = total_volume * PRICE_PER_M3
        final_price = base_price
        
        # Get heavy objects data if client_id is provided
        heavy_objects_data = {}
        custom_heavy_objects_data = {}
        
        if client_id:
            try:
                # Get the latest superficie calculation for this client
                superficie_calc = ManualSelection.objects.filter(
                    client_info_id=client_id,
                    method='superficie'
                ).order_by('-created_at').first()
                
                if superficie_calc:
                    heavy_objects_data = superficie_calc.heavy_objects
                    custom_heavy_objects_data = superficie_calc.custom_heavy_objects
                    
                    print(f"Found superficie calculation for client {client_id}: {superficie_calc.id}")
                else:
                    print(f"No superficie calculation found for client {client_id}")
                    
            except Exception as e:
                print(f"Error retrieving heavy objects for client {client_id}: {str(e)}")
        
        # Prepare response
        response_data = {
            'success': True,
            'calculation': {
                'surface_area': surface_area,
                'formulas': {
                    'vhouse': f"{surface_area} * 2.5 = {vhouse}",
                    'vfurniture': "500 * 0.08 = 40",
                    'total_volume': f"{vhouse} + {vfurniture} = {total_volume}"
                },
                'volumes': {
                    'vhouse': vhouse,
                    'vfurniture': vfurniture,
                    'total_volume': total_volume
                },
                'quote': {
                    'base_price': base_price,
                    'final_price': final_price,
                    'price_per_m3': PRICE_PER_M3,
                    'volume_breakdown': f"Volume maison: {vhouse}m³, Volume mobilier: {vfurniture}m³"
                }
            },
            'heavy_objects': {
                'predefined': heavy_objects_data,
                'custom': custom_heavy_objects_data,
                'total_heavy_objects': len(heavy_objects_data) + len(custom_heavy_objects_data)
            }
        }
        
        print(f"Volume calculation response: {response_data}")
        
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error in volume calculation: {str(e)}")
        return Response({
            'success': False,
            'error': f'Error calculating volume: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_superficie_calculations(request):
    """Get all superficie calculations data"""
    try:
        # Get query parameters
        client_id = request.GET.get('client_id')
        calculation_id = request.GET.get('calculation_id')
        
        # Build query
        if calculation_id:
            # Get specific calculation
            try:
                calculation = ManualSelection.objects.get(
                    id=calculation_id,
                    method='superficie'
                )
                calculations = [calculation]
            except ManualSelection.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Superficie calculation not found'
                }, status=status.HTTP_404_NOT_FOUND)
        elif client_id:
            # Get all calculations for specific client
            calculations = ManualSelection.objects.filter(
                client_info_id=client_id,
                method='superficie'
            ).order_by('-created_at')
        else:
            # Get all superficie calculations
            calculations = ManualSelection.objects.filter(
                method='superficie'
            ).order_by('-created_at')
        
        # Serialize the data
        serializer = ManualSelectionSerializer(calculations, many=True)
        
        # Prepare response with additional details
        response_data = []
        for calc in calculations:
            calc_data = {
                'id': calc.id,
                'client_info': {
                    'id': calc.client_info.id,
                    'nom': calc.client_info.nom,
                    'prenom': calc.client_info.prenom,
                    'email': calc.client_info.email
                },
                'method': calc.method,
                'surface_area': calc.surface_area,
                'calculated_volumes': calc.calculated_volumes,
                'heavy_objects': calc.heavy_objects,
                'custom_heavy_objects': calc.custom_heavy_objects,
                'total_volume': calc.total_volume,
                'total_objects_count': calc.total_objects_count,
                'base_price': calc.base_price,
                'final_price': calc.final_price,
                'status': calc.status,
                'created_at': calc.created_at,
                'updated_at': calc.updated_at,
                'formula_breakdown': {
                    'vhouse_formula': f"{calc.surface_area} * 2.5 = {calc.calculated_volumes.get('vhouse', 0)}",
                    'vfurniture_formula': "500 * 0.08 = 40",
                    'total_formula': f"{calc.calculated_volumes.get('vhouse', 0)} + 40 = {calc.total_volume}"
                }
            }
            response_data.append(calc_data)
        
        return Response({
            'success': True,
            'count': len(response_data),
            'data': response_data
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Error retrieving superficie calculations: {str(e)}")
        return Response({
            'success': False,
            'error': f'Error retrieving data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== ADDRESS API ====================

@api_view(['POST'])
def create_address(request):
    """
    API endpoint to create a new address
    
    Expected JSON data:
    {
        "client_info": 1,
        "adresse_depart": "123 Rue de la Paix, 75001 Paris",
        "etage_depart": "3",  // Choices: "RDC", "1", "2", ..., "20"
        "ascenseur_depart": "2 personnes",  // Choices: "Non", "1 personne", "2 personnes", "3 personnes", "4 personnes ou plus"
        "options_depart": {
            "monte_meuble": true,
            "cave_ou_garage": false,
            "cours_a_traverser": true
        },
        "has_stopover": true,
        "escale_adresse": "456 Avenue des Champs, 75008 Paris",
        "escale_etage": "2",
        "escale_ascenseur": "1 personne",
        "escale_options": {
            "monte_meuble": false,
            "cave_ou_garage": true,
            "cours_a_traverser": false
        },
        "adresse_arrivee": "789 Boulevard Saint-Germain, 75006 Paris",
        "etage_arrivee": "5",
        "ascenseur_arrivee": "4 personnes ou plus",
        "options_arrivee": {
            "monte_meuble": true,
            "cave_ou_garage": false,
            "cours_a_traverser": true
        }
    }
    """
    print("Create address request data:", request.data)
    
    # Check if client already has an address
    client_info_id = request.data.get('client_info')
    if client_info_id:
        existing_addresses = Address.objects.filter(client_info_id=client_info_id)
        if existing_addresses.exists():
            # Delete previous addresses for this client
            deleted_count = existing_addresses.count()
            existing_addresses.delete()
            print(f"Deleted {deleted_count} previous addresses for client {client_info_id}")
    
    serializer = AddressSerializer(data=request.data)
    
    if serializer.is_valid():
        address = serializer.save()
        
        # Check and update "Mon déménagement" (adresse_depart) in ClientInformation if different
        try:
            client_info = address.client_info
            
            # Compare adresse_depart from Address API with ClientInformation "Mon déménagement"
            if client_info.adresse_depart != address.adresse_depart:
                print(f"Updating ClientInformation.adresse_depart from '{client_info.adresse_depart}' to '{address.adresse_depart}'")
                client_info.adresse_depart = address.adresse_depart
                client_info.save()
                print(f"ClientInformation {client_info.id} 'Mon déménagement' updated successfully")
            else:
                print(f"ClientInformation {client_info.id} 'Mon déménagement' is already in sync with Address API")
                
        except Exception as e:
            print(f"Error checking/updating ClientInformation adresse_depart: {e}")
        
        return Response({
            'success': True,
            'message': 'Adresse créée avec succès',
            'data': {
                'id': address.id,
                'client_info': address.client_info.id,
                'adresse_depart': address.adresse_depart,
                'etage_depart': address.etage_depart,
                'ascenseur_depart': address.ascenseur_depart,
                'options_depart': address.options_depart,
                'has_stopover': address.has_stopover,
                'escale_adresse': address.escale_adresse,
                'escale_etage': address.escale_etage,
                'escale_ascenseur': address.escale_ascenseur,
                'escale_options': address.escale_options,
                'adresse_arrivee': address.adresse_arrivee,
                'etage_arrivee': address.etage_arrivee,
                'ascenseur_arrivee': address.ascenseur_arrivee,
                'options_arrivee': address.options_arrivee,
                'created_at': address.created_at.isoformat()
            }
        }, status=status.HTTP_201_CREATED)
    
    else:
        print("Address serializer errors:", serializer.errors)
        return Response({
            'success': False,
            'message': 'Données invalides',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_address(request, address_id):
    """
    API endpoint to retrieve an address by ID
    """
    try:
        address = Address.objects.get(id=address_id)
        serializer = AddressSerializer(address)
        
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)
        
    except Address.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Adresse non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_address_by_client(request, client_id):
    """
    API endpoint to retrieve address(es) for a specific client
    """
    addresses = Address.objects.filter(client_info_id=client_id).order_by('-created_at')
    
    if not addresses.exists():
        return Response({
            'success': False,
            'message': 'Aucune adresse trouvée pour ce client'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Get the most recent address
    latest_address = addresses.first()
    serializer = AddressSerializer(latest_address)
    
    return Response({
        'success': True,
        'data': serializer.data,
        'total_addresses': addresses.count()
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
def list_addresses(request):
    """
    API endpoint to list all addresses (optionally filtered by client)
    
    Query parameters:
    - client_id: Filter addresses by client ID
    """
    client_id = request.GET.get('client_id')
    
    if client_id:
        addresses = Address.objects.filter(client_info_id=client_id).order_by('-created_at')
    else:
        addresses = Address.objects.all().order_by('-created_at')
    
    serializer = AddressSerializer(addresses, many=True)
    
    return Response({
        'success': True,
        'count': addresses.count(),
        'data': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
def update_address(request, address_id):
    """
    API endpoint to update an existing address
    """
    try:
        address = Address.objects.get(id=address_id)
    except Address.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Adresse non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)
    
    # Use partial=True for PATCH requests
    partial = request.method == 'PATCH'
    serializer = AddressSerializer(address, data=request.data, partial=partial)
    
    if serializer.is_valid():
        address = serializer.save()
        
        # Check and update "Mon déménagement" (adresse_depart) in ClientInformation if different
        try:
            client_info = address.client_info
            
            # Compare adresse_depart from Address API with ClientInformation "Mon déménagement"
            if client_info.adresse_depart != address.adresse_depart:
                print(f"Updating ClientInformation.adresse_depart from '{client_info.adresse_depart}' to '{address.adresse_depart}'")
                client_info.adresse_depart = address.adresse_depart
                client_info.save()
                print(f"ClientInformation {client_info.id} 'Mon déménagement' updated successfully")
            else:
                print(f"ClientInformation {client_info.id} 'Mon déménagement' is already in sync with Address API")
                
        except Exception as e:
            print(f"Error checking/updating ClientInformation adresse_depart: {e}")
        
        return Response({
            'success': True,
            'message': 'Adresse mise à jour avec succès',
            'data': AddressSerializer(address).data
        }, status=status.HTTP_200_OK)
    
    else:
        print("Address update errors:", serializer.errors)
        return Response({
            'success': False,
            'message': 'Données invalides',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
def delete_address(request, address_id):
    """
    API endpoint to delete an address
    """
    try:
        address = Address.objects.get(id=address_id)
        client_info_id = address.client_info.id
        address.delete()
        
        return Response({
            'success': True,
            'message': 'Adresse supprimée avec succès',
            'client_info_id': client_info_id
        }, status=status.HTTP_200_OK)
        
    except Address.DoesNotExist:
        return Response({
            'success': False,
            'message': 'Adresse non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)