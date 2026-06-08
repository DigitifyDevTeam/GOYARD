const CLIENT_TOKEN_KEY = 'clientAccessToken';

export function storeClientAccessToken(token: string): void {
  localStorage.setItem(CLIENT_TOKEN_KEY, token);
}

export function getClientAccessToken(): string | null {
  return localStorage.getItem(CLIENT_TOKEN_KEY);
}

export function clearClientAccessToken(): void {
  localStorage.removeItem(CLIENT_TOKEN_KEY);
}

/** Merge X-Client-Access-Token into fetch init (header, query, or JSON body). */
export function withClientAccess(init?: RequestInit): RequestInit {
  const token = getClientAccessToken();
  if (!token) {
    return init ?? {};
  }

  const headers = new Headers(init?.headers);
  if (!headers.has('X-Client-Access-Token')) {
    headers.set('X-Client-Access-Token', token);
  }

  return { ...init, headers };
}

export function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  return fetch(input, withClientAccess(init));
}
