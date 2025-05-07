import { supabase } from '@/lib/supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/types/supabase';
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
 * Fetches all petrol providers from the database
 * @param options Optional parameters for filtering providers
 * @returns Array of petrol providers
 */
export async function fetchPetrolProviders(options: FetchPetrolProviderOptions = {}) {
  try {
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    logger.info(`Fetching petrol providers. Offline mode: ${isOffline}`);
    
    // Get auth session directly from Supabase instead of using useAuth
    const { data: { session } } = await supabase.auth.getSession();
    
    // If offline or no session, return mock data
    if (isOffline || !session) {
      logger.info("Using mock petrol providers data for offline mode");
      const providers = [...MOCK_PETROL_PROVIDERS];
      
      // Filter for active providers if requested
      if (options.activeOnly) {
        return providers.filter(provider => provider.is_active);
      }
      
      return providers;
    }
    
    // Simplify the query to avoid TypeScript errors with any
    const { data, error } = await (options.activeOnly 
      // @ts-ignore - Type instantiation is excessively deep
      ? supabase.from("petrol_providers").select("*").eq("is_active", true)
      : supabase.from("petrol_providers").select("*"));
    
    if (error) {
      logger.error(`Failed to fetch petrol providers: ${error.message}`);
      throw new Error(`Failed to fetch petrol providers: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      logger.warn("No petrol providers found in the database");
      return [];
    }
    
    // Transform the data to ensure it matches our expected structure
    const providers: PetrolProvider[] = data.map((provider: any) => ({
      id: provider.id,
      name: provider.name || "",
      contact: provider.contact || "",
      is_active: provider.is_active !== false, // Default to true if undefined
      created_at: provider.created_at || new Date().toISOString(),
    }));
    
    logger.info(`Successfully fetched ${providers.length} petrol providers`);
    return providers;
  } catch (error) {
    logger.error(error instanceof Error ? error : `Error in fetchPetrolProviders: ${error}`);
    throw error;
  }
}

export async function createPetrolProvider(
  provider: Omit<PetrolProvider, "id" | "created_at" | "updated_at">,
) {
  const { data, error } = await supabase
    .from("petrol_providers")
    .insert(provider)
    .select()
    .single();

  if (error) throw error;
  return data as PetrolProvider;
}

export async function updatePetrolProvider(
  id: string,
  provider: Partial<PetrolProvider>,
) {
  const { data, error } = await supabase
    .from("petrol_providers")
    .update(provider)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as PetrolProvider;
}

export async function deletePetrolProvider(id: string) {
  const { error } = await supabase
    .from("petrol_providers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Creates a sample petrol provider in the database
 * Useful for testing or when no providers exist
 * @returns The created provider
 */
export async function createSampleProvider() {
  try {
    logger.info("Creating sample petrol provider");
    
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    
    // If offline, return a mock provider
    if (isOffline) {
      logger.info("Offline mode: Returning mock sample provider");
      return MOCK_PETROL_PROVIDERS[0];
    }
    
    const { data, error } = await supabase
      .from("petrol_providers")
      .insert({
        name: "Sample Provider",
        contact: "+374 99 123456",
        is_active: true,
      })
      .select()
      .single();
    
    if (error) {
      logger.error(`Failed to create sample provider: ${error.message}`);
      throw new Error(`Failed to create sample provider: ${error.message}`);
    }
    
    if (!data) {
      logger.error("No data returned after creating sample provider");
      throw new Error("Failed to create sample provider: No data returned");
    }
    
    logger.info("Sample provider created successfully");
    return data;
  } catch (error) {
    logger.error(error instanceof Error ? error : `Error in createSampleProvider: ${error}`);
    throw error;
  }
}
