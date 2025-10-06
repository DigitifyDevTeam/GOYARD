import hashlib
import os
from PIL import Image
from django.core.files.uploadedfile import UploadedFile
from .models import Photo

def calculate_image_hash(image_file):
    """
    Calculate SHA-256 hash of image content for duplicate detection
    
    Args:
        image_file: Django UploadedFile or file path
        
    Returns:
        str: SHA-256 hash of the image content
    """
    hash_sha256 = hashlib.sha256()
    
    if hasattr(image_file, 'read'):
        # It's an UploadedFile
        image_file.seek(0)  # Reset file pointer to beginning
        for chunk in iter(lambda: image_file.read(4096), b""):
            hash_sha256.update(chunk)
        image_file.seek(0)  # Reset file pointer again
    else:
        # It's a file path
        with open(image_file, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
    
    return hash_sha256.hexdigest()

def check_duplicate_image(user, image_file, room_id=None):
    """
    Check if an image is a duplicate for a specific user
    
    Args:
        user: User instance
        image_file: Django UploadedFile
        room_id: Optional room ID to check within specific room
        
    Returns:
        dict: {
            'is_duplicate': bool,
            'existing_photo': Photo instance or None,
            'message': str
        }
    """
    try:
        # Calculate hash of the new image
        new_image_hash = calculate_image_hash(image_file)
        
        # Query for existing photos with same hash for this user
        query = Photo.objects.filter(
            room__user=user,
            image_hash=new_image_hash
        )
        
        # If room_id is provided, also check within the same room
        if room_id:
            query = query.filter(room_id=room_id)
        
        existing_photo = query.first()
        
        if existing_photo:
            return {
                'is_duplicate': True,
                'existing_photo': existing_photo,
                'message': f'Image déjà uploadée dans {existing_photo.room.name} le {existing_photo.uploaded_at.strftime("%d/%m/%Y à %H:%M")}'
            }
        else:
            return {
                'is_duplicate': False,
                'existing_photo': None,
                'message': 'Image unique'
            }
            
    except Exception as e:
        return {
            'is_duplicate': False,
            'existing_photo': None,
            'message': f'Erreur lors de la vérification: {str(e)}'
        }

def normalize_image_for_hash(image_file):
    """
    Normalize image for better duplicate detection (resize to standard size, convert to RGB)
    This helps detect duplicates even if they have different metadata or slight quality differences
    
    Args:
        image_file: Django UploadedFile
        
    Returns:
        bytes: Normalized image data
    """
    try:
        # Open image with PIL
        image_file.seek(0)
        img = Image.open(image_file)
        image_file.seek(0)
        
        # Convert to RGB if necessary
        if img.mode != 'RGB':
            img = img.convert('RGB')
        
        # Resize to standard size for comparison (e.g., 256x256)
        img = img.resize((256, 256), Image.Resampling.LANCZOS)
        
        # Convert to bytes
        import io
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='JPEG', quality=85)
        img_bytes.seek(0)
        
        return img_bytes.getvalue()
        
    except Exception as e:
        # If normalization fails, return original file content
        image_file.seek(0)
        return image_file.read()

def calculate_normalized_hash(image_file):
    """
    Calculate hash of normalized image for better duplicate detection
    
    Args:
        image_file: Django UploadedFile
        
    Returns:
        str: SHA-256 hash of normalized image
    """
    normalized_data = normalize_image_for_hash(image_file)
    return hashlib.sha256(normalized_data).hexdigest()
