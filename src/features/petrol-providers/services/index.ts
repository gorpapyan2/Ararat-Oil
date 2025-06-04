// Modern centralized services approach
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import { petrolProvidersApi } from "@/services/api";
import type { PetrolProvider as ApiPetrolProvider } from "@/core/api/types";
import type {
  PetrolProvider,
  PetrolProviderFormData,
  PetrolProviderFilters,
  PetrolProviderSummary,
} from "../types/petrol-providers.types";

// Modern hook-based approach
export const usePetrolProviders = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<ApiPetrolProvider>('petrol_providers', options);

// Re-export for backward compatibility
export { useCentralizedEntity } from "@/hooks/useCentralizedEntity";

// Helper function to adapt API provider to feature type
function adaptApiToFeatureType(apiProvider: ApiPetrolProvider): PetrolProvider {
  return {
    id: apiProvider.id,
    name: apiProvider.name,
    contact_person: apiProvider.contact_person,
    phone: apiProvider.phone || "",
    email: apiProvider.email || "",
    address: apiProvider.address || "",
    tax_id: "", // Not in API type, providing default
    bank_account: "", // Not in API type, providing default
    notes: "", // Not in API type, providing default
    created_at: apiProvider.created_at || "",
    updated_at: apiProvider.updated_at || "",
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(providerData: PetrolProviderFormData) {
  return {
    name: providerData.name,
    contact_person: providerData.contact_person,
    email: providerData.email,
    phone: providerData.phone,
    address: providerData.address,
    status: "active" as const,
  };
}

/**
 * Get all petrol providers with optional filters
 */
export async function getProviders(filters?: PetrolProviderFilters): Promise<PetrolProvider[]> {
  try {
    const response = await petrolProvidersApi.getAll();
    if (response.error) {
      throw new Error(response.error);
    }
    
    let providers = (response.data || []).map(adaptApiToFeatureType);

    // Apply client-side filtering if filters provided
    if (filters?.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      providers = providers.filter(
        (provider) =>
          provider.name.toLowerCase().includes(query) ||
          provider.contact_person.toLowerCase().includes(query) ||
          provider.email.toLowerCase().includes(query)
      );
    }

    return providers;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch providers');
  }
}

/**
 * Create a new petrol provider
 */
export async function createProvider(providerData: PetrolProviderFormData): Promise<PetrolProvider> {
  try {
    const apiData = adaptFeatureTypeToApiRequest(providerData);
    const response = await petrolProvidersApi.create(apiData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return adaptApiToFeatureType(response.data!);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create provider');
  }
}

/**
 * Update an existing petrol provider
 */
export async function updateProvider(
  id: string,
  providerData: Partial<PetrolProviderFormData>
): Promise<PetrolProvider> {
  try {
    const apiData: Record<string, unknown> = {};

    if (providerData.name !== undefined) apiData.name = providerData.name;
    if (providerData.contact_person !== undefined) apiData.contact_person = providerData.contact_person;
    if (providerData.email !== undefined) apiData.email = providerData.email;
    if (providerData.phone !== undefined) apiData.phone = providerData.phone;
    if (providerData.address !== undefined) apiData.address = providerData.address;

    const response = await petrolProvidersApi.update(id, apiData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return adaptApiToFeatureType(response.data!);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update provider');
  }
}

/**
 * Delete a petrol provider
 */
export async function deleteProvider(id: string): Promise<boolean> {
  try {
    const response = await petrolProvidersApi.delete(id);
    return !response.error;
  } catch (error) {
    console.error('Error deleting provider:', error);
    return false;
  }
}

/**
 * Get petrol providers summary statistics
 */
export async function getSummary(): Promise<PetrolProviderSummary> {
  try {
    const providers = await getProviders();
    
    return {
      totalProviders: providers.length,
      activeProviders: providers.length, // All fetched providers are active
      recentProviders: 0, // Would need additional API endpoint for this
    };
  } catch (error) {
    console.error("Error calculating provider summary:", error);
    return {
      totalProviders: 0,
      activeProviders: 0,
      recentProviders: 0,
    };
  }
}

// Export as an object for compatibility with existing code
export const petrolProvidersService = {
  getProviders,
  createProvider,
  updateProvider,
  deleteProvider,
  getSummary,
}; 