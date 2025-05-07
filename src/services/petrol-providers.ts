import { supabase } from './supabase';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { Database } from '@/types/supabase';

// Export the PetrolProvider type
export interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
}

export async function fetchPetrolProviders(options?: { activeOnly?: boolean }) {
  try {
    // @ts-ignore - Known issue with Supabase types
    let query = supabase
      .from("petrol_providers")
      .select("*")
      .order("name");

    if (options?.activeOnly) {
      query = query.eq("is_active", true);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching petrol providers:", error);
      throw new Error(`Failed to fetch petrol providers: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.warn("No petrol providers found in the database");
      return [];
    }

    // Validate and transform the data
    return data.map(provider => ({
      id: provider.id,
      name: provider.name || "Unnamed Provider",
      contact: provider.contact || "",
      created_at: provider.created_at,
      is_active: provider.is_active ?? true // Default to true if not specified
    }));
  } catch (error) {
    console.error("Exception in fetchPetrolProviders:", error);
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
