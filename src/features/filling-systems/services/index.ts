// Modern centralized services approach
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import { fillingSystemsApi } from "@/services/api";
import type { FillingSystem as ApiFillingSystem, FillingSystemCreate } from "@/core/api/types";
import type {
  FillingSystem,
  CreateFillingSystemRequest,
  UpdateFillingSystemRequest,
  FillingSystemFilters,
} from "../types";

// Modern hook-based approach
export const useFillingSystemsModern = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<ApiFillingSystem>('filling_systems', options);

// Re-export for backward compatibility
export { useCentralizedEntity } from "@/hooks/useCentralizedEntity";

// Helper function to adapt API filling system to feature type
function adaptApiToFeatureType(apiSystem: ApiFillingSystem): FillingSystem {
  return {
    id: apiSystem.id,
    name: apiSystem.name,
    status: apiSystem.status || "active",
    type: "pump", // Default type since API doesn't have this field
    tank_id: Array.isArray(apiSystem.tank_ids) ? apiSystem.tank_ids[0] || "" : "",
    location: apiSystem.location || "",
    created_at: apiSystem.created_at || "",
    updated_at: apiSystem.updated_at || "",
  };
}

// Helper function to adapt feature type to API type
function adaptFeatureToApiType(systemData: CreateFillingSystemRequest | UpdateFillingSystemRequest): FillingSystemCreate {
  return {
    name: systemData.name || "",
    status: systemData.status || "active",
    location: systemData.location || "",
    tank_ids: systemData.tank_id ? [systemData.tank_id] : [],
  };
}

/**
 * Get all filling systems with optional filters
 */
export async function getFillingSystems(filters?: FillingSystemFilters): Promise<FillingSystem[]> {
  try {
    const response = await fillingSystemsApi.getAll();
    if (response.error) {
      throw new Error(response.error);
    }
    
    let systems = (response.data || []).map((apiSystem: ApiFillingSystem) => adaptApiToFeatureType(apiSystem));

    // Apply client-side filtering if filters provided
    if (filters?.status) {
      systems = systems.filter((system: FillingSystem) => system.status === filters.status);
    }
    if (filters?.tank_id) {
      systems = systems.filter((system: FillingSystem) => system.tank_id === filters.tank_id);
    }
    if (filters?.search) {
      const query = filters.search.toLowerCase();
      systems = systems.filter((system: FillingSystem) => 
        system.name.toLowerCase().includes(query) ||
        (system.location && system.location.toLowerCase().includes(query))
      );
    }

    return systems;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch filling systems');
  }
}

// Alias for backward compatibility
export const getFillingSystemsWithFilters = getFillingSystems;

/**
 * Get filling system by ID
 */
export async function getFillingSystemById(id: string): Promise<FillingSystem | null> {
  try {
    const response = await fillingSystemsApi.getById(id);
    if (response.error) {
      throw new Error(response.error);
    }
    return response.data ? adaptApiToFeatureType(response.data) : null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch filling system');
  }
}

/**
 * Create a new filling system
 */
export async function createFillingSystem(data: CreateFillingSystemRequest): Promise<FillingSystem> {
  try {
    const apiData = adaptFeatureToApiType(data);
    const response = await fillingSystemsApi.create(apiData);
    if (response.error) {
      throw new Error(response.error);
    }
    return adaptApiToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create filling system');
  }
}

/**
 * Update a filling system
 */
export async function updateFillingSystem(id: string, data: UpdateFillingSystemRequest): Promise<FillingSystem> {
  try {
    const apiData = adaptFeatureToApiType(data);
    const response = await fillingSystemsApi.update(id, apiData);
    if (response.error) {
      throw new Error(response.error);
    }
    return adaptApiToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update filling system');
  }
}

/**
 * Delete a filling system
 */
export async function deleteFillingSystem(id: string): Promise<void> {
  try {
    const response = await fillingSystemsApi.delete(id);
    if (response.error) {
      throw new Error(response.error);
    }
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to delete filling system');
  }
}

/**
 * Validate tank IDs for filling systems
 */
export async function validateTankIds(tankIds: string[]): Promise<boolean> {
  try {
    // This is a placeholder implementation
    // In a real scenario, you'd validate against the tanks API
    return tankIds.length > 0 && tankIds.every(id => id.length > 0);
  } catch (error) {
    console.error('Error validating tank IDs:', error);
    return false;
  }
}

// Export as an object for compatibility with existing code
export const fillingSystemsService = {
  getFillingSystems,
  createFillingSystem,
  updateFillingSystem,
  deleteFillingSystem,
  validateTankIds,
};
