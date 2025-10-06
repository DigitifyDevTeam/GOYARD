#!/usr/bin/env python3
"""
Test the API directly to see debug output
"""
import requests
import os

def test_api():
    # Find an image to test with
    original_imgs_dir = os.path.join('ai_detector', 'ai_model', 'images', 'original_imgs')
    if os.path.exists(original_imgs_dir):
        images = [f for f in os.listdir(original_imgs_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
        if images:
            test_image_path = os.path.join(original_imgs_dir, images[0])
            print(f"Testing with image: {test_image_path}")
            
            # Test the API
            url = 'http://127.0.0.1:8000/api/predict/'
            
            with open(test_image_path, 'rb') as f:
                files = {'image': f}
                response = requests.post(url, files=files)
                
            print(f"Response status: {response.status_code}")
            print(f"Response content: {response.text}")
        else:
            print("No images found")
    else:
        print("original_imgs directory not found")

if __name__ == "__main__":
    test_api()
