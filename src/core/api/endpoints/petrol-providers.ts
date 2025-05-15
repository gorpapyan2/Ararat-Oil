/**
 * Petrol Providers API
 * 
 * This file provides API functions for working with petrol providers data.
 */

import { fetchFromFunction, ApiResponse } from '../client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { PetrolProvider, PetrolProviderCreate, PetrolProviderUpdate } from '../types';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.PETROL_PROVIDERS;

/**
 * Fetches all petrol providers
 */
export async function getPetrolProviders(): Promise<ApiResponse<PetrolProvider[]>> {
  return fetchFromFunction<PetrolProvider[]>(ENDPOINT);
}

/**
 * Fetches a petrol provider by ID
 */
export async function getPetrolProviderById(id: string): Promise<ApiResponse<PetrolProvider>> {
  return fetchFromFunction<PetrolProvider>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new petrol provider
 */
export async function createPetrolProvider(data: PetrolProviderCreate): Promise<ApiResponse<PetrolProvider>> {
  return fetchFromFunction<PetrolProvider>(ENDPOINT, {
    method: 'POST',
    body: data
  });
}

/**
 * Updates a petrol provider by ID
 */
export async function updatePetrolProvider(
  id: string, 
  data: PetrolProviderUpdate
): Promise<ApiResponse<PetrolProvider>> {
  return fetchFromFunction<PetrolProvider>(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    body: data
  });
}

/**
 * Deletes a petrol provider by ID
 */
export async function deletePetrolProvider(id: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Petrol providers API object with all methods
 */
export const petrolProvidersApi = {
  getAll: getPetrolProviders,
  getById: getPetrolProviderById,
  create: createPetrolProvider,
  update: updatePetrolProvider,
  delete: deletePetrolProvider
}; 