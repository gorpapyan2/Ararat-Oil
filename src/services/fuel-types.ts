import { fuelTypesApi } from "@/services/api";

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
  code?: string;
  is_active?: boolean;
}

/**
 * Fetch all fuel types
 * @returns Array of fuel types
 */
export async function fetchFuelTypes(): Promise<FuelType[]> {
  try {
    const { data, error } = await fuelTypesApi.getAll();

    if (error) {
      console.error("Error fetching fuel types:", error);
      throw new Error(error);
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
    const { data, error } = await fuelTypesApi.getActive();

    if (error) {
      console.error("Error fetching active fuel types:", error);
      throw new Error(error);
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
    const { data, error } = await fuelTypesApi.getById(id);

    if (error) {
      console.error(`Error fetching fuel type with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
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
    const { data, error } = await fuelTypesApi.create(fuelType);

    if (error) {
      console.error("Error creating fuel type:", error);
      throw new Error(error);
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
    const { data, error } = await fuelTypesApi.update(id, updates);

    if (error) {
      console.error(`Error updating fuel type with ID ${id}:`, error);
      throw new Error(error);
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
    const { error } = await fuelTypesApi.delete(id);

    if (error) {
      console.error(`Error deleting fuel type with ID ${id}:`, error);
      throw new Error(error);
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
 * 
 * Note: This function now relies on the server-side validation in our Edge Function.
 * If a fuel type with the same code exists, the create or update operation will fail
 * with an appropriate error message.
 */
export async function isFuelTypeCodeUnique(code: string, excludeId?: string): Promise<boolean> {
  try {
    const { data: fuelTypes } = await fuelTypesApi.getAll();
    
    if (!fuelTypes) return true;
    
    // Check if any fuel type (except the one being excluded) has this code
    return !fuelTypes.some(ft => 
      ft.code === code && (!excludeId || ft.id !== excludeId)
    );
  } catch (err) {
    console.error(`Failed to check if fuel type code ${code} is unique:`, err);
    throw err;
  }
} 