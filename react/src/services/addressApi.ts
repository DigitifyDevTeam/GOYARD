/**
 * Address API Service
 * Handles all API calls related to addresses
 */

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Types
export interface AddressOptions {
  monte_meuble?: boolean;
  cave_ou_garage?: boolean;
  cours_a_traverser?: boolean;
}

export interface AddressData {
  id?: number;
  client_info: number;
  adresse_depart: string;
  etage_depart: string;
  ascenseur_depart: string;
  options_depart: AddressOptions;
  has_stopover: boolean;
  escale_adresse?: string;
  escale_etage?: string;
  escale_ascenseur?: string;
  escale_options?: AddressOptions;
  adresse_arrivee: string;
  etage_arrivee: string;
  ascenseur_arrivee: string;
  options_arrivee: AddressOptions;
  created_at?: string;
  updated_at?: string;
  etage_choices?: string[];
  ascenseur_choices?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AddressListResponse {
  success: boolean;
  count: number;
  data: AddressData[];
}

/**
 * Create a new address
 */
export const createAddress = async (addressData: Omit<AddressData, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<AddressData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demenagement/address/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create address');
    }

    return data;
  } catch (error) {
    console.error('Error creating address:', error);
    throw error;
  }
};

/**
 * Get address by ID
 */
export const getAddress = async (addressId: number): Promise<ApiResponse<AddressData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demenagement/address/${addressId}/`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch address');
    }

    return data;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw error;
  }
};

/**
 * Get address by client ID
 */
export const getAddressByClient = async (clientId: number): Promise<ApiResponse<AddressData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demenagement/address/client/${clientId}/`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch client address');
    }

    return data;
  } catch (error) {
    console.error('Error fetching client address:', error);
    throw error;
  }
};

/**
 * List all addresses (optionally filtered by client)
 */
export const listAddresses = async (clientId?: number): Promise<AddressListResponse> => {
  try {
    const url = clientId 
      ? `${API_BASE_URL}/api/demenagement/addresses/?client_id=${clientId}`
      : `${API_BASE_URL}/api/demenagement/addresses/`;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch addresses');
    }

    return data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

/**
 * Update an existing address
 */
export const updateAddress = async (
  addressId: number, 
  addressData: Partial<Omit<AddressData, 'id' | 'created_at' | 'updated_at'>>,
  partial: boolean = true
): Promise<ApiResponse<AddressData>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demenagement/address/${addressId}/update/`, {
      method: partial ? 'PATCH' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update address');
    }

    return data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

/**
 * Delete an address
 */
export const deleteAddress = async (addressId: number): Promise<ApiResponse<{ client_info_id: number }>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/demenagement/address/${addressId}/delete/`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete address');
    }

    return data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

/**
 * Constants for form choices
 */
export const ETAGE_CHOICES = [
  'RDC', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'
];

export const ASCENSEUR_CHOICES = [
  'Non',
  '2-3 personnes',
  '3-4 personnes',
  '4-6 personnes',
  '6-8 personnes ou plus'
];

export const OPTIONS_KEYS = [
  'monte_meuble',
  'cave_ou_garage',
  'cours_a_traverser'
];

