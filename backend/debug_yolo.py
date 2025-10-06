#!/usr/bin/env python3
"""
Debug script to test YOLO prediction exactly like the notebook
"""
import os
import sys
from ultralytics import YOLO

def test_yolo_prediction():
    # Change to the ai_model directory (like the API does)
    ai_model_dir = os.path.join(os.path.dirname(__file__), 'ai_detector', 'ai_model')
    original_cwd = os.getcwd()
    
    print(f"Original working directory: {original_cwd}")
    print(f"Changing to: {ai_model_dir}")
    
    os.chdir(ai_model_dir)
    print(f"Current working directory: {os.getcwd()}")
    
    try:
        # Load model exactly like notebook
        print("Loading YOLO model...")
        model = YOLO("yolov8x-oiv7.pt")
        print("Model loaded successfully!")
        
        # Check if there are any images in the original_imgs folder
        original_imgs_dir = os.path.join('images', 'original_imgs')
        if os.path.exists(original_imgs_dir):
            print(f"Found original_imgs directory: {original_imgs_dir}")
            images = [f for f in os.listdir(original_imgs_dir) if f.endswith(('.jpg', '.jpeg', '.png'))]
            print(f"Found {len(images)} images: {images}")
            
            if images:
                # Test with the first image
                test_image = os.path.join(original_imgs_dir, images[0])
                print(f"Testing with image: {test_image}")
                
                # Run prediction exactly like notebook
                results = model.predict(test_image, save=True)
                print(f"Prediction completed! Results: {len(results)}")
                
                # Check what was detected
                if results and len(results) > 0:
                    result = results[0]
                    if hasattr(result, 'boxes') and result.boxes is not None:
                        print(f"Detected {len(result.boxes)} objects")
                        for i, box in enumerate(result.boxes):
                            cls = int(box.cls[0])
                            conf = float(box.conf[0])
                            class_name = model.names[cls]
                            print(f"  Object {i+1}: {class_name} (confidence: {conf:.2f})")
                    else:
                        print("No boxes detected in results")
                else:
                    print("No results returned from YOLO")
            else:
                print("No images found in original_imgs directory")
        else:
            print(f"original_imgs directory not found: {original_imgs_dir}")
            
    except Exception as e:
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        # Restore original directory
        os.chdir(original_cwd)
        print(f"Restored working directory: {os.getcwd()}")

if __name__ == "__main__":
    test_yolo_prediction()
