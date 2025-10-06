#!/usr/bin/env python3
"""
Debug image corruption issue by comparing original vs API-saved images
"""
import os
import requests
from PIL import Image
import hashlib

def compare_images():
    print("=== Debugging Image Corruption ===")
    
    # Find a test image
    test_image_path = None
    for root, dirs, files in os.walk('.'):
        for file in files:
            if file.endswith(('.jpg', '.jpeg', '.png')) and 'test' not in file.lower():
                test_image_path = os.path.join(root, file)
                break
        if test_image_path:
            break
    
    if not test_image_path:
        print("No test image found")
        return
        
    print(f"Using test image: {test_image_path}")
    
    # Get original image info
    original_size = os.path.getsize(test_image_path)
    with open(test_image_path, 'rb') as f:
        original_hash = hashlib.md5(f.read()).hexdigest()
    
    print(f"Original image size: {original_size} bytes")
    print(f"Original image hash: {original_hash}")
    
    try:
        # Test if original image works with PIL
        with Image.open(test_image_path) as img:
            print(f"Original image format: {img.format}, size: {img.size}, mode: {img.mode}")
    except Exception as e:
        print(f"Original image PIL error: {e}")
        return
    
    # Test the API
    print("\nTesting API...")
    url = 'http://127.0.0.1:8000/api/predict/'
    
    try:
        with open(test_image_path, 'rb') as f:
            files = {'image': f}
            response = requests.post(url, files=files)
            
        print(f"API Response status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"API Response: {data.get('summary', 'No summary')}")
            
            # Check if organized image was created
            if 'original_image_path' in data:
                organized_path = data['original_image_path']
                if os.path.exists(organized_path):
                    organized_size = os.path.getsize(organized_path)
                    with open(organized_path, 'rb') as f:
                        organized_hash = hashlib.md5(f.read()).hexdigest()
                    
                    print(f"\nOrganized image size: {organized_size} bytes")
                    print(f"Organized image hash: {organized_hash}")
                    print(f"Sizes match: {original_size == organized_size}")
                    print(f"Hashes match: {original_hash == organized_hash}")
                    
                    try:
                        # Test if organized image works with PIL
                        with Image.open(organized_path) as img:
                            print(f"Organized image format: {img.format}, size: {img.size}, mode: {img.mode}")
                    except Exception as e:
                        print(f"Organized image PIL error: {e}")
                else:
                    print(f"Organized image not found: {organized_path}")
        else:
            print(f"API Error: {response.text}")
            
    except Exception as e:
        print(f"API request error: {e}")

if __name__ == "__main__":
    compare_images()
