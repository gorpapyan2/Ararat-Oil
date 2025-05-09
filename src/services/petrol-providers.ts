import { supabase } from '@/lib/supabase';
import logger from "@/services/logger";

// Export the PetrolProvider type
export interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

// Mock data for offline mode
const MOCK_PETROL_PROVIDERS: PetrolProvider[] = [
  {
    id: "offline-provider-1",
    name: "Offline Petrol Provider 1",
    contact: "+374 91 123456",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  },
  {
    id: "offline-provider-2",
    name: "Offline Petrol Provider 2",
    contact: "+374 93 987654",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_active: true
  }
];

// Options for fetching petrol providers
interface FetchPetrolProviderOptions {
  activeOnly?: boolean;
}

/**
 * Convert any response to a PetrolProvider safely
 */
function toProviderModel(data: any): PetrolProvider {
  return {
    id: data?.id || "unknown-id",
    name: data?.name || "",
    contact: data?.contact || "",
    is_active: data?.is_active !== false, // Default to true if undefined
    created_at: data?.created_at || new Date().toISOString(),
    updated_at: data?.updated_at || new Date().toISOString()
  };
}

/**
 * Fetches all petrol providers from the database
 * @param options Optional parameters for filtering providers
 * @returns Array of petrol providers
 */
export async function fetchPetrolProviders(options: FetchPetrolProviderOptions = {}): Promise<PetrolProvider[]> {
  try {
    // Check if we're offline (browser-only check)
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Fetching petrol providers. Offline mode: ${isOffline}`);
    
    // Get auth session directly from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    
    // If offline or no session, return mock data
    if (isOffline || !session) {
      console.log("Using mock petrol providers data");
      const providers = [...MOCK_PETROL_PROVIDERS];
      
      // Filter for active providers if requested
      if (options.activeOnly) {
        return providers.filter(provider => provider.is_active);
      }
      
      return providers;
    }
    
    // Check if the table exists by trying to count records
    try {
      const { count, error } = await (supabase as any)
        .from('petrol_providers')
        .select('*', { count: 'exact', head: true });
        
      if (error || count === null) {
        console.warn('Error checking petrol providers table, returning mock data');
        return [...MOCK_PETROL_PROVIDERS];
      }
    } catch (err) {
      console.warn('Error accessing petrol providers table, returning mock data');
      return [...MOCK_PETROL_PROVIDERS];
    }
    
    // Use type assertion to handle the query
    const query = options.activeOnly 
      ? (supabase as any).from('petrol_providers').select('*').eq('is_active', true)
      : (supabase as any).from('petrol_providers').select('*');
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Failed to fetch petrol providers: ${error.message}`);
      return [...MOCK_PETROL_PROVIDERS];
    }
    
    if (!data || data.length === 0) {
      console.warn("No petrol providers found in the database");
      return [];
    }
    
    // Transform the data to ensure it matches our expected structure
    const providers: PetrolProvider[] = data.map((provider: any) => toProviderModel(provider));
    
    console.log(`Successfully fetched ${providers.length} petrol providers`);
    return providers;
  } catch (error) {
    console.error("Error in fetchPetrolProviders:", error);
    // Return mock data as fallback when there's an error
    return [...MOCK_PETROL_PROVIDERS];
  }
}

export async function createPetrolProvider(
  provider: Omit<PetrolProvider, "id" | "created_at" | "updated_at">,
): Promise<PetrolProvider> {
  try {
    // Use type assertion to handle the operation
    const { data, error } = await (supabase as any)
      .from("petrol_providers")
      .insert(provider)
      .select();

    if (error) throw error;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned after creating provider");
    }
    
    return toProviderModel(data[0]);
  } catch (error) {
    console.error("Error creating petrol provider:", error);
    throw error;
  }
}

export async function updatePetrolProvider(
  id: string,
  provider: Partial<PetrolProvider>,
): Promise<PetrolProvider> {
  try {
    // Use type assertion to handle the operation
    const { data, error } = await (supabase as any)
      .from("petrol_providers")
      .update(provider)
      .eq("id", id)
      .select();

    if (error) throw error;
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No data returned after updating provider");
    }
    
    return toProviderModel(data[0]);
  } catch (error) {
    console.error("Error updating petrol provider:", error);
    throw error;
  }
}

export async function deletePetrolProvider(id: string): Promise<void> {
  try {
    // Use type assertion to handle the operation
    const { error } = await (supabase as any)
      .from("petrol_providers")
      .delete()
      .eq("id", id);

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting petrol provider:", error);
    throw error;
  }
}

/**
 * Creates a sample petrol provider in the database
 * Useful for testing or when no providers exist
 * @returns The created provider
 */
export async function createSampleProvider(): Promise<PetrolProvider> {
  try {
    console.log("Creating sample petrol provider");
    
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // If offline, return a mock provider
    if (isOffline) {
      console.log("Offline mode: Returning mock sample provider");
      return MOCK_PETROL_PROVIDERS[0];
    }
    
    // Use type assertion to handle the operation
    const { data, error } = await (supabase as any)
      .from("petrol_providers")
      .insert({
        name: "Sample Provider",
        contact: "+374 99 123456",
        is_active: true,
      })
      .select();
    
    if (error) {
      console.error(`Failed to create sample provider: ${error.message}`);
      return MOCK_PETROL_PROVIDERS[0];
    }
    
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("No data returned after creating sample provider");
      return MOCK_PETROL_PROVIDERS[0];
    }
    
    console.log("Sample provider created successfully");
    return toProviderModel(data[0]);
  } catch (error) {
    console.error("Error in createSampleProvider:", error);
    // Return mock data as fallback
    return MOCK_PETROL_PROVIDERS[0];
  }
}
