"""
Proxy views for Google Maps APIs (Places Autocomplete, Distance Matrix).
Calls Google from the server to avoid CORS when the frontend runs on another origin.
"""
import json
import urllib.request
import urllib.parse
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt


def get_google_api_key():
    return getattr(settings, 'GOOGLE_MAPS_API_KEY', None) or ''


@require_GET
def google_places_autocomplete(request):
    """
    Proxy for Google Places Autocomplete API.
    Query params: input (required), types (optional, default address), language (optional, default fr).
    """
    api_key = get_google_api_key()
    if not api_key:
        return JsonResponse({'predictions': [], 'status': 'REQUEST_DENIED', 'error_message': 'GOOGLE_MAPS_API_KEY not set'}, status=500)

    query_input = request.GET.get('input', '').strip()
    if not query_input or len(query_input) < 2:
        return JsonResponse({'predictions': [], 'status': 'OK'})

    params = {
        'input': query_input,
        'key': api_key,
        'types': request.GET.get('types', 'address'),
        'language': request.GET.get('language', 'fr'),
    }
    url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?' + urllib.parse.urlencode(params)

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse(
            {'predictions': [], 'status': 'ERROR', 'error_message': str(e)},
            status=502
        )


@require_GET
def google_distance_matrix(request):
    """
    Proxy for Google Distance Matrix API.
    Query params: origins (required), destinations (required), mode (optional), units (optional), language (optional).
    """
    api_key = get_google_api_key()
    if not api_key:
        return JsonResponse({'status': 'REQUEST_DENIED', 'error_message': 'GOOGLE_MAPS_API_KEY not set'}, status=500)

    origins = request.GET.get('origins', '').strip()
    destinations = request.GET.get('destinations', '').strip()
    if not origins or not destinations:
        return JsonResponse({'status': 'INVALID_REQUEST', 'error_message': 'origins and destinations required'}, status=400)

    params = {
        'origins': origins,
        'destinations': destinations,
        'key': api_key,
        'mode': request.GET.get('mode', 'driving'),
        'units': request.GET.get('units', 'metric'),
        'language': request.GET.get('language', 'fr'),
    }
    url = 'https://maps.googleapis.com/maps/api/distancematrix/json?' + urllib.parse.urlencode(params)

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode())
        return JsonResponse(data)
    except Exception as e:
        return JsonResponse(
            {'status': 'ERROR', 'error_message': str(e)},
            status=502
        )
