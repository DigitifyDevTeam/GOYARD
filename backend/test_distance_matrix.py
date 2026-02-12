#!/usr/bin/env python3
"""
Test script for Google Distance Matrix API between two addresses.
Run from backend folder: python test_distance_matrix.py
Or with addresses: python test_distance_matrix.py "Paris, France" "Lyon, France"
"""
import json
import os
import sys
import urllib.parse
import urllib.request

# Same key as in settings (or set GOOGLE_MAPS_API_KEY in env)
API_KEY = os.environ.get(
    "GOOGLE_MAPS_API_KEY",
    "AIzaSyBxtvdAKLEDoTLkVew4B2eFlH79SgYcHtU",
)


def get_distance_matrix(origin: str, destination: str) -> dict:
    """Call Google Distance Matrix API and return raw JSON response."""
    params = {
        "origins": origin,
        "destinations": destination,
        "key": API_KEY,
        "mode": "driving",
        "units": "metric",
        "language": "fr",
    }
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?" + urllib.parse.urlencode(
        params
    )
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def main():
    if len(sys.argv) >= 3:
        origin = sys.argv[1]
        destination = sys.argv[2]
    else:
        print("Distance Matrix API test – enter two addresses.\n")
        origin = input("Origin address (e.g. Paris, France): ").strip()
        destination = input("Destination address (e.g. Lyon, France): ").strip()

    if not origin or not destination:
        print("Error: both origin and destination are required.")
        sys.exit(1)

    print(f"\nOrigin:      {origin}")
    print(f"Destination: {destination}")
    print("\nCalling Google Distance Matrix API...\n")

    try:
        data = get_distance_matrix(origin, destination)
    except Exception as e:
        print(f"Request failed: {e}")
        sys.exit(1)

    status = data.get("status", "")
    if status != "OK":
        print(f"API status: {status}")
        print(data.get("error_message", ""))
        print("\nFull response:", json.dumps(data, indent=2, ensure_ascii=False))
        sys.exit(1)

    rows = data.get("rows", [])
    if not rows:
        print("No rows in response.")
        print(json.dumps(data, indent=2, ensure_ascii=False))
        sys.exit(1)

    element = rows[0].get("elements", [{}])[0]
    elem_status = element.get("status", "")

    if elem_status != "OK":
        print(f"Element status: {elem_status}")
        print("\nFull response:", json.dumps(data, indent=2, ensure_ascii=False))
        sys.exit(1)

    distance = element.get("distance", {})
    duration = element.get("duration", {})

    print("--- Result ---")
    print(f"Distance: {distance.get('text', 'N/A')}  (value: {distance.get('value')} m)")
    print(f"Duration: {duration.get('text', 'N/A')}")
    distance_km = (distance.get("value") or 0) / 1000
    print(f"Distance (km): {distance_km:.2f}")
    print("\n--- Full API response ---")
    print(json.dumps(data, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
