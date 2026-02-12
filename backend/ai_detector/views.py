from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image
import os
import json
import tempfile
from collections import Counter
import glob
from datetime import datetime

# YOLO imports
from ultralytics import YOLO

from .models import Room, Photo, DetectedObject, Quote
from .pricing import get_price_from_matrix, get_price_breakdown
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


# Room-based object organization
ROOM_OBJECTS = {
    "entree": [
        "Banc", "Cadre", "Carton", "Console", "Etagére muale", 
        "Meuble a chaussure", "Miroir", "Porte manteau",
        # Nouveaux objets ajoutés
        "Coffre pour chaussures", "Tapis"
    ],
    "salle-de-bain": [
        "Boîte ou panier", "Carton", "Coffre a linge", "Colonne salle de bain", 
        "Lave linge", "Meuble salle de bain", "Miroir", "Tapis petit",
        # Nouveaux objets ajoutés
        "Baignoire enfant"
    ],
    "salon": [
        "Canapé 3 places (-80KG)", "Canapé d'angle (-80KG)", "Carton", "hifi", 
        "Lampadaire", "Meuble TV bas", "Table basse", "Télevision",
        # Nouveaux objets ajoutés
        "Fauteuil", "Pouf", "Tapis", "Cadre", "Miroir", "Banc", "Etendoir"
    ],
    "cuisine": [
        "Boîte ou panier", "Carton", "Cuisinière (-80KG)", "Four", 
        "Frigo-congélateur", "Lave vaisselle", "Micro ondes", "Etagère",
        # Nouveaux objets ajoutés
        "Meuble bas de cuisine", "Meuble haut de cuisine", "Tabouret", "Chaise", "Four piano 6 têtes"
    ],
    "salle-a-manger": [
        "Buffet haut", "Cadre", "Chaise", "Moyenne table", "Plante en pot", 
        "Tapis moyen", "Vaisselier (-80KG)",
        # Nouveaux objets ajoutés
        "Commode", "Buffet complet haut + bas", "Bibliothèque"
    ],
    "chambre": [
        "Armoire 2p (-80KG)", "Bureau", "Carton", "Chaise de bureau", 
        "Commode", "lit double", "lit simple", "Tapis moyen",
        # Nouveaux objets ajoutés
        "Table de nuit", "Banc", "Tête de lit", "TV", "Table à langer bébé", "Coiffeuse"
    ],
    "cave": [
        "Armoire ancienne (-80KG)", "Barbecue", "Carton", "Coffre de rangement", 
        "Echelle", "Escabeau", "valises", "Etagére",
        # Nouveaux objets ajoutés
        "Climatisation"
    ],
    "jardin": [
        "Carton", "Chaise", "Coffre de rangement", "Etendoir", 
        "Parasol", "Table de jardin", "Transat", "Vélo",
        # Nouveaux objets ajoutés
        "Poussette", "Scooter (moto)"
    ],
    "garage": [
        "Aspirateur", "Carton", "Coffre de rangement", "Lave linge", 
        "séche linge", "Vélo", "Table de ping-pong (-80KG)", "Etagère"
    ],
    "autre": [
        "Carton", "Chiffronier", "Guitare", "Lampe de bureau", 
        "Paravent", "Vélo d'intérieur (-80KG)", "Tapis de course (-80KG)", 
        "Banc de musculation (-80KG)",
        # Nouveaux objets ajoutés
        "Ecran ordinateur", "Imprimante", "Imprimante pro", "Cave à vin"
    ]
}

# Volume mapping for each object class (in cubic meters) - from volum.txt
OBJECT_VOLUMES = {
    # Entrée
    "Banc": 0.5,
    "Cadre": 0.2,
    "Carton": 0.10,
    "Console": 1.0,
    "Etagére muale": 1.0,
    "Meuble a chaussure": 0.5,
    "Miroir": 0.2,
    "Porte manteau": 0.5,
    "Coffre pour chaussures": 0.5,
    "Tapis": 0.2,
    
    # Salle de bain
    "Boîte ou panier": 0.3,
    "Coffre a linge": 0.25,
    "Colonne salle de bain": 1.0,
    "Lave linge": 1.0,
    "Meuble salle de bain": 1.5,
    "Tapis petit": 0.2,
    "Baignoire enfant": 0.5,
    
    # Salon
    "Canapé 3 places (-80KG)": 3.0,
    "Canapé d'angle (-80KG)": 4.0,
    "hifi": 0.2,
    "Lampadaire": 0.3,
    "Meuble TV bas": 1.5,
    "Table basse": 1.0,
    "Télevision": 0.25,
    "Fauteuil": 1.0,
    "Pouf": 0.5,
    "Tapis moyen": 1.4,
    "Etendoir": 0.2,
    
    # Cuisine
    "Cuisinière (-80KG)": 1.0,
    "Four": 1.0,
    "Frigo-congélateur": 2.0,
    "Lave vaisselle": 1.0,
    "Micro ondes": 0.25,
    "Etagère": 0.75,
    "Meuble bas de cuisine": 1.0,
    "Meuble haut de cuisine": 1.0,
    "Tabouret": 0.3,
    "Chaise": 0.4,
    "Four piano 6 têtes": 2.0,
    
    # Salle à manger
    "Buffet haut": 2.0,
    "Moyenne table": 2.0,
    "Plante en pot": 0.7,
    "Vaisselier (-80KG)": 3.0,
    "Commode": 2.0,
    "Buffet complet haut + bas": 5.5,
    "Bibliothèque": 2.5,
    
    # Chambre
    "Armoire 2p (-80KG)": 3.0,
    "Bureau": 1.0,
    "Chaise de bureau": 0.8,
    "lit double": 2.5,
    "lit simple": 2.0,
    "Table de nuit": 0.3,
    "Tête de lit": 0.3,
    "TV": 0.25,
    "Table à langer bébé": 1.5,
    "Coiffeuse": 1.2,
    
    # Cave
    "Armoire ancienne (-80KG)": 3.5,
    "Barbecue": 0.75,
    "Coffre de rangement": 0.5,
    "Echelle": 0.5,
    "Escabeau": 0.7,
    "valises": 0.2,
    "Climatisation": 1.0,
    
    # Jardin
    "Parasol": 1.0,
    "Table de jardin": 2.6,
    "Transat": 1.0,
    "Vélo": 1.5,
    "Poussette": 0.8,
    "Scooter (moto)": 5.0,
    
    # Garage
    "Aspirateur": 0.2,
    "séche linge": 1.0,
    "Table de ping-pong (-80KG)": 4.0,
    
    # Autre
    "Chiffronier": 0.75,
    "Guitare": 0.1,
    "Lampe de bureau": 0.2,
    "Paravent": 0.07,
    "Vélo d'intérieur (-80KG)": 0.7,
    "Tapis de course (-80KG)": 2.0,
    "Banc de musculation (-80KG)": 1.0,
    "Ecran ordinateur": 0.2,
    "Imprimante": 0.1,
    "Imprimante pro": 0.2,
    "Cave à vin": 1.0,
    
    # Objets particuliers ou de + de 80kgs
    "Piano droit (max 200kgs)": 3.5,
    "Piano à queue (max 300kgs)": 5.0,
    "Armoire forte (max 200kgs)": 4.0,
    "Coffre fort (max 200kgs)": 1.0,
    "Réfrigérateur américain (max 150kgs)": 3.0,
    "Armoire ancienne (max 150kgs)": 3.0,
    "Lave linge (max 150kgs)": 1.0,
    "Banc de musculation (max 150kgs)": 2.0,
}

def calculate_total_volume(object_counts):
    """
    Calculate total volume based on detected objects and their counts
    
    Args:
        object_counts: Dictionary with object names as keys and counts as values
        Example: {"Chaise": 3, "Canapé 3 places (-80KG)": 2, "lit double": 1}
    
    Returns:
        Dictionary with volume calculation details
    """
    total_volume = 0.0
    volume_breakdown = {}
    calculation_details = []
    
    # Handle empty object counts
    if not object_counts:
        return {
            'total_volume': 0.0,
            'volume_breakdown': {},
            'calculation_details': ["No objects detected - using default room estimation"],
            'formula': "No objects detected"
        }
    
    for object_name, count in object_counts.items():
        # Get volume per unit for this object
        volume_per_unit = OBJECT_VOLUMES.get(object_name, 0.0)
        
        if volume_per_unit > 0:
            # Calculate total volume for this object type
            object_total_volume = count * volume_per_unit
            total_volume += object_total_volume
            
            # Store breakdown
            volume_breakdown[object_name] = {
                'count': count,
                'volume_per_unit': volume_per_unit,
                'total_volume': object_total_volume
            }
            
            # Add to calculation details for display
            calculation_details.append(
                f"{count} × {object_name} = {count} × {volume_per_unit}m³ = {object_total_volume}m³"
            )
        else:
            # Object not in our volume mapping
            volume_breakdown[object_name] = {
                'count': count,
                'volume_per_unit': 0.0,
                'total_volume': 0.0,
                'note': 'Volume not defined for this object'
            }
            calculation_details.append(
                f"{count} × {object_name} = Volume not defined (0m³)"
            )
    
    return {
        'total_volume': round(total_volume, 2),
        'volume_breakdown': volume_breakdown,
        'calculation_details': calculation_details,
        'formula': f"Total = {' + '.join([str(v['total_volume']) + 'm³' for v in volume_breakdown.values() if v['total_volume'] > 0])} = {total_volume}m³"
    }

def calculate_quote(volume_calculation, distance_km=None):
    """
    Calculate quote from volume and optional distance.
    When distance_km is provided, uses the official volume × distance price matrix.
    Otherwise falls back to volume * 50€ per m³.
    
    Args:
        volume_calculation: Result from calculate_total_volume()
        distance_km: Optional distance in km (uses price matrix when provided and >= 0)
    
    Returns:
        Dictionary with quote calculation details
    """
    total_volume = volume_calculation['total_volume']
    use_matrix = distance_km is not None and distance_km >= 0

    if use_matrix:
        breakdown = get_price_breakdown(total_volume, distance_km)
        final_price = breakdown['price_eur']
        calculation_steps = [
            f"Total Volume: {total_volume}m³ (applied bucket: {breakdown['volume_m3_used']}m³)",
            f"Distance: {distance_km} km (band: {breakdown['distance_band_km']} km)",
            f"Price from grid: {final_price}€"
        ]
        return {
            'total_volume_m3': total_volume,
            'distance_km': distance_km,
            'price_from_matrix': True,
            'volume_bucket_used_m3': breakdown['volume_m3_used'],
            'distance_band_km': breakdown['distance_band_km'],
            'final_price': round(final_price, 2),
            'currency': 'EUR',
            'calculation_steps': calculation_steps,
            'breakdown': {
                'volume_cost': f"{total_volume}m³ → {breakdown['volume_m3_used']}m³, {breakdown['distance_band_km']} km → {final_price}€",
                'total': f"Total: {final_price}€"
            }
        }
    else:
        PRICE_PER_M3 = 50.0
        final_price = total_volume * PRICE_PER_M3
        calculation_steps = [
            f"Total Volume Detected: {total_volume}m³",
            f"Price per m³: {PRICE_PER_M3}€ (no distance provided)",
            f"Final Calculation: {total_volume}m³ × {PRICE_PER_M3}€ = {final_price}€"
        ]
        return {
            'total_volume_m3': total_volume,
            'price_per_m3': PRICE_PER_M3,
            'final_price': round(final_price, 2),
            'currency': 'EUR',
            'calculation_steps': calculation_steps,
            'breakdown': {
                'volume_cost': f"{total_volume}m³ × {PRICE_PER_M3}€ = {final_price}€",
                'total': f"Total: {final_price}€"
            }
        }

def upload_photos(request):
    """Handle photo upload and room creation"""
    if request.method == 'POST':
        try:
            room_type = request.POST.get('room_type')
            room_name = request.POST.get('room_name', f'Room {room_type}')
            photos = request.FILES.getlist('photos')
            
            if not photos:
                return JsonResponse({
                    'success': False,
                    'error': 'No photos uploaded'
                })
            
            # Create room (check if it's a custom room)
            if room_type == 'custom':
                # For custom rooms, use the provided name
                room = Room.objects.create(
                    user=None,
                    room_type='other',  # Map custom to 'other' type
                    name=room_name
                )
            else:
                # For predefined room types
                room = Room.objects.create(
                    user=None,
                    room_type=room_type,
                    name=room_name
                )
            
            uploaded_photos = []
            
            # Process each photo
            duplicate_photos = []
            for photo_file in photos:
                # Check for duplicates
                from .image_utils import check_duplicate_image, calculate_image_hash
                
                duplicate_check = check_duplicate_image(None, photo_file, room.id)
                
                if duplicate_check['is_duplicate']:
                    duplicate_photos.append({
                        'filename': photo_file.name,
                        'message': duplicate_check['message'],
                        'existing_photo': {
                            'id': duplicate_check['existing_photo'].id,
                            'room_name': duplicate_check['existing_photo'].room.name,
                            'uploaded_at': duplicate_check['existing_photo'].uploaded_at.strftime("%d/%m/%Y à %H:%M")
                        }
                    })
                    continue  # Skip duplicate photo
                
                # Get image dimensions
                img = Image.open(photo_file)
                width, height = img.size
                
                # Calculate image hash for future duplicate detection
                image_hash = calculate_image_hash(photo_file)
                
                # Create photo record
                photo = Photo.objects.create(
                    room=room,
                    image=photo_file,
                    filename=photo_file.name,
                    file_size=photo_file.size,
                    width=width,
                    height=height,
                    image_hash=image_hash,
                    status='uploaded'
                )
                
                uploaded_photos.append({
                    'id': photo.id,
                    'filename': photo.filename,
                    'size': photo.file_size
                })
            
            response_data = {
                'success': True,
                'room_id': room.id,
                'room_name': room.name,
                'photos': uploaded_photos,
                'uploaded_count': len(uploaded_photos),
                'duplicate_count': len(duplicate_photos),
                'message': f'Successfully uploaded {len(uploaded_photos)} photos'
            }
            
            if duplicate_photos:
                response_data['duplicates'] = duplicate_photos
                response_data['message'] += f', {len(duplicate_photos)} duplicates skipped'
            
            return JsonResponse(response_data)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    # GET request - show upload form
    room_types = Room.ROOM_TYPES
    return render(request, 'ai_model/upload_photos.html', {
        'room_types': room_types
    })

def analyze_photos(request):
    """Analyze photos with AI"""
    if request.method == 'POST':
        try:
            photo_ids = request.POST.getlist('photo_ids')
            
            if not photo_ids:
                return JsonResponse({
                    'success': False,
                    'error': 'No photos selected for analysis'
                })
            
            # Use YOLO model for analysis
            model_path = os.path.join(os.path.dirname(__file__), 'ai_model', 'yolov8x-oiv7.pt')
            if not os.path.exists(model_path):
                return JsonResponse({
                    'success': False,
                    'error': 'YOLO model file not found'
                })
            
            model = YOLO(model_path)
            analysis_results = []
            
            for photo_id in photo_ids:
                try:
                    photo = Photo.objects.get(id=photo_id)
                    
                    # Update status to analyzing
                    photo.status = 'analyzing'
                    photo.save()
                    
                    # Run YOLO prediction
                    results = model.predict(photo.image.path, conf=0.25, verbose=False)
                    
                    # Process results
                    detected_objects = []
                    object_counts = Counter()
                    
                    for result in results:
                        if result.boxes is not None:
                            for box in result.boxes:
                                class_id = int(box.cls[0])
                                class_name = model.names[class_id]
                                confidence = float(box.conf[0])
                                
                                if confidence > 0.25:
                                    obj = DetectedObject.objects.create(
                                        photo=photo,
                                        object_class=class_name,
                                        confidence=confidence,
                                        bbox_x=float(box.xyxy[0][0]),
                                        bbox_y=float(box.xyxy[0][1]),
                                        bbox_width=float(box.xyxy[0][2] - box.xyxy[0][0]),
                                        bbox_height=float(box.xyxy[0][3] - box.xyxy[0][1]),
                                        estimated_volume=1.0,  # Placeholder
                                        estimated_weight=1.0   # Placeholder
                                    )
                                    detected_objects.append({
                                        'class': obj.object_class,
                                        'confidence': obj.confidence,
                                        'volume': obj.estimated_volume,
                                        'weight': obj.estimated_weight
                                    })
                                    object_counts[class_name] += 1
                    
                    # Update photo status
                    photo.status = 'analyzed'
                    photo.save()
                    
                    analysis_results.append({
                        'photo_id': photo.id,
                        'filename': photo.filename,
                        'detected_objects': detected_objects,
                        'object_counts': dict(object_counts),
                        'total_objects': len(detected_objects)
                    })
                    
                except Photo.DoesNotExist:
                    continue
                except Exception as e:
                    # Update photo status to error
                    photo.status = 'error'
                    photo.error_message = str(e)
                    photo.save()
                    continue
            
            return JsonResponse({
                'success': True,
                'analysis_results': analysis_results,
                'message': f'Analyzed {len(analysis_results)} photos'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def view_processed_images(request):
    """View processed images with bounding boxes"""
    if request.method == 'GET':
        try:
            images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            
            if not os.path.exists(images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all processed images
            processed_images = []
            
            # Look for YOLO output folders
            for folder in os.listdir(images_dir):
                folder_path = os.path.join(images_dir, folder)
                if os.path.isdir(folder_path) and folder.startswith('detect_'):
                    # Find images in this folder
                    for file in os.listdir(folder_path):
                        if file.endswith(('.jpg', '.jpeg', '.png')):
                            processed_images.append({
                                'filename': file,
                                'folder': folder,
                                'path': os.path.join(folder, file),
                                'full_path': os.path.join(folder_path, file)
                            })
            
            return JsonResponse({
                'success': True,
                'images_dir': images_dir,
                'processed_images': processed_images,
                'total_images': len(processed_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def serve_processed_image(request, folder, filename):
    """Serve a processed image file"""
    try:
        images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
        image_path = os.path.join(images_dir, folder, filename)
        
        if os.path.exists(image_path):
            return FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
        else:
            return HttpResponse('Image not found', status=404)
            
    except Exception as e:
        return HttpResponse(f'Error serving image: {str(e)}', status=500)

@csrf_exempt
def view_organized_images(request):
    """View organized images (original and trained)"""
    if request.method == 'GET':
        try:
            base_images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            original_imgs_dir = os.path.join(base_images_dir, 'original_imgs')
            trained_imgs_dir = os.path.join(base_images_dir, 'trained_imgs')
            
            if not os.path.exists(base_images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all original images
            original_images = []
            if os.path.exists(original_imgs_dir):
                for file in os.listdir(original_imgs_dir):
                    if file.endswith(('.jpg', '.jpeg', '.png')):
                        file_path = os.path.join(original_imgs_dir, file)
                        file_time = os.path.getctime(file_path)
                        original_images.append({
                            'filename': file,
                            'type': 'original',
                            'path': f'original_imgs/{file}',
                            'full_path': file_path,
                            'created_time': file_time
                        })
            
            # Find all trained images
            trained_images = []
            if os.path.exists(trained_imgs_dir):
                for folder in os.listdir(trained_imgs_dir):
                    folder_path = os.path.join(trained_imgs_dir, folder)
                    if os.path.isdir(folder_path):
                        for file in os.listdir(folder_path):
                            if file.endswith(('.jpg', '.jpeg', '.png')):
                                file_path = os.path.join(folder_path, file)
                                file_time = os.path.getctime(file_path)
                                trained_images.append({
                                    'filename': file,
                                    'folder': folder,
                                    'type': 'trained',
                                    'path': f'trained_imgs/{folder}/{file}',
                                    'full_path': file_path,
                                    'created_time': file_time,
                                    'readable_date': folder.replace('_', ' at ').replace('-', '/')
                                })
            
            # Sort by creation time (newest first)
            original_images.sort(key=lambda x: x['created_time'], reverse=True)
            trained_images.sort(key=lambda x: x['created_time'], reverse=True)
            
            return JsonResponse({
                'success': True,
                'base_images_dir': base_images_dir,
                'original_imgs_dir': original_imgs_dir,
                'trained_imgs_dir': trained_imgs_dir,
                'original_images': original_images,
                'trained_images': trained_images,
                'total_original': len(original_images),
                'total_trained': len(trained_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

def generate_quote(request):
    """Generate moving quote based on analyzed photos"""
    if request.method == 'POST':
        try:
            room_ids = request.POST.getlist('room_ids')
            distance_km = float(request.POST.get('distance', 0))
            services = request.POST.getlist('services')
            
            if not room_ids:
                return JsonResponse({
                    'success': False,
                    'error': 'No rooms selected'
                })
            
            # Get all detected objects from selected rooms
            all_objects = DetectedObject.objects.filter(
                photo__room__id__in=room_ids,
                photo__status='analyzed'
            )
            
            if not all_objects.exists():
                return JsonResponse({
                    'success': False,
                    'error': 'No analyzed photos found in selected rooms'
                })
            
            # Group by object class
            volumes_data = {}
            for obj in all_objects:
                if obj.object_class not in volumes_data:
                    volumes_data[obj.object_class] = {
                        'volume': 0,
                        'weight': 0,
                        'confidence': 0,
                        'count': 0
                    }
                
                volumes_data[obj.object_class]['volume'] += obj.estimated_volume
                volumes_data[obj.object_class]['weight'] += obj.estimated_weight
                volumes_data[obj.object_class]['confidence'] += obj.confidence
                volumes_data[obj.object_class]['count'] += 1
            
            # Average confidence
            for obj_class in volumes_data:
                volumes_data[obj_class]['confidence'] /= volumes_data[obj_class]['count']
            
            total_volume = sum(data['volume'] for data in volumes_data.values())
            total_weight = sum(data['weight'] for data in volumes_data.values())
            # Use official volume×distance price matrix when distance provided
            if distance_km is not None and distance_km >= 0:
                final_price = get_price_from_matrix(total_volume, distance_km)
                base_price = final_price
            else:
                base_price = total_volume * 10 + total_weight * 0.5
                final_price = base_price * (1 + (distance_km or 0) * 0.01)
            
            quote_data = {
                'total_volume': total_volume,
                'total_weight': total_weight,
                'base_price': base_price,
                'final_price': final_price,
                'confidence_score': 0.8,
                'distance_km': distance_km,
                'services': services
            }
            
            validation = {'valid': True, 'message': 'Quote generated successfully'}
            
            # Save quote to database
            quote = Quote.objects.create(
                user=None,
                total_volume=quote_data['total_volume'],
                total_weight=quote_data['total_weight'],
                base_price=quote_data['base_price'],
                final_price=quote_data['final_price'],
                confidence_score=quote_data['confidence_score'],
                distance_km=distance_km,
                services=services
            )
            
            # Add quote ID to response
            quote_data['quote_id'] = quote.id
            
            return JsonResponse({
                'success': True,
                'quote_id': quote.id,
                'quote_data': quote_data,
                'validation': validation,
                'summary': f'Quote for {total_volume:.1f}m³, {total_weight:.1f}kg - {final_price:.2f}€'
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    # GET request - show quote generation form
    user_rooms = Room.objects.all().prefetch_related('photos')
    return render(request, 'ai_model/generate_quote.html', {
        'rooms': user_rooms
    })

def quote_detail(request, quote_id):
    """Show detailed quote information"""
    try:
        quote = Quote.objects.get(id=quote_id)
        
        # Get detected objects for this quote
        detected_objects = DetectedObject.objects.all().select_related('photo', 'photo__room')
        
        # Group by room
        rooms_data = {}
        for obj in detected_objects:
            room_name = obj.photo.room.name
            if room_name not in rooms_data:
                rooms_data[room_name] = []
            
            rooms_data[room_name].append({
                'object_class': obj.object_class,
                'confidence': obj.confidence,
                'volume': obj.estimated_volume,
                'weight': obj.estimated_weight
            })
        
        context = {
            'quote': quote,
            'rooms_data': rooms_data,
            'services': quote.services
        }
        
        return render(request, 'ai_model/quote_detail.html', context)
        
    except Quote.DoesNotExist:
        return JsonResponse({
            'success': False,
            'error': 'Quote not found'
        })

def user_quotes(request):
    """Show all quotes for the current user"""
    quotes = Quote.objects.all().order_by('-created_at')
    
    return render(request, 'ai_model/user_quotes.html', {
        'quotes': quotes
    })

def room_list(request):
    """Show all rooms for the current user"""
    rooms = Room.objects.all().prefetch_related('photos')
    
    return render(request, 'ai_model/room_list.html', {
        'rooms': rooms
    })

@csrf_exempt
def predict_objects(request):
    """YOLO-based object detection API endpoint"""
    if request.method == 'POST':
        try:
            # Check if image file is provided
            if 'image' not in request.FILES:
                return JsonResponse({
                    'success': False,
                    'error': 'No image file provided'
                })
            
            image_file = request.FILES['image']
            
            # Get custom rooms from request (optional)
            custom_rooms = []
            if 'custom_rooms' in request.POST:
                try:
                    import json
                    custom_rooms = json.loads(request.POST['custom_rooms'])
                except:
                    custom_rooms = []
            
            # Validate file type
            if not image_file.content_type.startswith('image/'):
                return JsonResponse({
                    'success': False,
                    'error': 'File must be an image'
                })
            
            # Validate file size (max 10MB)
            if image_file.size > 10 * 1024 * 1024:
                return JsonResponse({
                    'success': False,
                    'error': 'File size too large (max 10MB)'
                })
            
            # Load YOLO model (exactly like your notebook)
            # Change to the ai_model directory to match your notebook's working directory
            ai_model_dir = os.path.join(os.path.dirname(__file__), 'ai_model')
            original_cwd = os.getcwd()
            os.chdir(ai_model_dir)
            
            try:
                # Load model with simple filename like your notebook
                model = YOLO("yolov8x-oiv7.pt")
                print(f"YOLO model loaded successfully from {ai_model_dir}")
            except Exception as e:
                os.chdir(original_cwd)  # Restore original directory
                return JsonResponse({
                    'success': False,
                    'error': f'YOLO model loading failed: {str(e)}'
                })
            
            # Create organized directory structure first
            base_images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            original_imgs_dir = os.path.join(base_images_dir, 'original_imgs')
            trained_imgs_dir = os.path.join(base_images_dir, 'trained_imgs')
            
            # Create directories if they don't exist
            os.makedirs(original_imgs_dir, exist_ok=True)
            os.makedirs(trained_imgs_dir, exist_ok=True)
            
            # Create timestamped folder name for better organization
            now = datetime.now()
            folder_name = now.strftime('%Y-%m-%d_%H-%M-%S')
            
            # Clean the original filename for better organization
            clean_filename = os.path.splitext(image_file.name)[0].replace(' ', '_').replace('-', '_')
            original_filename = f"{clean_filename}_{now.strftime('%H%M%S')}.jpg"
            
            # Save uploaded image directly to ai_model directory (exactly like your notebook)
            try:
                # First, validate the uploaded file before processing
                print(f"DEBUG: Original file name: {image_file.name}")
                print(f"DEBUG: Original file size: {image_file.size} bytes")
                print(f"DEBUG: File content type: {getattr(image_file, 'content_type', 'unknown')}")
                
                # Reset file pointer and read data
                image_file.seek(0)
                image_data = image_file.read()
                
                # Convert ALL images to JPEG format for AI processing
                import io
                from PIL import Image
                
                print(f"DEBUG: Image data length: {len(image_data)} bytes")
                print(f"DEBUG: First 20 bytes: {image_data[:20]}")
                print(f"DEBUG: Data as hex: {image_data[:50].hex()}")
                
                # Check if data looks like an image
                if len(image_data) < 10:
                    raise Exception("Image file too small or empty")
                
                # Try to identify the format
                if image_data.startswith(b'\xff\xd8\xff'):
                    print("DEBUG: Detected JPEG format")
                elif image_data.startswith(b'\x89PNG\r\n\x1a\n'):
                    print("DEBUG: Detected PNG format")
                elif image_data.startswith(b'GIF87a') or image_data.startswith(b'GIF89a'):
                    print("DEBUG: Detected GIF format")
                elif image_data.startswith(b'RIFF') and b'WEBP' in image_data[:20]:
                    print("DEBUG: Detected WEBP format")
                elif image_data.startswith(b'\x00\x00\x00\x20ftypavif') or image_data.startswith(b'\x00\x00\x00\x18ftypavif'):
                    print("DEBUG: Detected AVIF format - will convert to JPEG")
                elif image_data.startswith(b'\x00\x00\x00\x20ftypheic') or image_data.startswith(b'\x00\x00\x00\x18ftypheic'):
                    print("DEBUG: Detected HEIC format - will convert to JPEG")
                else:
                    print(f"DEBUG: Unknown format, first bytes: {image_data[:10]}")
                    print("DEBUG: Will attempt to process with PIL anyway")
                
                # Try multiple methods to convert image to JPEG
                img = None
                image_path = None
                
                # Method 1: Try PIL with AVIF/HEIC support first
                try:
                    print("DEBUG: Trying PIL with AVIF/HEIC support...")
                    image_buffer = io.BytesIO(image_data)
                    img = Image.open(image_buffer)
                    print(f"DEBUG: PIL worked: {img.format}, {img.size}, mode: {img.mode}")
                    
                except Exception as e1:
                    print(f"DEBUG: PIL failed: {e1}")
                    
                    # Method 2: Try imageio
                    try:
                        print("DEBUG: Trying imageio...")
                        import imageio
                        import numpy as np
                        
                        image_buffer = io.BytesIO(image_data)
                        img_array = imageio.imread(image_buffer)
                        print(f"DEBUG: imageio loaded: {img_array.shape}")
                        
                        # Convert numpy array to PIL Image
                        if len(img_array.shape) == 3:
                            if img_array.shape[2] == 4:  # RGBA
                                img = Image.fromarray(img_array, 'RGBA').convert('RGB')
                            else:  # RGB
                                img = Image.fromarray(img_array, 'RGB')
                        else:  # Grayscale
                            img = Image.fromarray(img_array, 'L').convert('RGB')
                        
                        print(f"DEBUG: imageio conversion successful: {img.size}")
                        
                    except Exception as e2:
                        print(f"DEBUG: imageio failed: {e2}")
                        
                        # Method 3: Try PIL with temp file
                        try:
                            print("DEBUG: Trying PIL with temp file...")
                            temp_path = os.path.join(ai_model_dir, f"temp_{now.strftime('%H%M%S')}.tmp")
                            with open(temp_path, 'wb') as f:
                                f.write(image_data)
                            
                            img = Image.open(temp_path)
                            print(f"DEBUG: PIL temp file worked: {img.format}, {img.size}")
                            
                            # Clean up temp file
                            os.remove(temp_path)
                            
                        except Exception as e3:
                            print(f"DEBUG: PIL temp file failed: {e3}")
                            
                            # Method 4: Try Django file chunks
                            try:
                                print("DEBUG: Trying Django file chunks...")
                                image_file.seek(0)
                                
                                temp_path = os.path.join(ai_model_dir, f"temp_{now.strftime('%H%M%S')}.tmp")
                                with open(temp_path, 'wb') as f:
                                    for chunk in image_file.chunks():
                                        f.write(chunk)
                                
                                img = Image.open(temp_path)
                                print(f"DEBUG: Django chunks worked: {img.format}, {img.size}")
                                
                                # Clean up temp file
                                os.remove(temp_path)
                                
                            except Exception as e4:
                                print(f"DEBUG: All methods failed!")
                                print(f"  PIL BytesIO: {e1}")
                                print(f"  imageio: {e2}")
                                print(f"  PIL temp: {e3}")
                                print(f"  Django chunks: {e4}")
                                raise Exception(f"All image processing methods failed. Check if file is a valid image.")
                
                # If we got here, we have a valid image
                if img is None:
                    raise Exception("No valid image could be processed")
                
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                    print(f"DEBUG: Converted image mode to RGB")
                
                # Save as high-quality JPEG
                simple_filename = f"api_image_{now.strftime('%H%M%S')}.jpg"
                image_path = os.path.join(ai_model_dir, simple_filename)
                img.save(image_path, 'JPEG', quality=95, optimize=True)
                print(f"DEBUG: Image saved as JPEG to: {image_path}")
                
                # Also save to organized folder
                organized_path = os.path.join(original_imgs_dir, original_filename)
                img.save(organized_path, 'JPEG', quality=95, optimize=True)
                print(f"DEBUG: Image saved to organized folder: {organized_path}")
                
                # Verify the saved file works
                try:
                    with Image.open(image_path) as img:
                        print(f"DEBUG: Saved image verified: {img.format}, {img.size}")
                except Exception as e:
                    print(f"DEBUG: Saved image verification failed: {e}")
                    raise Exception(f"Image save verification failed: {e}")
                
            except Exception as e:
                os.chdir(original_cwd)  # Restore original directory
                return JsonResponse({
                    'success': False,
                    'error': f'Error processing image file: {str(e)}'
                })
            
            try:
                # Run prediction with the saved image file (exactly like your notebook)
                # Use the same approach as your working notebook - direct file path
                try:
                    # Create the output directory for this prediction
                    detect_folder = os.path.join(trained_imgs_dir, folder_name)
                    os.makedirs(detect_folder, exist_ok=True)
                    
                    # Use simple filename exactly like your notebook, but specify output directory
                    results = model.predict(
                        simple_filename, 
                        save=True, 
                        project=trained_imgs_dir,
                        name=folder_name,
                        exist_ok=True
                    )
                    print(f"YOLO prediction completed successfully")
                    print(f"Results saved to: {detect_folder}")
                except Exception as yolo_error:
                    print(f"YOLO prediction error: {str(yolo_error)}")
                    # If YOLO fails, still return success but with no detections
                    results = []
                
                # Define your 60 specific classes (in French)
                ALLOWED_CLASSES = [
                    "Banc", "Cadre", "Carton", "Console", "Etagére muale", "Meuble a chaussure", 
                    "Miroir", "Porte manteau", "Boîte ou panier", "Coffre a linge", "Colonne salle de bain", 
                    "Lave linge", "Meuble salle de bain", "Tapis petit", "Canapé 3 places (-80KG)", 
                    "Canapé d'angle (-80KG)", "hifi", "Lampadaire", "Meuble TV bas", "Table basse", 
                    "Télevision", "Cuisinière (-80KG)", "Four", "Frigo-congélateur", "Lave vaisselle", 
                    "Micro ondes", "Etagère", "Buffet haut", "Chaise", "Moyenne table", 
                    "Plante en pot", "Tapis moyen", "Vaisselier (-80KG)", 
                    "Armoire 2p (-80KG)", "Bureau", "Chaise de bureau", "Commode", "lit double", 
                    "lit simple", "Armoire ancienne (-80KG)", "Barbecue", "Coffre de rangement", 
                    "Echelle", "Escabeau", "valises", "Etagére", "Etendoir", "Parasol", 
                    "Table de jardin", "Transat", "Vélo", "Aspirateur", "séche linge", 
                    "Table de ping-pong (-80KG)", "Chiffronier", "Guitare", "Lampe de bureau", 
                    "Paravent", "Vélo d'intérieur (-80KG)", "Tapis de course (-80KG)", 
                    "Banc de musculation (-80KG)"
                ]
                
                # Mapping from English YOLO classes to your French classes
                ENGLISH_TO_FRENCH_MAPPING = {
                    # Furniture
                    "chair": "Chaise",
                    "dining chair": "Chaise",
                    "office chair": "Chaise de bureau",
                    "stool": "Banc",
                    "bench": "Banc",
                    "sofa": "Canapé 3 places (-80KG)",
                    "couch": "Canapé 3 places (-80KG)",
                    "studio couch": "Canapé 3 places (-80KG)",
                    "sofa bed": "Canapé 3 places (-80KG)",
                    "sectional sofa": "Canapé d'angle (-80KG)",
                    "table": "Table moyenne",
                    "dining table": "Table moyenne",
                    "coffee table": "Table basse",
                    "desk": "Bureau",
                    "office desk": "Bureau",
                    "bed": "lit double",
                    "single bed": "lit simple",
                    "double bed": "lit double",
                    "twin bed": "lit simple",
                    "queen bed": "lit double",
                    "king bed": "lit double",
                    "wardrobe": "Armoire 2p (-80KG)",
                    "closet": "Armoire 2p (-80KG)",
                    "cabinet": "Armoire 2p (-80KG)",
                    "dresser": "Commode",
                    "chest of drawers": "Commode",
                    "bookshelf": "Etagère",
                    "shelf": "Etagère",
                    "bookcase": "Etagère",
                    "sideboard": "Buffet haut",
                    "buffet": "Buffet haut",
                    "console table": "Console",
                    "tv stand": "Meuble TV bas",
                    "entertainment center": "Meuble TV bas",
                    "nightstand": "Table basse",
                    "end table": "Table basse",
                    "dining room table": "Table moyenne",
                    "kitchen table": "Table moyenne",
                    "outdoor table": "Table moyenne",
                    "garden table": "Table moyenne",
                    "picnic table": "Table moyenne",
                    "ping pong table": "Table moyenne",
                    "pool table": "Table moyenne",
                    
                    # Electronics
                    "tv": "Télevision",
                    "television": "Télevision",
                    "monitor": "Télevision",
                    "computer monitor": "Télevision",
                    "laptop": "Ordinateur portable",
                    "computer": "Ordinateur",
                    "stereo": "hifi",
                    "speaker": "hifi",
                    "sound system": "hifi",
                    "radio": "hifi",
                    "microwave": "Micro ondes",
                    "microwave oven": "Micro ondes",
                    "refrigerator": "Frigo-congélateur",
                    "fridge": "Frigo-congélateur",
                    "freezer": "Frigo-congélateur",
                    "dishwasher": "Lave vaisselle",
                    "washing machine": "Lave linge",
                    "dryer": "séche linge",
                    "clothes dryer": "séche linge",
                    "tumble dryer": "séche linge",
                    "oven": "Four",
                    "stove": "Cuisinière (-80KG)",
                    "cooktop": "Cuisinière (-80KG)",
                    "range": "Cuisinière (-80KG)",
                    "vacuum cleaner": "Aspirateur",
                    "vacuum": "Aspirateur",
                    
                    # Lighting
                    "lamp": "Lampadaire",
                    "floor lamp": "Lampadaire",
                    "table lamp": "Lampe de bureau",
                    "desk lamp": "Lampe de bureau",
                    "ceiling light": "Plafonnier",
                    "chandelier": "Lustre",
                    "pendant light": "Suspension",
                    
                    # Storage & Organization
                    "box": "Boîte ou panier",
                    "storage box": "Boîte ou panier",
                    "basket": "Boîte ou panier",
                    "hamper": "Coffre a linge",
                    "laundry basket": "Coffre a linge",
                    "trunk": "Coffre de rangement",
                    "chest": "Coffre de rangement",
                    "storage chest": "Coffre de rangement",
                    "suitcase": "valises",
                    "luggage": "valises",
                    "backpack": "Sac à dos",
                    "bag": "Sac",
                    "shoe rack": "Meuble a chaussure",
                    "shoe storage": "Meuble a chaussure",
                    "coat rack": "Porte manteau",
                    "hat rack": "Porte manteau",
                    "hanger": "Porte manteau",
                    
                    # Bathroom
                    "bathroom cabinet": "Meuble salle de bain",
                    "vanity": "Meuble salle de bain",
                    "bathroom storage": "Meuble salle de bain",
                    "medicine cabinet": "Colonne salle de bain",
                    "bathroom mirror": "Miroir",
                    "mirror": "Miroir",
                    "bathroom mirror": "Miroir",
                    
                    # Outdoor & Garden
                    "umbrella": "Parasol",
                    "beach umbrella": "Parasol",
                    "garden umbrella": "Parasol",
                    "patio umbrella": "Parasol",
                    "lawn chair": "Transat",
                    "beach chair": "Transat",
                    "deck chair": "Transat",
                    "folding chair": "Transat",
                    "camping chair": "Transat",
                    "bicycle": "Vélo",
                    "bike": "Vélo",
                    "exercise bike": "Vélo d'intérieur (-80KG)",
                    "stationary bike": "Vélo d'intérieur (-80KG)",
                    "treadmill": "Tapis de course (-80KG)",
                    "exercise equipment": "Banc de musculation (-80KG)",
                    "weight bench": "Banc de musculation (-80KG)",
                    "barbell": "Banc de musculation (-80KG)",
                    "dumbbell": "Banc de musculation (-80KG)",
                    "grill": "Barbecue",
                    "barbecue": "Barbecue",
                    "bbq": "Barbecue",
                    "outdoor grill": "Barbecue",
                    "clothesline": "Etendoir",
                    "drying rack": "Etendoir",
                    "laundry rack": "Etendoir",
                    "ladder": "Echelle",
                    "step ladder": "Escabeau",
                    "step stool": "Escabeau",
                    "stepstool": "Escabeau",
                    
                    # Decorative & Other
                    "picture frame": "Cadre",
                    "frame": "Cadre",
                    "photo frame": "Cadre",
                    "painting": "Cadre",
                    "artwork": "Cadre",
                    "rug": "Tapis moyen",
                    "carpet": "Tapis moyen",
                    "doormat": "Tapis petit",
                    "bath mat": "Tapis petit",
                    "kitchen mat": "Tapis petit",
                    "area rug": "Tapis moyen",
                    "plant": "Plante en pot",
                    "potted plant": "Plante en pot",
                    "houseplant": "Plante en pot",
                    "flower pot": "Plante en pot",
                    "flowerpot": "Plante en pot",
                    "guitar": "Guitare",
                    "acoustic guitar": "Guitare",
                    "electric guitar": "Guitare",
                    "screen": "Paravent",
                    "room divider": "Paravent",
                    "folding screen": "Paravent",
                    "cardboard": "Carton",
                    "cardboard box": "Carton",
                    "moving box": "Carton",
                    "packing box": "Carton"
                }
                
                # Process results
                detected_objects = []
                object_counts = Counter()
                
                print(f"DEBUG: Processing {len(results)} results")
                print(f"DEBUG: Filtering for {len(ALLOWED_CLASSES)} allowed classes")
                
                # Check if results exist and have boxes
                if results and len(results) > 0:
                    print(f"DEBUG: Results exist, processing...")
                    for result in results:
                        # Check if result has boxes and they're not empty
                        print(f"DEBUG: Result has boxes: {hasattr(result, 'boxes')}")
                        if hasattr(result, 'boxes'):
                            print(f"DEBUG: Boxes is not None: {result.boxes is not None}")
                            if result.boxes is not None:
                                print(f"DEBUG: Number of boxes: {len(result.boxes)}")
                        
                        if hasattr(result, 'boxes') and result.boxes is not None and len(result.boxes) > 0:
                            for box in result.boxes:
                                try:
                                    # Get class name and confidence
                                    class_id = int(box.cls[0])
                                    class_name = model.names[class_id]
                                    confidence = float(box.conf[0])
                                    
                                    # Only include objects with confidence > 0.05 (lowered threshold)
                                    if confidence > 0.05:
                                        # TRANSLATE: Convert English YOLO class to French
                                        english_class = class_name.lower()
                                        french_class = ENGLISH_TO_FRENCH_MAPPING.get(english_class, None)
                                        
                                        if french_class:
                                            # This object is in your 60 classes (translated to French)
                                            detected_objects.append({
                                                'class': french_class,  # Use French name
                                                'confidence': round(confidence, 3),
                                                'bbox': {
                                                    'x': float(box.xyxy[0][0]),
                                                    'y': float(box.xyxy[0][1]),
                                                    'width': float(box.xyxy[0][2] - box.xyxy[0][0]),
                                                    'height': float(box.xyxy[0][3] - box.xyxy[0][1])
                                                }
                                            })
                                            object_counts[french_class] += 1
                                            print(f"DEBUG: ✅ TRANSLATED - {english_class} → {french_class} (confidence: {confidence:.3f})")
                                        else:
                                            print(f"DEBUG: ❌ FILTERED OUT - {english_class} (not in your 60 classes)")
                                except Exception as e:
                                    print(f"Error processing box: {e}")
                                    continue
                else:
                    print("No results from YOLO prediction or empty results")
                
                # Create summary string
                summary_parts = []
                for obj_name, count in object_counts.most_common():
                    if count == 1:
                        summary_parts.append(f"1 {obj_name}")
                    else:
                        summary_parts.append(f"{count} {obj_name}s")
                
                summary = ", ".join(summary_parts) if summary_parts else "No objects detected"
                
                # Calculate total volume - convert Counter to dict
                volume_calculation = calculate_total_volume(dict(object_counts))
                
                # Calculate quote
                quote_calculation = calculate_quote(volume_calculation)
                
                # Find the saved image path
                saved_image_path = None
                if results and len(results) > 0:
                    # YOLO saves images in the trained_imgs folder we specified
                    detect_folder = os.path.join(trained_imgs_dir, folder_name)
                    if os.path.exists(detect_folder):
                        # Find the processed image file
                        for file in os.listdir(detect_folder):
                            if file.endswith(('.jpg', '.jpeg', '.png')):
                                saved_image_path = os.path.join(detect_folder, file)
                                break
                else:
                    # If YOLO failed, create a simple copy of the original image
                    try:
                        detect_folder = os.path.join(trained_imgs_dir, folder_name)
                        os.makedirs(detect_folder, exist_ok=True)
                        
                        # Copy original image to trained folder as fallback
                        fallback_filename = f"fallback_{original_filename}"
                        saved_image_path = os.path.join(detect_folder, fallback_filename)
                        
                        # Copy the original image file
                        import shutil
                        shutil.copy2(image_path, saved_image_path)
                        
                        print(f"Created fallback image: {saved_image_path}")
                    except Exception as e:
                        print(f"Error creating fallback image: {e}")
                
                # Delete any existing manual selections for this client (if client_id is provided)
                client_id = request.POST.get('client_id')
                if client_id:
                    try:
                        from demenagement.models import ManualSelection
                        existing_manual_selections = ManualSelection.objects.filter(client_info_id=client_id)
                        if existing_manual_selections.exists():
                            deleted_count = existing_manual_selections.count()
                            existing_manual_selections.delete()
                            print(f"Deleted {deleted_count} manual selections for client {client_id} (AI method chosen)")
                    except Exception as e:
                        print(f"Error deleting manual selections: {e}")
                
                # Save detection results to database
                try:
                    # Get room type from request or default to 'other'
                    room_type = request.POST.get('room_type', 'other')
                    room_name = request.POST.get('room_name', f"AI Room {now.strftime('%Y-%m-%d %H:%M:%S')}")
                    
                    # Create Room
                    room = Room.objects.create(
                        user=None,
                        room_type=room_type,
                        name=room_name
                    )
                    print(f"Created room: {room.name} (ID: {room.id})")
                    
                    # Create Photo entry
                    photo = Photo.objects.create(
                        room=room,
                        image=image_file.name,  # Store filename
                        filename=image_file.name,
                        file_size=image_file.size,
                        width=img.width if img else 0,
                        height=img.height if img else 0,
                        status='analyzed'
                    )
                    print(f"Created photo: {photo.filename} (ID: {photo.id})")
                    
                    # Create DetectedObject entries
                    for detected_obj in detected_objects:
                        obj_class = detected_obj['class']
                        confidence = detected_obj['confidence']
                        bbox = detected_obj['bbox']
                        
                        # Get volume and estimate weight
                        volume = OBJECT_VOLUMES.get(obj_class, 0.5)
                        weight = volume * 150  # Rough estimate: 150 kg/m³
                        
                        DetectedObject.objects.create(
                            photo=photo,
                            object_class=obj_class,
                            confidence=confidence,
                            bbox_x=bbox['x'],
                            bbox_y=bbox['y'],
                            bbox_width=bbox['width'],
                            bbox_height=bbox['height'],
                            estimated_volume=volume,
                            estimated_weight=weight
                        )
                    
                    print(f"Saved {len(detected_objects)} detected objects to database")
                    
                    # Save heavy objects if provided
                    heavy_objects_json = request.POST.get('heavy_objects')
                    if heavy_objects_json:
                        try:
                            from .models import HeavyObjectSelection
                            heavy_objects_data = json.loads(heavy_objects_json)
                            
                            for obj_name, obj_data in heavy_objects_data.items():
                                quantity = obj_data.get('quantity', 1)
                                if quantity > 0:
                                    HeavyObjectSelection.objects.create(
                                        room=room,
                                        object_name=obj_name,
                                        quantity=quantity,
                                        volume_per_unit=OBJECT_VOLUMES.get(obj_name, 0.5),
                                        length=obj_data.get('length'),
                                        width=obj_data.get('width'),
                                        height=obj_data.get('height'),
                                        is_custom=obj_data.get('is_custom', False)
                                    )
                            
                            print(f"Saved {len(heavy_objects_data)} heavy objects to database")
                        except Exception as e:
                            print(f"Error saving heavy objects: {e}")
                    
                except Exception as db_error:
                    print(f"Error saving to database: {db_error}")
                    # Don't fail the request if database save fails
                
                # Always return success, even if no objects detected
                return JsonResponse({
                    'success': True,
                    'detected_objects': detected_objects,
                    'object_counts': dict(object_counts),
                    'summary': summary,
                    'total_objects': len(detected_objects),
                    'message': 'Analysis completed successfully',
                    'custom_rooms': custom_rooms,  # Include custom rooms in response
                    'original_image_path': organized_path,
                    'trained_image_path': saved_image_path,
                    'original_imgs_folder': original_imgs_dir,
                    'trained_imgs_folder': trained_imgs_dir,
                    'volume_calculation': volume_calculation,
                    'quote_calculation': quote_calculation
                })
                
            except Exception as e:
                print(f"YOLO processing error: {str(e)}")
                
                # Delete any existing manual selections for this client (if client_id is provided)
                client_id = request.POST.get('client_id')
                if client_id:
                    try:
                        from demenagement.models import ManualSelection
                        existing_manual_selections = ManualSelection.objects.filter(client_info_id=client_id)
                        if existing_manual_selections.exists():
                            deleted_count = existing_manual_selections.count()
                            existing_manual_selections.delete()
                            print(f"Deleted {deleted_count} manual selections for client {client_id} (AI method chosen)")
                    except Exception as e:
                        print(f"Error deleting manual selections: {e}")
                
                # Return success with no detections if YOLO fails
                return JsonResponse({
                    'success': True,
                    'detected_objects': [],
                    'object_counts': {},
                    'summary': 'No objects detected',
                    'total_objects': 0,
                    'message': 'Analysis completed - no objects detected',
                    'custom_rooms': custom_rooms,  # Include custom rooms in response
                    'original_image_path': organized_path,
                    'trained_image_path': None,
                    'original_imgs_folder': original_imgs_dir,
                    'trained_imgs_folder': trained_imgs_dir
                })
            
            finally:
                # Clean up temporary image file
                if 'image_path' in locals() and os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                        print(f"Cleaned up temporary image: {image_path}")
                    except Exception as e:
                        print(f"Could not clean up temporary image: {e}")
                
                # Restore original working directory
                os.chdir(original_cwd)
            
        except Exception as e:
            print(f"Prediction error: {str(e)}")
            
            # Restore original working directory
            if 'original_cwd' in locals():
                os.chdir(original_cwd)
            
            # Try to provide a more helpful error message
            error_message = str(e)
            if "need at least one array to stack" in error_message:
                error_message = "Image processing failed - the image may be corrupted or in an unsupported format. Please try with a different image."
            elif "Image Read Error" in error_message:
                error_message = "Cannot read the image file. Please ensure it's a valid image format (JPG, PNG, etc.)."
            
            return JsonResponse({
                'success': False,
                'error': f'Prediction failed: {error_message}',
                'debug_info': {
                    'model_path': 'yolov8x-oiv7.pt',
                    'working_directory': ai_model_dir if 'ai_model_dir' in locals() else 'Not set',
                    'original_error': str(e)
                }
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def view_processed_images(request):
    """View processed images with bounding boxes"""
    if request.method == 'GET':
        try:
            images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            
            if not os.path.exists(images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all processed images
            processed_images = []
            
            # Look for YOLO output folders
            for folder in os.listdir(images_dir):
                folder_path = os.path.join(images_dir, folder)
                if os.path.isdir(folder_path) and folder.startswith('detect_'):
                    # Find images in this folder
                    for file in os.listdir(folder_path):
                        if file.endswith(('.jpg', '.jpeg', '.png')):
                            processed_images.append({
                                'filename': file,
                                'folder': folder,
                                'path': os.path.join(folder, file),
                                'full_path': os.path.join(folder_path, file)
                            })
            
            return JsonResponse({
                'success': True,
                'images_dir': images_dir,
                'processed_images': processed_images,
                'total_images': len(processed_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def serve_processed_image(request, folder, filename):
    """Serve a processed image file"""
    try:
        images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
        image_path = os.path.join(images_dir, folder, filename)
        
        if os.path.exists(image_path):
            return FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
        else:
            return HttpResponse('Image not found', status=404)
            
    except Exception as e:
        return HttpResponse(f'Error serving image: {str(e)}', status=500)

@csrf_exempt
def view_organized_images(request):
    """View organized images (original and trained)"""
    if request.method == 'GET':
        try:
            base_images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            original_imgs_dir = os.path.join(base_images_dir, 'original_imgs')
            trained_imgs_dir = os.path.join(base_images_dir, 'trained_imgs')
            
            if not os.path.exists(base_images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all original images
            original_images = []
            if os.path.exists(original_imgs_dir):
                for file in os.listdir(original_imgs_dir):
                    if file.endswith(('.jpg', '.jpeg', '.png')):
                        file_path = os.path.join(original_imgs_dir, file)
                        file_time = os.path.getctime(file_path)
                        original_images.append({
                            'filename': file,
                            'type': 'original',
                            'path': f'original_imgs/{file}',
                            'full_path': file_path,
                            'created_time': file_time
                        })
            
            # Find all trained images
            trained_images = []
            if os.path.exists(trained_imgs_dir):
                for folder in os.listdir(trained_imgs_dir):
                    folder_path = os.path.join(trained_imgs_dir, folder)
                    if os.path.isdir(folder_path):
                        for file in os.listdir(folder_path):
                            if file.endswith(('.jpg', '.jpeg', '.png')):
                                file_path = os.path.join(folder_path, file)
                                file_time = os.path.getctime(file_path)
                                trained_images.append({
                                    'filename': file,
                                    'folder': folder,
                                    'type': 'trained',
                                    'path': f'trained_imgs/{folder}/{file}',
                                    'full_path': file_path,
                                    'created_time': file_time,
                                    'readable_date': folder.replace('_', ' at ').replace('-', '/')
                                })
            
            # Sort by creation time (newest first)
            original_images.sort(key=lambda x: x['created_time'], reverse=True)
            trained_images.sort(key=lambda x: x['created_time'], reverse=True)
            
            return JsonResponse({
                'success': True,
                'base_images_dir': base_images_dir,
                'original_imgs_dir': original_imgs_dir,
                'trained_imgs_dir': trained_imgs_dir,
                'original_images': original_images,
                'trained_images': trained_images,
                'total_original': len(original_images),
                'total_trained': len(trained_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def test_ai_model(request):
    """Test endpoint for AI model functionality"""
    if request.method == 'POST':
        try:
            # Test YOLO model loading
            model_path = os.path.join(os.path.dirname(__file__), 'ai_model', 'yolov8x-oiv7.pt')
            if not os.path.exists(model_path):
                return JsonResponse({
                    'success': False,
                    'error': 'YOLO model file not found'
                })
            
            model = YOLO(model_path)
            
            return JsonResponse({
                'success': True,
                'test_results': {
                    'model_loaded': True,
                    'model_path': model_path,
                    'message': 'YOLO model is ready for predictions'
                }
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def view_processed_images(request):
    """View processed images with bounding boxes"""
    if request.method == 'GET':
        try:
            images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            
            if not os.path.exists(images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all processed images
            processed_images = []
            
            # Look for YOLO output folders
            for folder in os.listdir(images_dir):
                folder_path = os.path.join(images_dir, folder)
                if os.path.isdir(folder_path) and folder.startswith('detect_'):
                    # Find images in this folder
                    for file in os.listdir(folder_path):
                        if file.endswith(('.jpg', '.jpeg', '.png')):
                            processed_images.append({
                                'filename': file,
                                'folder': folder,
                                'path': os.path.join(folder, file),
                                'full_path': os.path.join(folder_path, file)
                            })
            
            return JsonResponse({
                'success': True,
                'images_dir': images_dir,
                'processed_images': processed_images,
                'total_images': len(processed_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def serve_processed_image(request, folder, filename):
    """Serve a processed image file"""
    try:
        images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
        image_path = os.path.join(images_dir, folder, filename)
        
        if os.path.exists(image_path):
            return FileResponse(open(image_path, 'rb'), content_type='image/jpeg')
        else:
            return HttpResponse('Image not found', status=404)
            
    except Exception as e:
        return HttpResponse(f'Error serving image: {str(e)}', status=500)

@csrf_exempt
def view_organized_images(request):
    """View organized images (original and trained)"""
    if request.method == 'GET':
        try:
            base_images_dir = os.path.join(os.path.dirname(__file__), 'ai_model', 'images')
            original_imgs_dir = os.path.join(base_images_dir, 'original_imgs')
            trained_imgs_dir = os.path.join(base_images_dir, 'trained_imgs')
            
            if not os.path.exists(base_images_dir):
                return JsonResponse({
                    'success': False,
                    'error': 'Images directory not found'
                })
            
            # Find all original images
            original_images = []
            if os.path.exists(original_imgs_dir):
                for file in os.listdir(original_imgs_dir):
                    if file.endswith(('.jpg', '.jpeg', '.png')):
                        file_path = os.path.join(original_imgs_dir, file)
                        file_time = os.path.getctime(file_path)
                        original_images.append({
                            'filename': file,
                            'type': 'original',
                            'path': f'original_imgs/{file}',
                            'full_path': file_path,
                            'created_time': file_time
                        })
            
            # Find all trained images
            trained_images = []
            if os.path.exists(trained_imgs_dir):
                for folder in os.listdir(trained_imgs_dir):
                    folder_path = os.path.join(trained_imgs_dir, folder)
                    if os.path.isdir(folder_path):
                        for file in os.listdir(folder_path):
                            if file.endswith(('.jpg', '.jpeg', '.png')):
                                file_path = os.path.join(folder_path, file)
                                file_time = os.path.getctime(file_path)
                                trained_images.append({
                                    'filename': file,
                                    'folder': folder,
                                    'type': 'trained',
                                    'path': f'trained_imgs/{folder}/{file}',
                                    'full_path': file_path,
                                    'created_time': file_time,
                                    'readable_date': folder.replace('_', ' at ').replace('-', '/')
                                })
            
            # Sort by creation time (newest first)
            original_images.sort(key=lambda x: x['created_time'], reverse=True)
            trained_images.sort(key=lambda x: x['created_time'], reverse=True)
            
            return JsonResponse({
                'success': True,
                'base_images_dir': base_images_dir,
                'original_imgs_dir': original_imgs_dir,
                'trained_imgs_dir': trained_imgs_dir,
                'original_images': original_images,
                'trained_images': trained_images,
                'total_original': len(original_images),
                'total_trained': len(trained_images)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_furniture_by_room(request):
    """Get furniture options for a specific room type"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'total_items': len(furniture_list)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_furniture(request):
    """Get all room types with their furniture options"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip()
                    })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'total_items': len(furniture_with_volumes)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def calculate_manual_quote(request):
    """Calculate volume and quote from manual furniture selection"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            selected_furniture = data.get('selected_furniture', {})
            
            if not selected_furniture:
                return JsonResponse({
                    'success': False,
                    'error': 'No furniture selected'
                })
            
            # Convert selected furniture to object counts format
            object_counts = {}
            for item_name, count in selected_furniture.items():
                if count > 0:
                    object_counts[item_name] = count
            
            # Calculate volume using existing function
            volume_calculation = calculate_total_volume(object_counts)
            
            # Optional distance_km for volume×distance price matrix
            distance_km = None
            try:
                d = data.get('distance_km')
                if d is not None:
                    distance_km = float(d)
            except (TypeError, ValueError):
                pass
            quote_calculation = calculate_quote(volume_calculation, distance_km=distance_km)
            
            # Create summary
            summary_parts = []
            for obj_name, count in object_counts.items():
                if count == 1:
                    summary_parts.append(f"1 {obj_name}")
                else:
                    summary_parts.append(f"{count} {obj_name}s")
            
            summary = ", ".join(summary_parts) if summary_parts else "No furniture selected"
            
            return JsonResponse({
                'success': True,
                'selected_furniture': selected_furniture,
                'object_counts': object_counts,
                'summary': summary,
                'total_objects': sum(selected_furniture.values()),
                'volume_calculation': volume_calculation,
                'quote_calculation': quote_calculation
            })
            
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'error': 'Invalid JSON data'
            })
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })
@csrf_exempt
def get_furniture_with_heavy_objects(request):
    """Get furniture options for a specific room type including heavy objects"""
    if request.method == 'GET':
        try:
            room_type = request.GET.get('room_type')
            
            if not room_type:
                return JsonResponse({
                    'success': False,
                    'error': 'Room type is required'
                })
            
            if room_type not in ROOM_OBJECTS:
                return JsonResponse({
                    'success': False,
                    'error': f'Invalid room type. Available types: {list(ROOM_OBJECTS.keys())}'
                })
            
            # Get furniture for the room type with their volumes
            furniture_list = []
            for object_name in ROOM_OBJECTS[room_type]:
                volume = OBJECT_VOLUMES.get(object_name, 0.0)
                furniture_list.append({
                    'name': object_name,
                    'volume': volume,
                    'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip(),
                    'is_heavy': False
                })
            
            # Get heavy objects (objects with weight restrictions)
            heavy_objects = []
            for object_name, volume in OBJECT_VOLUMES.items():
                if 'max' in object_name.lower() and 'kg' in object_name.lower():
                    heavy_objects.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name,
                        'is_heavy': True
                    })
            
            return JsonResponse({
                'success': True,
                'room_type': room_type,
                'furniture': furniture_list,
                'heavy_objects': heavy_objects,
                'total_items': len(furniture_list),
                'total_heavy_items': len(heavy_objects)
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_all_rooms_with_heavy_objects(request):
    """Get all room types with their furniture options including heavy objects"""
    if request.method == 'GET':
        try:
            rooms_data = {}
            
            for room_type, furniture_list in ROOM_OBJECTS.items():
                furniture_with_volumes = []
                for object_name in furniture_list:
                    volume = OBJECT_VOLUMES.get(object_name, 0.0)
                    furniture_with_volumes.append({
                        'name': object_name,
                        'volume': volume,
                        'display_name': object_name.replace('(-80KG)', '').replace('(<80 kg)', '').strip(),
                        'is_heavy': False
                    })
                
                # Get heavy objects for this room type
                heavy_objects = []
                for object_name, volume in OBJECT_VOLUMES.items():
                    if 'max' in object_name.lower() and 'kg' in object_name.lower():
                        heavy_objects.append({
                            'name': object_name,
                            'volume': volume,
                            'display_name': object_name,
                            'is_heavy': True
                        })
                
                rooms_data[room_type] = {
                    'furniture': furniture_with_volumes,
                    'heavy_objects': heavy_objects,
                    'total_items': len(furniture_with_volumes),
                    'total_heavy_items': len(heavy_objects)
                }
            
            return JsonResponse({
                'success': True,
                'rooms': rooms_data,
                'available_room_types': list(ROOM_OBJECTS.keys())
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })

@csrf_exempt
def get_ai_detection_results(request):
    """Get AI detection results from photos - shows actual detected objects"""
    if request.method == 'GET':
        try:
            # Get all rooms with photos
            rooms = Room.objects.all().prefetch_related('photos__detected_objects')
            
            results = []
            
            for room in rooms:
                room_data = {
                    'room_id': room.id,
                    'room_name': room.name,
                    'room_type': room.room_type,
                    'room_type_display': room.get_room_type_display(),
                    'created_at': room.created_at.isoformat(),
                    'photos': []
                }
                
                total_objects = 0
                all_detected_objects = {}
                
                for photo in room.photos.all():
                    photo_objects = []
                    
                    for detected_obj in photo.detected_objects.all():
                        obj_data = {
                            'object_class': detected_obj.object_class,
                            'confidence': detected_obj.confidence,
                            'estimated_volume': detected_obj.estimated_volume,
                            'estimated_weight': detected_obj.estimated_weight,
                            'bbox': {
                                'x': detected_obj.bbox_x,
                                'y': detected_obj.bbox_y,
                                'width': detected_obj.bbox_width,
                                'height': detected_obj.bbox_height
                            },
                            'detected_at': detected_obj.detected_at.isoformat()
                        }
                        photo_objects.append(obj_data)
                        total_objects += 1
                        
                        # Count objects for summary
                        if detected_obj.object_class in all_detected_objects:
                            all_detected_objects[detected_obj.object_class] += 1
                        else:
                            all_detected_objects[detected_obj.object_class] = 1
                    
                    if photo_objects:  # Only include photos with detected objects
                        room_data['photos'].append({
                            'photo_id': photo.id,
                            'filename': photo.filename,
                            'status': photo.status,
                            'uploaded_at': photo.uploaded_at.isoformat(),
                            'detected_objects': photo_objects,
                            'object_count': len(photo_objects)
                        })
                
                room_data['total_objects_detected'] = total_objects
                room_data['object_summary'] = all_detected_objects
                
                # Get heavy objects for this room
                from .models import HeavyObjectSelection
                heavy_objects_for_room = []
                for heavy_obj in room.heavy_objects.all():
                    heavy_objects_for_room.append({
                        'name': heavy_obj.object_name,
                        'quantity': heavy_obj.quantity,
                        'volume': heavy_obj.volume_per_unit,
                        'is_custom': heavy_obj.is_custom,
                        'length': heavy_obj.length,
                        'width': heavy_obj.width,
                        'height': heavy_obj.height
                    })
                
                room_data['heavy_objects'] = heavy_objects_for_room
                room_data['total_heavy_objects'] = len(heavy_objects_for_room)
                
                # Include room if it has detected objects OR heavy objects
                if total_objects > 0 or len(heavy_objects_for_room) > 0:
                    results.append(room_data)
            
            return JsonResponse({
                'success': True,
                'total_rooms': len(results),
                'rooms': results
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method'
    })
