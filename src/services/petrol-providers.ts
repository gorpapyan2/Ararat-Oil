import { petrolProvidersApi } from "@/services/api";
import { PetrolProvider } from "@/types";

export interface CreateProviderRequest {
  name: string;
  contact: string;
  is_active: boolean;
}

export interface UpdateProviderRequest {
  name?: string;
  contact?: string;
  is_active?: boolean;
}

/**
 * Fetches all petrol providers from the database
 * @param options Optional parameters for filtering providers
 * @returns Array of petrol providers
 */
export async function fetchPetrolProviders(options: { activeOnly?: boolean } = {}): Promise<PetrolProvider[]> {
  try {
    const { data, error } = await petrolProvidersApi.getAll();

    if (error) {
      console.error("Error fetching petrol providers:", error);
      throw new Error(error);
    }

    // Filter active providers only if requested
    if (options.activeOnly) {
      return (data || []).filter(provider => provider.is_active);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch petrol providers:", err);
    throw err;
  }
}

export async function fetchPetrolProviderById(id: string): Promise<PetrolProvider | null> {
  try {
    const { data, error } = await petrolProvidersApi.getById(id);

    if (error) {
      console.error(`Error fetching petrol provider with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function createPetrolProvider(
  provider: CreateProviderRequest
): Promise<PetrolProvider> {
  try {
    const { data, error } = await petrolProvidersApi.create(provider);

    if (error) {
      console.error("Error creating petrol provider:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create petrol provider:", err);
    throw err;
  }
}

export async function updatePetrolProvider(
  id: string,
  provider: UpdateProviderRequest
): Promise<PetrolProvider> {
  try {
    const { data, error } = await petrolProvidersApi.update(id, provider);

    if (error) {
      console.error(`Error updating petrol provider with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function deletePetrolProvider(id: string): Promise<void> {
  try {
    const { error } = await petrolProvidersApi.delete(id);

    if (error) {
      console.error(`Error deleting petrol provider with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function createSampleProvider(): Promise<PetrolProvider> {
  const sampleProvider: CreateProviderRequest = {
    name: "Sample Provider",
    contact: "sample@example.com",
    is_active: true
  };
  return createPetrolProvider(sampleProvider);
}
