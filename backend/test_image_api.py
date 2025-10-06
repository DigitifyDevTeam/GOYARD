#!/usr/bin/env python3
cr
"""
Test script for the image prediction API
"""
import requests
import os
from PIL import Image
import tempfile

def test_api_with_sample_image():
    """Test the API with a sample image"""
    
    # Create a simple test image
    test_image = Image.new('RGB', (800, 600), color='white')
    
    # Save to temporary file
    with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp_file:
        test_image.save(tmp_file.name, 'JPEG')
        temp_path = tmp_file.name
    
    try:
        # Test the API
        url = 'http://localhost:8000/api/predict/'
        
        with open(temp_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, files=files)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        return response.status_code == 200
        
    except Exception as e:
        print(f"Error testing API: {e}")
        return False
    finally:
        # Clean up
        if os.path.exists(temp_path):
            os.unlink(temp_path)

if __name__ == "__main__":
    print("Testing image prediction API...")
    success = test_api_with_sample_image()
    if success:
        print("✅ API test successful!")
    else:
        print("❌ API test failed!")
