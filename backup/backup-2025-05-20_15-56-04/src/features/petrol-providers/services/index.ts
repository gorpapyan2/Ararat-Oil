// Re-export the original service
export * from './petrolProvidersService';

// Import API endpoints
import { petrolProvidersApi } from '@/core/api/endpoints/petrol-providers';
import type { PetrolProvider as ApiPetrolProvider, PetrolProviderCreate, PetrolProviderUpdate } from '@/core/api/types';
import type { 
  PetrolProvider, 
  PetrolProviderFormData, 
  PetrolProviderFilters,
  PetrolProviderSummary
} from '../types/petrol-providers.types';

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiProvider: ApiPetrolProvider): PetrolProvider {
  return {
    id: apiProvider.id,
    name: apiProvider.name,
    contact_person: apiProvider.contact_person,
    phone: apiProvider.phone || '',
    email: apiProvider.email || '',
    address: apiProvider.address || '',
    tax_id: '', // Not in API type, providing default
    bank_account: '', // Not in API type, providing default
    notes: '', // Not in API type, providing default
    created_at: apiProvider.created_at,
    updated_at: apiProvider.updated_at
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(providerData: PetrolProviderFormData): PetrolProviderCreate {
  return {
    name: providerData.name,
    contact_person: providerData.contact_person,
    email: providerData.email,
    phone: providerData.phone,
    address: providerData.address,
    status: 'active' // Default status
  };
}

/**
 * Get all petrol providers with optional filters
 */
export async function getProviders(filters?: PetrolProviderFilters): Promise<PetrolProvider[]> {
  const response = await petrolProvidersApi.getPetrolProviders();
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  let providers = (response.data || []).map(adaptApiResponseToFeatureType);
  
  // Apply client-side filtering if filters provided
  if (filters && filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    providers = providers.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.contact_person.toLowerCase().includes(query) ||
      p.email.toLowerCase().includes(query)
    );
  }
  
  return providers;
}

/**
 * Create a new petrol provider
 */
export async function createProvider(providerData: PetrolProviderFormData): Promise<PetrolProvider> {
  const apiData = adaptFeatureTypeToApiRequest(providerData);
  
  const response = await petrolProvidersApi.createPetrolProvider(apiData);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  if (!response.data) {
    throw new Error('No data returned from API');
  }
  
  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Update an existing petrol provider
 */
export async function updateProvider(id: string, providerData: Partial<PetrolProviderFormData>): Promise<PetrolProvider> {
  // For partial updates, we only include the fields that were provided
  const apiData: PetrolProviderUpdate = {};
  
  if (providerData.name !== undefined) apiData.name = providerData.name;
  if (providerData.contact_person !== undefined) apiData.contact_person = providerData.contact_person;
  if (providerData.email !== undefined) apiData.email = providerData.email;
  if (providerData.phone !== undefined) apiData.phone = providerData.phone;
  if (providerData.address !== undefined) apiData.address = providerData.address;
  
  const response = await petrolProvidersApi.updatePetrolProvider(id, apiData);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  if (!response.data) {
    throw new Error('No data returned from API');
  }
  
  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Delete a petrol provider
 */
export async function deleteProvider(id: string): Promise<boolean> {
  const response = await petrolProvidersApi.deletePetrolProvider(id);
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  return response.data?.success || false;
}

/**
 * Get petrol providers summary statistics
 */
export async function getSummary(): Promise<PetrolProviderSummary> {
  try {
    const providers = await getProviders();
    
    // Calculate summary statistics
    return {
      totalProviders: providers.length,
      activeProviders: providers.length, // Assuming all are active
      recentProviders: providers.filter(p => {
        // Providers created in the last 30 days
        const createdDate = new Date(p.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      }).length
    };
  } catch (error) {
    console.error('Error calculating provider summary:', error);
    return {
      totalProviders: 0,
      activeProviders: 0,
      recentProviders: 0
    };
  }
}

// Export as an object for compatibility with existing code
export const petrolProvidersService = {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  getSummary
}; 