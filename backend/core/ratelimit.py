"""Simple IP-based rate limiting via Django cache."""
from typing import Optional

from django.core.cache import cache
from django.http import JsonResponse
from rest_framework import status
from rest_framework.response import Response


def _client_ip(request) -> str:
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', 'unknown')


def _is_rate_limited(request, scope: str, limit: int, window_seconds: int) -> bool:
    key = f'ratelimit:{scope}:{_client_ip(request)}'
    count = cache.get(key, 0)
    if count >= limit:
        return True
    cache.set(key, count + 1, timeout=window_seconds)
    return False


def enforce_rate_limit(request, scope: str, limit: int = 60, window_seconds: int = 3600) -> Optional[Response]:
    if _is_rate_limited(request, scope, limit, window_seconds):
        return Response(
            {'success': False, 'message': 'Trop de requêtes. Réessayez plus tard.'},
            status=status.HTTP_429_TOO_MANY_REQUESTS,
        )
    return None


def enforce_rate_limit_json(request, scope: str, limit: int = 60, window_seconds: int = 3600) -> Optional[JsonResponse]:
    if _is_rate_limited(request, scope, limit, window_seconds):
        return JsonResponse(
            {'success': False, 'message': 'Trop de requêtes. Réessayez plus tard.'},
            status=429,
        )
    return None
