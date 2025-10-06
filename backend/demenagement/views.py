from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ClientInformation, ManualSelection
from .serializers import ClientInformationSerializer, ManualSelectionSerializer

# Import volume calculation functions from ai_detector
from ai_detector.views import calculate_total_volume, calculate_quote, OBJECT_VOLUMES, ROOM_OBJECTS


@api_view(['POST'])
def submit_client_information(request):
    """
    API endpoint to submit client information for quote request
    
    Expected JSON data:
    {
        "nom": "Dupont",
        "prenom": "Jean",
        "email": "jean.dupont@email.com",
        "phone": "0123456789",
        "adresse_depart": "123 Rue de la Paix, 75001 Paris",
        "date_demenagement": "2024-12-25"
    }
    """
    serializer = ClientInformationSerializer(data=request.data)
    
    if serializer.is_valid():
        client_info = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Informations client enregistrées avec succès',
            'data': {
                'id': client_info.id,
                'nom': client_info.nom,
                'prenom': client_info.prenom,
                'email': client_info.email,
                'phone': client_info.phone,
                'adresse_depart': client_info.adresse_depart,
                'date_demenagement': client_info.date_demenagement.isoformat(),
                'created_at': client_info.created_at.isoformat()
            }
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