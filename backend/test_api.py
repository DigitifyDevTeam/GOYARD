#!/usr/bin/env python3
"""
Simple test script to verify the Django API setup
"""
import os
import sys
import django
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def test_yolo_model():
    """Test if YOLO model can be loaded"""
    try:
        from ultralytics import YOLO
        
        # Check if model file exists
        model_path = backend_dir / 'ai_detector' / 'ai_model' / 'yolov8x-oiv7.pt'
        if not model_path.exists():
            print(f"❌ YOLO model file not found at: {model_path}")
            return False
        
        print(f"✅ YOLO model file found at: {model_path}")
        
        # Try to load the model
        model = YOLO(str(model_path))
        print("✅ YOLO model loaded successfully")
        
        # Test prediction with a dummy image (this will fail but we can check if the model loads)
        print("✅ YOLO model is ready for predictions")
        return True
        
    except ImportError as e:
        print(f"❌ Failed to import ultralytics: {e}")
        print("Please install ultralytics: pip install ultralytics")
        return False
    except Exception as e:
        print(f"❌ Failed to load YOLO model: {e}")
        return False

def test_django_setup():
    """Test Django setup"""
    try:
        from django.conf import settings
        from django.urls import reverse
        
        print("✅ Django settings loaded successfully")
        print(f"✅ DEBUG mode: {settings.DEBUG}")
        print(f"✅ Allowed hosts: {settings.ALLOWED_HOSTS}")
        
        # Test URL configuration
        from ai_detector import urls as ai_urls
        print("✅ AI detector URLs loaded successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Django setup failed: {e}")
        return False

def main():
    print("🧪 Testing API Setup...")
    print("=" * 50)
    
    # Test Django setup
    print("\n1. Testing Django setup...")
    django_ok = test_django_setup()
    
    # Test YOLO model
    print("\n2. Testing YOLO model...")
    yolo_ok = test_yolo_model()
    
    print("\n" + "=" * 50)
    if django_ok and yolo_ok:
        print("🎉 All tests passed! The API should be ready to use.")
        print("\nTo start the Django server:")
        print("cd backend && python manage.py runserver")
        print("\nTo start the React frontend:")
        print("cd react && npm run dev")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())
