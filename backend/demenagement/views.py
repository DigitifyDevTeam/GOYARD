from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import ClientInformation, ManualSelection, Address
from .serializers import ClientInformationSerializer, ManualSelectionSerializer, AddressSerializer

# Import volume calculation and pricing from ai_detector
from ai_detector.views import calculate_total_volume, calculate_quote, OBJECT_VOLUMES, ROOM_OBJECTS
from ai_detector.pricing import (
    get_price_breakdown,
    get_etage_price,
    get_ascenseur_extra,
    get_assurance_valeur_bien_price,
    get_demontage_remontage_price,
    get_emballage_fragile_price,
    get_emballage_cartons_price,
    get_portage_price,
    get_escale_price,
    DEMI_ETAGE_PRICE_EUR,
)


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
        
        # Calculate volume only. Final price is computed later when frontend sends
        # distance_km (from Google distance between the two addresses) to the final-quote endpoint.
        volume_calc = calculate_total_volume(all_objects)
        quote_calc = calculate_quote(volume_calc)  # fallback estimate without distance
        
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


def _google_distance_matrix_km(origin: str, destination: str) -> float | None:
    """
    Call Google Distance Matrix API server-side and return driving distance in km.
    Returns None on error.
    """
    import json
    import urllib.request
    import urllib.parse
    from django.conf import settings as django_settings

    api_key = getattr(django_settings, 'GOOGLE_MAPS_API_KEY', None) or ''
    if not api_key:
        return None
    params = {
        'origins': origin,
        'destinations': destination,
        'key': api_key,
        'mode': 'driving',
        'units': 'metric',
        'language': 'fr',
    }
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' + urllib.parse.urlencode(params)
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
        rows = data.get('rows', [])
        if rows:
            elements = rows[0].get('elements', [])
            if elements and elements[0].get('status') == 'OK':
                distance_m = elements[0]['distance']['value']  # meters
                return round(distance_m / 1000, 1)  # → km
    except Exception as e:
        print(f"[get_final_quote] Google Distance Matrix error: {e}")
    return None


@api_view(['POST'])
def get_final_quote(request):
    """
    Final quote with full pricing logic:
      base (volume × distance matrix) + étage + ascenseur + options + portage.

    The backend computes the driving distance automatically via Google Distance Matrix
    using the saved addresses (from address_id).  If address_id is not provided the
    caller may pass distance_km as a fallback.

    Body (JSON):
      - address_id (required – used to load addresses, étage, ascenseur, stopover)
      - volume_m3 OR selection_id OR calculation_id (for volume)
      - valeur_bien_eur (optional), demontage_remontage (bool), emballage_fragile (bool)
      - portage_depart_m, portage_arrival_m, portage_escale_m (optional, in meters)
      - distance_km (optional fallback if address_id is missing)
    """
    try:
        data = request.data or {}
        print(f"[get_final_quote] Received data: {data}")
        
        volume_m3 = data.get('volume_m3')
        selection_id = data.get('selection_id')
        calculation_id = data.get('calculation_id')
        address_id = data.get('address_id')

        # ── 1. Resolve Address ──────────────────────────────────────────────
        addr = None
        if address_id:
            try:
                addr = Address.objects.get(id=address_id)
            except Address.DoesNotExist:
                return Response({
                    'success': False,
                    'error': f'Address with id={address_id} not found'
                }, status=status.HTTP_404_NOT_FOUND)

        # ── 2. Resolve distance (km) via Google Distance Matrix ─────────────
        distance_km = None
        origin_address = None
        destination_address = None
        if addr:
            origin_address = addr.adresse_depart
            destination_address = addr.adresse_arrivee
            if origin_address and destination_address:
                distance_km = _google_distance_matrix_km(origin_address, destination_address)
        # Fallback: caller-provided distance_km
        if distance_km is None and data.get('distance_km') is not None:
            try:
                distance_km = float(data['distance_km'])
            except (TypeError, ValueError):
                pass
        if distance_km is None:
            print(f"[get_final_quote] ERROR: Could not compute distance. address_id={address_id}, addr={addr}")
            if addr:
                print(f"[get_final_quote] Address data: origin={origin_address}, dest={destination_address}")
            return Response({
                'success': False,
                'error': ('Could not compute distance. '
                          'Provide address_id with valid departure/arrival addresses, '
                          'or pass distance_km manually.')
            }, status=status.HTTP_400_BAD_REQUEST)
        if distance_km < 0:
            distance_km = 0.0

        # ── 3. Resolve volume (m³) ──────────────────────────────────────────
        if volume_m3 is not None:
            try:
                volume_m3 = float(volume_m3)
                if volume_m3 <= 0:
                    raise ValueError()
            except (TypeError, ValueError):
                return Response({
                    'success': False,
                    'error': 'volume_m3 must be a positive number'
                }, status=status.HTTP_400_BAD_REQUEST)
        elif selection_id is not None or calculation_id is not None:
            id_to_use = selection_id if selection_id is not None else calculation_id
            try:
                selection = ManualSelection.objects.get(id=id_to_use)
                volume_m3 = float(selection.total_volume)
                if volume_m3 <= 0:
                    return Response({
                        'success': False,
                        'error': 'Selection has no volume; total_volume must be > 0'
                    }, status=status.HTTP_400_BAD_REQUEST)
            except ManualSelection.DoesNotExist:
                return Response({
                    'success': False,
                    'error': 'Selection/calculation not found'
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({
                'success': False,
                'error': 'Provide either volume_m3 or selection_id (or calculation_id)'
            }, status=status.HTTP_400_BAD_REQUEST)

        # ── 4. Base price from volume × distance matrix ─────────────────────
        breakdown = get_price_breakdown(volume_m3, distance_km)
        base_price = breakdown['price_eur']

        # ── 5. Étage & ascenseur & demi-étage ─────────────────────────────────
        etage_depart = etage_arrivee = ascenseur_depart = ascenseur_arrivee = None
        has_stopover = False
        escale_etage = escale_ascenseur = None
        demi_etage_depart = demi_etage_arrivee = False
        if addr:
            etage_depart = addr.etage_depart
            etage_arrivee = addr.etage_arrivee
            ascenseur_depart = addr.ascenseur_depart
            ascenseur_arrivee = addr.ascenseur_arrivee
            has_stopover = bool(addr.has_stopover)
            escale_etage = addr.escale_etage or None
            escale_ascenseur = addr.escale_ascenseur or None
            demi_etage_depart = bool(getattr(addr, 'demi_etage_depart', False))
            demi_etage_arrivee = bool(getattr(addr, 'demi_etage_arrivee', False))
        # Body overrides (if address_id was not provided or user toggled on quote page)
        if etage_depart is None:
            etage_depart = data.get('etage_depart')
        if etage_arrivee is None:
            etage_arrivee = data.get('etage_arrivee')
        if ascenseur_depart is None:
            ascenseur_depart = data.get('ascenseur_depart')
        if ascenseur_arrivee is None:
            ascenseur_arrivee = data.get('ascenseur_arrivee')
        if data.get('demi_etage_depart') is not None:
            demi_etage_depart = bool(data.get('demi_etage_depart'))
        if data.get('demi_etage_arrivee') is not None:
            demi_etage_arrivee = bool(data.get('demi_etage_arrivee'))
        if not has_stopover and data.get('has_stopover') is not None:
            has_stopover = bool(data.get('has_stopover'))
        if escale_etage is None:
            escale_etage = data.get('escale_etage')
        if escale_ascenseur is None:
            escale_ascenseur = data.get('escale_ascenseur')

        # ── 5. Étage et Ascenseur: exclusive pricing per location ────────
        # Use floor pricing if monte-meuble selected OR no elevator, otherwise use elevator pricing
        
        def calculate_location_pricing(volume_m3: float, etage: str, ascenseur: str, monte_meuble: bool) -> tuple[float, float]:
            """
            Calculate pricing for one location.
            Returns: (etage_price, ascenseur_price) - only one will be > 0
            """
            if monte_meuble:
                # Use floor pricing only
                etage_price = get_etage_price(volume_m3, etage or 'RDC')
                ascenseur_price = 0.0
            elif ascenseur and ascenseur != 'Non':
                # Use elevator pricing only (pass floor value for 2-3 personnes calculation)
                etage_price = 0.0
                ascenseur_price = get_ascenseur_extra(volume_m3, ascenseur, etage or 'RDC')
            else:
                # Use floor pricing (default case)
                etage_price = get_etage_price(volume_m3, etage or 'RDC')
                ascenseur_price = 0.0
            
            return etage_price, ascenseur_price
        
        # Get monte-meuble options from data
        monte_meuble_depart = bool(data.get('options_depart', {}).get('monte_meuble', False))
        monte_meuble_arrivee = bool(data.get('options_arrivee', {}).get('monte_meuble', False))
        monte_meuble_escale = bool(data.get('escale_options', {}).get('monte_meuble', False)) if has_stopover else False
        
        # Calculate per location with exclusive pricing
        etage_depart_price, ascenseur_depart_extra = calculate_location_pricing(
            volume_m3, etage_depart, ascenseur_depart, monte_meuble_depart
        )
        etage_arrivee_price, ascenseur_arrivee_extra = calculate_location_pricing(
            volume_m3, etage_arrivee, ascenseur_arrivee, monte_meuble_arrivee
        )
        
        etage_escale_price = 0.0
        ascenseur_escale_extra = 0.0
        if has_stopover:
            etage_escale_price, ascenseur_escale_extra = calculate_location_pricing(
                volume_m3, escale_etage, escale_ascenseur, monte_meuble_escale
            )

        etage_total = etage_depart_price + etage_arrivee_price + etage_escale_price
        ascenseur_total = ascenseur_depart_extra + ascenseur_arrivee_extra + ascenseur_escale_extra

        # ── 5b. Demi-étage: 150€ per location when "ascenseur desservant uniquement un demi-étage" is on.
        # Applies to departure and arrival only; NOT to stepover (escale).
        demi_etage_total = 0.0
        if demi_etage_depart:
            demi_etage_total += DEMI_ETAGE_PRICE_EUR
        if demi_etage_arrivee:
            demi_etage_total += DEMI_ETAGE_PRICE_EUR

        # ── 6. Options: assurance, démontage/remontage, emballage fragile, emballage cartons ───
        valeur_bien_eur = None
        try:
            v = data.get('valeur_bien_eur')
            if v is not None:
                valeur_bien_eur = float(v)
        except (TypeError, ValueError):
            pass
        assurance_bien_price = get_assurance_valeur_bien_price(valeur_bien_eur or 0)
        demontage_remontage = bool(data.get('demontage_remontage'))
        emballage_fragile = bool(data.get('emballage_fragile'))
        emballage_cartons = bool(data.get('emballage_cartons'))
        demontage_remontage_price = get_demontage_remontage_price(volume_m3, distance_km, demontage_remontage)
        emballage_fragile_price = get_emballage_fragile_price(volume_m3, emballage_fragile)
        emballage_cartons_price = get_emballage_cartons_price(volume_m3, emballage_cartons)

        # ── 7. Portage: max(départ, arrivée, escale) in meters → one price ─
        portage_depart_m = portage_arrival_m = portage_escale_m = 0.0
        try:
            v = data.get('portage_depart_m')
            if v is not None: portage_depart_m = float(v)
            v = data.get('portage_arrival_m')
            if v is not None: portage_arrival_m = float(v)
            v = data.get('portage_escale_m')
            if v is not None and has_stopover: portage_escale_m = float(v)
        except (TypeError, ValueError):
            pass
        portage_distance_used_m = max(portage_depart_m, portage_arrival_m, portage_escale_m)
        portage_total = get_portage_price(volume_m3, portage_distance_used_m)

        # ── 8. Escale (stopover) pricing ────────────────────────────────────
        # For now, we only support 1 stopover in the data model, but prepare for multiple
        stopover_count = data.get('stopover_count', 1 if has_stopover else 0)
        try:
            stopover_count = int(stopover_count)
        except (TypeError, ValueError):
            stopover_count = 1 if has_stopover else 0
        escale_total = get_escale_price(stopover_count)

        # ── 9. Totals ──────────────────────────────────────────────────────
        options_total = (assurance_bien_price + demontage_remontage_price
                         + emballage_fragile_price + emballage_cartons_price + portage_total + escale_total)
        final_price = base_price + etage_total + ascenseur_total + demi_etage_total + options_total

        # ── 9. Breakdown (human-readable) ──────────────────────────────────
        breakdown_extra = {
            'transport': f"Volume {volume_m3}m³, distance {distance_km} km ({origin_address or '?'} → {destination_address or '?'}) → {base_price}€",
            'etage_depart': f"Étage départ {etage_depart or 'RDC'} → {etage_depart_price}€",
            'etage_arrivee': f"Étage arrivée {etage_arrivee or 'RDC'} → {etage_arrivee_price}€",
            'ascenseur_depart': f"Ascenseur départ ({ascenseur_depart or 'Non'}) → {ascenseur_depart_extra}€",
            'ascenseur_arrivee': f"Ascenseur arrivée ({ascenseur_arrivee or 'Non'}) → {ascenseur_arrivee_extra}€",
        }
        if has_stopover:
            breakdown_extra['etage_escale'] = f"Étage escale {escale_etage or 'RDC'} → {etage_escale_price}€"
            breakdown_extra['ascenseur_escale'] = f"Ascenseur escale ({escale_ascenseur or 'Non'}) → {ascenseur_escale_extra}€"
        if demi_etage_total > 0:
            parts = []
            if demi_etage_depart:
                parts.append("départ")
            if demi_etage_arrivee:
                parts.append("arrivée")
            breakdown_extra['demi_etage'] = f"Demi-étage ({', '.join(parts)}, {DEMI_ETAGE_PRICE_EUR}€/lieu) → {demi_etage_total}€"
        else:
            breakdown_extra['demi_etage'] = "Demi-étage (non) → 0€"
        if portage_total > 0:
            parts = [f"départ {portage_depart_m:.0f}m", f"arrivée {portage_arrival_m:.0f}m"]
            if has_stopover and portage_escale_m:
                parts.append(f"escale {portage_escale_m:.0f}m")
            breakdown_extra['portage'] = f"Portage max({', '.join(parts)}) → {portage_distance_used_m:.0f}m → {portage_total}€"
        else:
            breakdown_extra['portage'] = "Portage (non) → 0€"
        if has_stopover and stopover_count > 0:
            breakdown_extra['escale'] = f"Escale ({stopover_count} × 150€) → {escale_total}€"
        else:
            breakdown_extra['escale'] = "Escale (non) → 0€"
        if assurance_bien_price > 0:
            breakdown_extra['assurance_bien'] = f"Assurance valeur biens ({valeur_bien_eur}€) → {assurance_bien_price}€"
        if demontage_remontage_price > 0:
            rate = 8 if distance_km <= 200 else 16
            breakdown_extra['demontage_remontage'] = f"Démontage/remontage ({volume_m3}m³ × {rate}€/m³, distance {distance_km} km) → {demontage_remontage_price}€"
        if emballage_fragile_price > 0:
            breakdown_extra['emballage_fragile'] = f"Emballage fragile ({volume_m3}m³ × 12,5€/m³) → {emballage_fragile_price}€"
        if emballage_cartons_price > 0:
            breakdown_extra['emballage_cartons'] = f"Emballage cartons inventaire ({volume_m3}m³ × 30€/m³) → {emballage_cartons_price}€"
        breakdown_extra['total'] = (
            f"Total: {base_price} (transport) + {etage_total} (étage) + {ascenseur_total} (ascenseur) "
            f"+ {demi_etage_total} (demi-étage) + {options_total} (options) = {final_price}€"
        )

        print(f"[get_final_quote] {origin_address} → {destination_address} = {distance_km} km | vol={volume_m3}m³ | final={final_price}€")

        return Response({
            'success': True,
            'final_price': round(final_price, 2),
            'currency': 'EUR',
            'volume_m3': volume_m3,
            'distance_km': distance_km,
            'adresse_depart': origin_address or '',
            'adresse_arrivee': destination_address or '',
            'base_price_transport': round(base_price, 2),
            'etage_total': round(etage_total, 2),
            'ascenseur_total': round(ascenseur_total, 2),
            'demi_etage_total': round(demi_etage_total, 2),
            'portage_total': round(portage_total, 2),
            'escale_total': round(escale_total, 2),
            'stopover_count': stopover_count,
            'options_total': round(options_total, 2),
            'assurance_bien_price': round(assurance_bien_price, 2),
            'demontage_remontage_price': round(demontage_remontage_price, 2),
            'emballage_fragile_price': round(emballage_fragile_price, 2),
            'emballage_cartons_price': round(emballage_cartons_price, 2),
            'breakdown': breakdown_extra,
            'volume_bucket_used_m3': breakdown['volume_m3_used'],
            'distance_band_km': breakdown['distance_band_km'],
            
            # Detailed breakdown by location
            'departure_pricing': {
                'etage': round(etage_depart_price, 2),
                'ascenseur': round(ascenseur_depart_extra, 2),
                'floor': etage_depart or 'RDC',
                'elevator': ascenseur_depart or 'Non',
                'monte_meuble': monte_meuble_depart,
                'total': round(etage_depart_price + ascenseur_depart_extra, 2)
            },
            'arrival_pricing': {
                'etage': round(etage_arrivee_price, 2),
                'ascenseur': round(ascenseur_arrivee_extra, 2),
                'floor': etage_arrivee or 'RDC',
                'elevator': ascenseur_arrivee or 'Non',
                'monte_meuble': monte_meuble_arrivee,
                'total': round(etage_arrivee_price + ascenseur_arrivee_extra, 2)
            },
            'escale_pricing': {
                'etage': round(etage_escale_price, 2),
                'ascenseur': round(ascenseur_escale_extra, 2),
                'floor': escale_etage or 'RDC',
                'elevator': escale_ascenseur or 'Non',
                'monte_meuble': monte_meuble_escale,
                'total': round(etage_escale_price + ascenseur_escale_extra, 2),
                'has_stopover': has_stopover
            }
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
        
        # Store fallback price only. Final price is computed when frontend sends
        # distance_km (from Google) to the final-quote endpoint.
        PRICE_PER_M3 = 15
        base_price = total_volume * PRICE_PER_M3
        final_price = base_price
        
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
        
        # Fallback quote only. Final price: frontend gets distance from Google (two addresses)
        # then calls POST /api/demenagement/quote/final/ with volume_m3 + distance_km.
        PRICE_PER_M3 = 15
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
                'demi_etage_depart': getattr(address, 'demi_etage_depart', False),
                'options_depart': address.options_depart,
                'has_stopover': address.has_stopover,
                'escale_adresse': address.escale_adresse,
                'escale_etage': address.escale_etage,
                'escale_ascenseur': address.escale_ascenseur,
                'demi_etage_escale': getattr(address, 'demi_etage_escale', False),
                'escale_options': address.escale_options,
                'adresse_arrivee': address.adresse_arrivee,
                'etage_arrivee': address.etage_arrivee,
                'ascenseur_arrivee': address.ascenseur_arrivee,
                'demi_etage_arrivee': getattr(address, 'demi_etage_arrivee', False),
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