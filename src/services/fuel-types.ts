import { supabase } from "@/services/supabase";

export interface FuelType {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Type definition for creating a new fuel type
export interface CreateFuelTypeRequest {
  code: string;
  name: string;
  is_active?: boolean;
}

// Type definition for updating a fuel type
export interface UpdateFuelTypeRequest {
  name?: string;
  is_active?: boolean;
}

/**
 * Fetch all fuel types
 * @returns Array of fuel types
 */
export async function fetchFuelTypes(): Promise<FuelType[]> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching fuel types:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch fuel types:", err);
    throw err;
  }
}

/**
 * Fetch active fuel types
 * @returns Array of active fuel types
 */
export async function fetchActiveFuelTypes(): Promise<FuelType[]> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching active fuel types:", error);
      throw error;
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch active fuel types:", err);
    throw err;
  }
}

/**
 * Fetch a single fuel type by ID
 * @param id Fuel type ID
 * @returns Fuel type or null if not found
 */
export async function fetchFuelTypeById(id: string): Promise<FuelType | null> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching fuel type with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Failed to fetch fuel type with ID ${id}:`, err);
    throw err;
  }
}

/**
 * Create a new fuel type
 * @param fuelType Fuel type data to create
 * @returns Created fuel type
 */
export async function createFuelType(fuelType: CreateFuelTypeRequest): Promise<FuelType> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .insert([fuelType])
      .select()
      .single();

    if (error) {
      console.error("Error creating fuel type:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Failed to create fuel type:", err);
    throw err;
  }
}

/**
 * Update an existing fuel type
 * @param id Fuel type ID to update
 * @param updates Updates to apply
 * @returns Updated fuel type
 */
export async function updateFuelType(id: string, updates: UpdateFuelTypeRequest): Promise<FuelType> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating fuel type with ID ${id}:`, error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`Failed to update fuel type with ID ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a fuel type
 * @param id Fuel type ID to delete
 * @returns void
 */
export async function deleteFuelType(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("fuel_types")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(`Error deleting fuel type with ID ${id}:`, error);
      throw error;
    }
  } catch (err) {
    console.error(`Failed to delete fuel type with ID ${id}:`, err);
    throw err;
  }
}

/**
 * Check if a fuel type code is unique
 * @param code The code to check
 * @param excludeId Optional ID to exclude from the check (for updates)
 * @returns True if the code is unique
 */
export async function isFuelTypeCodeUnique(code: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase
      .from("fuel_types")
      .select("id")
      .eq("code", code);
    
    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error checking if fuel type code ${code} is unique:`, error);
      throw error;
    }

    return data.length === 0;
  } catch (err) {
    console.error(`Failed to check if fuel type code ${code} is unique:`, err);
    throw err;
  }
} 