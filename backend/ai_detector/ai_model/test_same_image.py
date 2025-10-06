#!/usr/bin/env python3
"""
Test the exact same image that the API failed to process
"""
import os
import shutil
from ultralytics import YOLO

def test_same_image():
    print("=== Testing the same image that API failed to process ===")
    
    # Copy the image from original_imgs to current directory
    source_image = "images/original_imgs/salon_161414.jpg"
    test_image = "test_salon_161414.jpg"
    
    if os.path.exists(source_image):
        shutil.copy2(source_image, test_image)
        print(f"Copied {source_image} to {test_image}")
        
        # Load YOLO model exactly like notebook
        print("Loading YOLO model...")
        model = YOLO("yolov8x-oiv7.pt")
        print("Model loaded successfully!")
        
        # Test with the copied image
        print(f"Testing with image: {test_image}")
        print(f"File exists: {os.path.exists(test_image)}")
        print(f"File size: {os.path.getsize(test_image)} bytes")
        
        try:
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
                
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            import traceback
            traceback.print_exc()
            
        # Clean up
        if os.path.exists(test_image):
            os.remove(test_image)
            print(f"Cleaned up {test_image}")
    else:
        print(f"Source image not found: {source_image}")

if __name__ == "__main__":
    test_same_image()
