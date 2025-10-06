#!/usr/bin/env python3
"""
Test script to verify the manual furniture selection API endpoints
"""

import requests
import json

def test_manual_furniture_api():
    """Test the manual furniture selection API endpoints"""
    
    base_url = "http://localhost:8000/api"
    
    print("🧪 Testing Manual Furniture Selection API")
    print("=" * 50)
    
    # Test 1: Get all rooms and their furniture
    print("\n📦 Test 1: Get all rooms and furniture")
    try:
        response = requests.get(f"{base_url}/furniture/all/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {len(data['rooms'])} room types")
            for room_type, room_data in data['rooms'].items():
                print(f"  - {room_type}: {room_data['total_items']} furniture items")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Get furniture for specific room (salon)
    print("\n📦 Test 2: Get furniture for 'salon' room")
    try:
        response = requests.get(f"{base_url}/furniture/room/?room_type=salon")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Found {data['total_items']} furniture items in salon")
            for item in data['furniture'][:3]:  # Show first 3 items
                print(f"  - {item['display_name']}: {item['volume']}m³")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Calculate quote for manual selection
    print("\n📦 Test 3: Calculate quote for manual selection")
    try:
        selected_furniture = {
            "Chaise": 4,
            "Table basse": 1,
            "Canapé 3 places (-80KG)": 1,
            "Télevision": 1
        }
        
        response = requests.post(
            f"{base_url}/furniture/calculate/",
            json={"selected_furniture": selected_furniture},
            headers={"Content-Type": "application/json"}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: Quote calculated")
            print(f"  - Total objects: {data['total_objects']}")
            print(f"  - Total volume: {data['volume_calculation']['total_volume']}m³")
            print(f"  - Final price: {data['quote_calculation']['final_price']}€")
            print(f"  - Summary: {data['summary']}")
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    print("\n✅ Manual furniture API tests completed!")

if __name__ == "__main__":
    test_manual_furniture_api()
