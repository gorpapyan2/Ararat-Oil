import { petrolProvidersApi, PetrolProvider, PetrolProviderCreate, PetrolProviderUpdate } from "@/core/api";

export interface CreateProviderRequest {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status: "active" | "inactive";
}

export interface UpdateProviderRequest {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: "active" | "inactive";
}

/**
 * Fetches all petrol providers from the database
 * @param options Optional parameters for filtering providers
 * @returns Array of petrol providers
 */
export async function fetchPetrolProviders(
  options: { activeOnly?: boolean } = {}
): Promise<PetrolProvider[]> {
  try {
    const response = await petrolProvidersApi.getPetrolProviders();

    if (response.error) {
      console.error("Error fetching petrol providers:", response.error);
      throw new Error(response.error.message);
    }

    // Filter active providers only if requested
    if (options.activeOnly) {
      return (response.data || []).filter((provider) => provider.status === "active");
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch petrol providers:", err);
    throw err;
  }
}

export async function fetchPetrolProviderById(
  id: string
): Promise<PetrolProvider | null> {
  try {
    const response = await petrolProvidersApi.getPetrolProviderById(id);

    if (response.error) {
      console.error(
        `Error fetching petrol provider with ID ${id}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function createPetrolProvider(
  provider: CreateProviderRequest
): Promise<PetrolProvider> {
  try {
    const response = await petrolProvidersApi.createPetrolProvider(provider);

    if (response.error) {
      console.error("Error creating petrol provider:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
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
    const response = await petrolProvidersApi.updatePetrolProvider(id, provider);

    if (response.error) {
      console.error(
        `Error updating petrol provider with ID ${id}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to update petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function deletePetrolProvider(id: string): Promise<void> {
  try {
    const response = await petrolProvidersApi.deletePetrolProvider(id);

    if (response.error) {
      console.error(
        `Error deleting petrol provider with ID ${id}:`,
        response.error
      );
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete petrol provider with ID ${id}:`, err);
    throw err;
  }
}

export async function createSampleProvider(): Promise<PetrolProvider> {
  const sampleProvider: CreateProviderRequest = {
    name: "Sample Provider",
    contact_person: "John Doe",
    email: "sample@example.com",
    phone: "+1234567890",
    address: "123 Sample Street",
    status: "active",
  };
  return createPetrolProvider(sampleProvider);
}
