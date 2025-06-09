/**
 * Petrol Providers API
 *
 * This file provides API functions for working with petrol providers data.
 */

import { fetchFromFunction, ApiResponse, createApiError } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import { API_ERROR_TYPE } from "@/core/config/api";
import type {
  PetrolProvider,
  PetrolProviderCreate,
  PetrolProviderUpdate,
} from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.PETROL_PROVIDERS;

// Sample data for development and fallback
const SAMPLE_PROVIDERS: PetrolProvider[] = [
  {
    id: "1",
    name: "Lukoil Armenia",
    contact: "+374 10 123456",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "2",
    name: "Armenia Fuels",
    contact: "+374 10 765432",
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "3",
    name: "CityPetrol",
    contact: "+374 11 556677",
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

/**
 * Fetches all petrol providers
 */
export async function getPetrolProviders(): Promise<ApiResponse<PetrolProvider[]>> {
  try {
    const response = await fetchFromFunction<PetrolProvider[]>(ENDPOINT, {
      cache: "force-cache",
      queryParams: {
        // Cache key that changes every hour (providers don't change often)
        _cache: Math.floor(Date.now() / 3600000)
      }
    });
    
    // If there's an error or no data, return sample data in development
    if (response.error || !response.data || response.data.length === 0) {
      if (import.meta.env.DEV) {
        console.warn('Using sample provider data in development');
        return { data: SAMPLE_PROVIDERS };
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error fetching providers:', error);
    
    // Return sample data in development
    if (import.meta.env.DEV) {
      return { data: SAMPLE_PROVIDERS };
    }
    
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to fetch providers: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Fetches a petrol provider by ID
 */
export async function getPetrolProviderById(
  id: string
): Promise<ApiResponse<PetrolProvider>> {
  try {
    const response = await fetchFromFunction<PetrolProvider>(`${ENDPOINT}/${id}`);
    
    // If there's an error or no data, return sample data in development
    if (response.error || !response.data) {
      if (import.meta.env.DEV) {
        const sampleProvider = SAMPLE_PROVIDERS.find(p => p.id === id);
        if (sampleProvider) {
          return { data: sampleProvider };
        }
      }
    }
    
    return response;
  } catch (error) {
    console.error(`Error fetching provider ${id}:`, error);
    
    // Return sample data in development
    if (import.meta.env.DEV) {
      const sampleProvider = SAMPLE_PROVIDERS.find(p => p.id === id);
      if (sampleProvider) {
        return { data: sampleProvider };
      }
    }
    
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to fetch provider: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Creates a new petrol provider
 */
export async function createPetrolProvider(
  data: PetrolProviderCreate
): Promise<ApiResponse<PetrolProvider>> {
  try {
    // Fix schema mismatch - map contact_info to contact if needed
    const adaptedData = {
      ...data,
      // If data has contact_info but no contact field, use contact_info as contact
      contact: data.contact || data.contact_info,
    };
    
    // Remove contact_info to prevent schema validation errors
    if ('contact_info' in adaptedData) {
      delete adaptedData.contact_info;
    }
    
    const response = await fetchFromFunction<PetrolProvider>(ENDPOINT, {
      method: "POST",
      body: adaptedData,
    });
    
    // If there's an error or we're in development, simulate success
    if (response.error || import.meta.env.DEV) {
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Simulating successful provider creation');
        return {
          data: {
            id: `dev-${Date.now()}`,
            name: data.name,
            contact: data.contact || data.contact_info || '',
            is_active: data.is_active || true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error creating provider:', error);
    
    // Return simulated success in development
    if (import.meta.env.DEV) {
      return {
        data: {
          id: `dev-${Date.now()}`,
          name: data.name,
          contact: data.contact || data.contact_info || '',
          is_active: data.is_active || true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }
    
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to create provider: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Updates a petrol provider by ID
 */
export async function updatePetrolProvider(
  id: string,
  data: PetrolProviderUpdate
): Promise<ApiResponse<PetrolProvider>> {
  try {
    // Fix schema mismatch - map contact_info to contact if needed
    const adaptedData = {
      ...data,
      // If data has contact_info but no contact field, use contact_info as contact
      contact: data.contact || data.contact_info,
    };
    
    // Remove contact_info to prevent schema validation errors
    if ('contact_info' in adaptedData) {
      delete adaptedData.contact_info;
    }
    
    const response = await fetchFromFunction<PetrolProvider>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: adaptedData,
    });
    
    // If there's an error or we're in development, simulate success
    if (response.error || import.meta.env.DEV) {
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Simulating successful provider update');
        return {
          data: {
            id,
            name: data.name || 'Updated Provider',
            contact: data.contact || data.contact_info || '',
            is_active: data.is_active !== undefined ? data.is_active : true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        };
      }
    }
    
    return response;
  } catch (error) {
    console.error(`Error updating provider ${id}:`, error);
    
    // Return simulated success in development
    if (import.meta.env.DEV) {
      return {
        data: {
          id,
          name: data.name || 'Updated Provider',
          contact: data.contact || data.contact_info || '',
          is_active: data.is_active !== undefined ? data.is_active : true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }
    
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to update provider: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Deletes a petrol provider by ID
 */
export async function deletePetrolProvider(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    const response = await fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    });
    
    // If there's an error or we're in development, simulate success
    if (response.error || import.meta.env.DEV) {
      if (import.meta.env.DEV) {
        console.log('DEV MODE: Simulating successful provider deletion');
        return { data: { success: true } };
      }
    }
    
    return response;
  } catch (error) {
    console.error(`Error deleting provider ${id}:`, error);
    
    // Return simulated success in development
    if (import.meta.env.DEV) {
      return { data: { success: true } };
    }
    
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to delete provider: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Petrol providers API object with all methods
 */
export const petrolProvidersApi = {
  getPetrolProviders,
  getPetrolProviderById,
  createPetrolProvider,
  updatePetrolProvider,
  deletePetrolProvider,
};
