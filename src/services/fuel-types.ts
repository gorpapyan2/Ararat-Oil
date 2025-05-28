import {
  fuelTypesApi,
  FuelType,
  FuelTypeCreate,
  FuelTypeUpdate,
} from "@/core/api";

/**
 * Fetch all fuel types
 * @returns Array of fuel types
 */
export async function fetchFuelTypes(): Promise<FuelType[]> {
  try {
    const response = await fuelTypesApi.getAll();

    if (response.error) {
      console.error("Error fetching fuel types:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
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
    const response = await fuelTypesApi.getAll();

    if (response.error) {
      console.error("Error fetching active fuel types:", response.error);
      throw new Error(response.error.message);
    }

    // Filter active fuel types
    return (response.data || []).filter((type) => type.status === "active");
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
    const response = await fuelTypesApi.getById(id);

    if (response.error) {
      console.error(`Error fetching fuel type with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
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
export async function createFuelType(
  fuelType: FuelTypeCreate
): Promise<FuelType> {
  try {
    const response = await fuelTypesApi.create(fuelType);

    if (response.error) {
      console.error("Error creating fuel type:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
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
export async function updateFuelType(
  id: string,
  updates: FuelTypeUpdate
): Promise<FuelType> {
  try {
    const response = await fuelTypesApi.update(id, updates);

    if (response.error) {
      console.error(`Error updating fuel type with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
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
    const response = await fuelTypesApi.delete(id);

    if (response.error) {
      console.error(`Error deleting fuel type with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete fuel type with ID ${id}:`, err);
    throw err;
  }
}

/**
 * Check if a fuel type ID is unique
 * @param id The ID to check
 * @param excludeId Optional ID to exclude from the check (for updates)
 * @returns True if the ID is unique
 *
 * Note: This function now relies on the server-side validation in our Edge Function.
 * If a fuel type with the same ID exists, the create or update operation will fail
 * with an appropriate error message.
 */
export async function isFuelTypeIdUnique(
  id: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const response = await fuelTypesApi.getAll();

    if (!response.data) return true;

    // Check if any fuel type (except the one being excluded) has this id
    return !response.data.some(
      (ft) => ft.id === id && (!excludeId || ft.id !== excludeId)
    );
  } catch (err) {
    console.error(`Failed to check if fuel type ID ${id} is unique:`, err);
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
export async function isFuelTypeCodeUnique(
  code: string,
  excludeId?: string
): Promise<boolean> {
  try {
    const response = await fuelTypesApi.getAll();

    if (!response.data) return true;

    // Check if any fuel type (except the one being excluded) has this id
    return !response.data.some(
      (ft) => ft.id === code && (!excludeId || ft.id !== excludeId)
    );
  } catch (err) {
    console.error(`Failed to check if fuel type code ${code} is unique:`, err);
    throw err;
  }
}
