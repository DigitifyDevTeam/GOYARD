"""
HMAC client access tokens for quote-funnel APIs.

Issued when a client record is created; required to read or mutate that client's data.
"""
import hashlib
import hmac
from typing import Optional

from django.conf import settings
from rest_framework import status
from rest_framework.response import Response

CLIENT_TOKEN_HEADER = 'HTTP_X_CLIENT_ACCESS_TOKEN'


def make_client_access_token(client_id: int) -> str:
    key = settings.SECRET_KEY.encode('utf-8')
    msg = f'client-access:{int(client_id)}'.encode('utf-8')
    return hmac.new(key, msg, hashlib.sha256).hexdigest()


def get_token_from_request(request) -> str:
    header_token = request.META.get(CLIENT_TOKEN_HEADER, '')
    if header_token:
        return str(header_token).strip()
    query_token = request.GET.get('access_token', '')
    if query_token:
        return str(query_token).strip()
    data = getattr(request, 'data', None)
    if isinstance(data, dict):
        body_token = data.get('access_token')
        if body_token:
            return str(body_token).strip()
    return ''


def verify_client_access_token(client_id, token: Optional[str]) -> bool:
    if client_id is None or not token:
        return False
    try:
        cid = int(client_id)
    except (TypeError, ValueError):
        return False
    expected = make_client_access_token(cid)
    return hmac.compare_digest(expected, token.strip())


def is_staff_request(request) -> bool:
    user = getattr(request, 'user', None)
    return bool(user and user.is_authenticated and user.is_staff)


def client_access_denied():
    return Response(
        {'success': False, 'message': 'Accès non autorisé'},
        status=status.HTTP_403_FORBIDDEN,
    )


def require_client_access(request, client_id) -> Optional[Response]:
    """
    Return None if the request may access this client_id; otherwise a 403 Response.
    Staff users bypass the token check.
    """
    if is_staff_request(request):
        return None
    token = get_token_from_request(request)
    if verify_client_access_token(client_id, token):
        return None
    return client_access_denied()
