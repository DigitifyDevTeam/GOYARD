/**
 * Custom React Hook for Address API
 */

import { useState, useCallback } from 'react';
import {
  createAddress,
  getAddress,
  getAddressByClient,
  listAddresses,
  updateAddress,
  deleteAddress,
  AddressData,
  ApiResponse,
  AddressListResponse,
} from '@/services/addressApi';

interface UseAddressReturn {
  // State
  loading: boolean;
  error: string | null;
  address: AddressData | null;
  addresses: AddressData[];
  
  // Actions
  create: (addressData: Omit<AddressData, 'id' | 'created_at' | 'updated_at'>) => Promise<AddressData | null>;
  fetchById: (id: number) => Promise<AddressData | null>;
  fetchByClient: (clientId: number) => Promise<AddressData | null>;
  fetchAll: (clientId?: number) => Promise<AddressData[]>;
  update: (id: number, data: Partial<AddressData>, partial?: boolean) => Promise<AddressData | null>;
  remove: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useAddress = (): UseAddressReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [addresses, setAddresses] = useState<AddressData[]>([]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Create a new address
   */
  const create = useCallback(async (addressData: Omit<AddressData, 'id' | 'created_at' | 'updated_at'>): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await createAddress(addressData);
      
      if (response.success && response.data) {
        setAddress(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to create address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch address by ID
   */
  const fetchById = useCallback(async (id: number): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAddress(id);
      
      if (response.success && response.data) {
        setAddress(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch address by client ID
   */
  const fetchByClient = useCallback(async (clientId: number): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAddressByClient(clientId);
      
      if (response.success && response.data) {
        setAddress(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch client address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch all addresses (optionally filtered by client)
   */
  const fetchAll = useCallback(async (clientId?: number): Promise<AddressData[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await listAddresses(clientId);
      
      if (response.success && response.data) {
        setAddresses(response.data);
        return response.data;
      } else {
        throw new Error('Failed to fetch addresses');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update an address
   */
  const update = useCallback(async (
    id: number,
    data: Partial<AddressData>,
    partial: boolean = true
  ): Promise<AddressData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateAddress(id, data, partial);
      
      if (response.success && response.data) {
        setAddress(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to update address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Delete an address
   */
  const remove = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteAddress(id);
      
      if (response.success) {
        setAddress(null);
        return true;
      } else {
        throw new Error(response.message || 'Failed to delete address');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    address,
    addresses,
    create,
    fetchById,
    fetchByClient,
    fetchAll,
    update,
    remove,
    clearError,
  };
};

