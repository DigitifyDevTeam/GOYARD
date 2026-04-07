#!/usr/bin/env python3
"""
Test with the image that we know works from the notebook
"""
import os
from ultralytics import YOLO

def test_working_image():
    print("=== Testing with the image that works in notebook ===")
    
    # Test with the image that we know works
    test_image = "5a2ac49d-7039-43fa-867c-da124c898668.jpeg"
    
    if os.path.exists(test_image):
        print(f"Testing with image: {test_image}")
        print(f"File exists: {os.path.exists(test_image)}")
        print(f"File size: {os.path.getsize(test_image)} bytes")
        
        # Load YOLO model exactly like notebook
        print("Loading YOLO model...")
        model = YOLO("yolov8x-oiv7.pt")
        print("Model loaded successfully!")
        
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
    else:
        print(f"Working image not found: {test_image}")
        print("Available images:")
        for f in os.listdir('.'):
            if f.endswith(('.jpg', '.jpeg', '.png')):
                print(f"  - {f}")

if __name__ == "__main__":
    test_working_image()
