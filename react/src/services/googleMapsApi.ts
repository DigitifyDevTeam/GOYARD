/**
 * Google Maps API service: Places Autocomplete & Distance Matrix
 * Uses backend proxy (/api/google/...) to avoid CORS when calling Google from the browser.
 */

const API_BASE = ''; // relative: same origin → Vite proxy forwards /api to Django

// --- Places API (Autocomplete) ---
export interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text: string;
    secondary_text?: string;
  };
}

interface PlacesAutocompleteResponse {
  predictions?: PlacePrediction[];
  status: string;
  error_message?: string;
}

/**
 * Fetch address predictions via backend proxy (Google Places Autocomplete)
 */
export async function getPlacePredictions(input: string): Promise<PlacePrediction[]> {
  if (!input || input.trim().length < 2) return [];

  const params = new URLSearchParams({
    input: input.trim(),
    types: 'address',
    language: 'fr',
  });

  try {
    const res = await fetch(
      `${API_BASE}/api/google/places-autocomplete/?${params}`
    );
    const data: PlacesAutocompleteResponse = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places Autocomplete error:', data.status, data.error_message);
      return [];
    }
    return data.predictions ?? [];
  } catch (err) {
    console.error('Places Autocomplete fetch error:', err);
    return [];
  }
}

// --- Distance Matrix API ---
interface DistanceMatrixElement {
  status: string;
  distance?: { value: number; text: string };
  duration?: { value: number; text: string };
}

interface DistanceMatrixResponse {
  rows?: Array<{ elements: DistanceMatrixElement[] }>;
  status: string;
  error_message?: string;
}

export interface DistanceResult {
  distanceKm: number;
  distanceText: string;
  durationText?: string;
  success: boolean;
  error?: string;
}

/**
 * Get driving distance (and duration) between two addresses via backend proxy
 * Returns distance in km
 */
export async function getDistanceMatrix(
  origin: string,
  destination: string
): Promise<DistanceResult> {
  if (!origin?.trim() || !destination?.trim()) {
    return {
      distanceKm: 0,
      distanceText: '',
      success: false,
      error: 'Origin and destination are required',
    };
  }

  const params = new URLSearchParams({
    origins: origin.trim(),
    destinations: destination.trim(),
    mode: 'driving',
    units: 'metric',
    language: 'fr',
  });

  try {
    const res = await fetch(
      `${API_BASE}/api/google/distance-matrix/?${params}`
    );
    const data: DistanceMatrixResponse = await res.json();

    if (data.status !== 'OK') {
      return {
        distanceKm: 0,
        distanceText: '',
        success: false,
        error: data.error_message || data.status,
      };
    }

    const element = data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      return {
        distanceKm: 0,
        distanceText: '',
        success: false,
        error: element?.status === 'ZERO_RESULTS' ? 'No route found' : element?.status || 'Unknown error',
      };
    }

    const distanceMeters = element.distance?.value ?? 0;
    const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;

    return {
      distanceKm,
      distanceText: element.distance?.text ?? `${distanceKm} km`,
      durationText: element.duration?.text,
      success: true,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return {
      distanceKm: 0,
      distanceText: '',
      success: false,
      error: msg,
    };
  }
}
