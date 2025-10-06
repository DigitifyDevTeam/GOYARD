from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .image_utils import check_duplicate_image

@csrf_exempt
@login_required
def check_duplicate_images(request):
    """Check for duplicate images before upload"""
    if request.method == 'POST':
        try:
            photos = request.FILES.getlist('photos')
            
            if not photos:
                return JsonResponse({
                    'success': False,
                    'error': 'No photos provided'
                })
            
            duplicate_results = []
            unique_photos = []
            
            for photo_file in photos:
                duplicate_check = check_duplicate_image(request.user, photo_file)
                
                if duplicate_check['is_duplicate']:
                    duplicate_results.append({
                        'filename': photo_file.name,
                        'message': duplicate_check['message'],
                        'existing_photo': {
                            'id': duplicate_check['existing_photo'].id,
                            'room_name': duplicate_check['existing_photo'].room.name,
                            'uploaded_at': duplicate_check['existing_photo'].uploaded_at.strftime("%d/%m/%Y à %H:%M")
                        }
                    })
                else:
                    unique_photos.append({
                        'filename': photo_file.name,
                        'size': photo_file.size
                    })
            
            return JsonResponse({
                'success': True,
                'unique_photos': unique_photos,
                'duplicate_photos': duplicate_results,
                'total_photos': len(photos),
                'unique_count': len(unique_photos),
                'duplicate_count': len(duplicate_results),
                'message': f'Found {len(unique_photos)} unique photos, {len(duplicate_results)} duplicates'
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
