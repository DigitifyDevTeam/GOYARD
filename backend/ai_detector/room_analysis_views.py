from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .models import Room, RoomAnalysis, RoomObject
from .views import OBJECT_VOLUMES
import json

@csrf_exempt
@login_required
def get_room_analysis(request):
    """Get room-by-room analysis results for a user"""
    if request.method == 'GET':
        try:
            # Get all room analyses for the user
            analyses = RoomAnalysis.objects.filter(user=request.user).order_by('-analysis_date')
            
            room_results = {}
            
            for analysis in analyses:
                room_name = analysis.room.name
                objects = {}
                
                for room_obj in analysis.objects.all():
                    objects[room_obj.object_name] = {
                        'quantity': room_obj.quantity,
                        'volume_per_unit': room_obj.volume_per_unit,
                        'total_volume': room_obj.total_volume,
                        'is_ai_detected': room_obj.is_ai_detected,
                        'confidence': room_obj.confidence
                    }
                
                room_results[room_name] = {
                    'analysis_id': analysis.id,
                    'total_objects': analysis.total_objects,
                    'total_volume': analysis.total_volume,
                    'is_finalized': analysis.is_finalized,
                    'objects': objects
                }
            
            return JsonResponse({
                'success': True,
                'room_analyses': room_results
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
@login_required
def update_object_quantity(request):
    """Update the quantity of an object in a room analysis"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            room_name = data.get('room_name')
            object_name = data.get('object_name')
            new_quantity = data.get('quantity', 1)
            
            if not room_name or not object_name:
                return JsonResponse({
                    'success': False,
                    'error': 'Room name and object name are required'
                })
            
            # Find the room analysis
            try:
                room = Room.objects.get(name=room_name, user=request.user)
                analysis = RoomAnalysis.objects.filter(room=room, user=request.user).order_by('-analysis_date').first()
                
                if not analysis:
                    return JsonResponse({
                        'success': False,
                        'error': 'No analysis found for this room'
                    })
                
                # Find or create the room object
                room_obj, created = RoomObject.objects.get_or_create(
                    room_analysis=analysis,
                    object_name=object_name,
                    defaults={
                        'quantity': new_quantity,
                        'volume_per_unit': OBJECT_VOLUMES.get(object_name, 0.0),
                        'is_ai_detected': False
                    }
                )
                
                if not created:
                    room_obj.quantity = max(0, new_quantity)  # Don't allow negative quantities
                    room_obj.save()
                
                # Update analysis totals
                analysis.total_objects = sum(obj.quantity for obj in analysis.objects.all())
                analysis.total_volume = sum(obj.total_volume for obj in analysis.objects.all())
                analysis.save()
                
                return JsonResponse({
                    'success': True,
                    'object': {
                        'name': room_obj.object_name,
                        'quantity': room_obj.quantity,
                        'volume_per_unit': room_obj.volume_per_unit,
                        'total_volume': room_obj.total_volume
                    },
                    'analysis_totals': {
                        'total_objects': analysis.total_objects,
                        'total_volume': analysis.total_volume
                    }
                })
                
            except Room.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Room not found'
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
@login_required
def add_object_to_room(request):
    """Add a new object to a room analysis"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            room_name = data.get('room_name')
            object_name = data.get('object_name')
            quantity = data.get('quantity', 1)
            
            if not room_name or not object_name:
                return JsonResponse({
                    'success': False,
                    'error': 'Room name and object name are required'
                })
            
            # Find the room analysis
            try:
                room = Room.objects.get(name=room_name, user=request.user)
                analysis = RoomAnalysis.objects.filter(room=room, user=request.user).order_by('-analysis_date').first()
                
                if not analysis:
                    # Create new analysis if none exists
                    analysis = RoomAnalysis.objects.create(
                        room=room,
                        user=request.user
                    )
                
                # Create the room object
                room_obj = RoomObject.objects.create(
                    room_analysis=analysis,
                    object_name=object_name,
                    quantity=quantity,
                    volume_per_unit=OBJECT_VOLUMES.get(object_name, 0.0),
                    is_ai_detected=False
                )
                
                # Update analysis totals
                analysis.total_objects = sum(obj.quantity for obj in analysis.objects.all())
                analysis.total_volume = sum(obj.total_volume for obj in analysis.objects.all())
                analysis.save()
                
                return JsonResponse({
                    'success': True,
                    'object': {
                        'name': room_obj.object_name,
                        'quantity': room_obj.quantity,
                        'volume_per_unit': room_obj.volume_per_unit,
                        'total_volume': room_obj.total_volume
                    },
                    'analysis_totals': {
                        'total_objects': analysis.total_objects,
                        'total_volume': analysis.total_volume
                    }
                })
                
            except Room.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Room not found'
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
@login_required
def remove_object_from_room(request):
    """Remove an object from a room analysis"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            room_name = data.get('room_name')
            object_name = data.get('object_name')
            
            if not room_name or not object_name:
                return JsonResponse({
                    'success': False,
                    'error': 'Room name and object name are required'
                })
            
            # Find the room analysis
            try:
                room = Room.objects.get(name=room_name, user=request.user)
                analysis = RoomAnalysis.objects.filter(room=room, user=request.user).order_by('-analysis_date').first()
                
                if not analysis:
                    return JsonResponse({
                        'success': False,
                        'error': 'No analysis found for this room'
                    })
                
                # Find and delete the room object
                try:
                    room_obj = RoomObject.objects.get(
                        room_analysis=analysis,
                        object_name=object_name
                    )
                    room_obj.delete()
                    
                    # Update analysis totals
                    analysis.total_objects = sum(obj.quantity for obj in analysis.objects.all())
                    analysis.total_volume = sum(obj.total_volume for obj in analysis.objects.all())
                    analysis.save()
                    
                    return JsonResponse({
                        'success': True,
                        'message': f'Object {object_name} removed from {room_name}',
                        'analysis_totals': {
                            'total_objects': analysis.total_objects,
                            'total_volume': analysis.total_volume
                        }
                    })
                    
                except RoomObject.DoesNotExist:
                    return JsonResponse({
                        'success': False,
                        'error': 'Object not found in this room'
                    })
                
            except Room.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'error': 'Room not found'
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
