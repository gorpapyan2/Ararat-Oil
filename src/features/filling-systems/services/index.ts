// Modern centralized services approach
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import { 
  getFillingSystems,
  getFillingSystemById as apiGetFillingSystemById,
  createFillingSystem as apiCreateFillingSystem,
  updateFillingSystem as apiUpdateFillingSystem,
  deleteFillingSystem as apiDeleteFillingSystem
} from "@/core/api/endpoints/filling-systems";
import type { FillingSystem as ApiFillingSystem, FillingSystemCreate } from "@/core/api/types";
import type {
  FillingSystem,
  CreateFillingSystemRequest,
  UpdateFillingSystemRequest,
  FillingSystemFilters,
  FillingSystemStats,
} from "../types";

// Re-export for backward compatibility
export { useCentralizedEntity } from "@/hooks/useCentralizedEntity";

// Export legacy functions for backward compatibility
// Define these at the top to prevent potential circular references
export const getFillingSystemsWithFilters = getFillingSystems_Legacy;
export const getFillingSystemById = getFillingSystemById_Legacy;
export const createFillingSystem = createFillingSystem_Legacy;
export const updateFillingSystem = updateFillingSystem_Legacy;
export const deleteFillingSystem = deleteFillingSystem_Legacy;

// Modern hook-based approach
export const useFillingSystemsModern = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<ApiFillingSystem>('filling-systems', options);

// Helper function to adapt API system to feature type
function adaptApiToFeatureType(apiSystem: ApiFillingSystem): FillingSystem {
  return {
    id: apiSystem.id,
    name: apiSystem.name,
    status: apiSystem.status as "active" | "inactive" | "maintenance",
    type: "", // Not in API type, providing default
    tank_id: apiSystem.tank_ids?.[0] || "", // Use first tank_id from array
    tank_name: undefined, // Optional property, can be undefined
    location: apiSystem.location, // API has required location, feature type has optional
    created_at: apiSystem.created_at || "",
    updated_at: apiSystem.updated_at || "",
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureToApiType(systemData: CreateFillingSystemRequest): FillingSystemCreate {
  return {
    name: systemData.name,
    location: systemData.location || "", // Provide default empty string for undefined location
    tank_ids: [systemData.tank_id], // Convert single tank_id to array
    status: systemData.status as "active" | "inactive" | "maintenance",
  };
}

/**
 * Get all filling systems with optional filters
 */
export async function getFillingSystems_Legacy(filters?: FillingSystemFilters): Promise<FillingSystem[]> {
  try {
    const response = await getFillingSystems();
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    let systems = (response.data || []).map(adaptApiToFeatureType);

    // Apply client-side filtering if filters provided
    if (filters?.status) {
      systems = systems.filter((system: FillingSystem) => system.status === filters.status);
    }
    if (filters?.tank_id) {
      systems = systems.filter((system: FillingSystem) => system.tank_id === filters.tank_id);
    }
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      systems = systems.filter((system: FillingSystem) => 
        system.name.toLowerCase().includes(searchLower) ||
        (system.location && system.location.toLowerCase().includes(searchLower))
      );
    }

    return systems;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch filling systems');
  }
}

/**
 * Get filling system by ID
 */
export async function getFillingSystemById_Legacy(id: string): Promise<FillingSystem | null> {
  try {
    const response = await apiGetFillingSystemById(id);
    if (response?.error) {
      throw new Error(response.error.message);
    }
    
    return response?.data ? adaptApiToFeatureType(response.data) : null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch filling system');
  }
}

/**
 * Create a new filling system
 */
export async function createFillingSystem_Legacy(systemData: CreateFillingSystemRequest): Promise<FillingSystem> {
  try {
    const apiData = adaptFeatureToApiType(systemData);
    const response = await apiCreateFillingSystem(apiData);
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      throw new Error('No data returned from create operation');
    }
    
    return adaptApiToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create filling system');
  }
}

/**
 * Update an existing filling system
 */
export async function updateFillingSystem_Legacy(id: string, systemData: Partial<UpdateFillingSystemRequest>): Promise<FillingSystem> {
  try {
    const response = await apiUpdateFillingSystem(id, systemData);
    
    if (response.error) {
      throw new Error(response.error.message);
    }
    
    if (!response.data) {
      throw new Error('No data returned from update operation');
    }
    
    return adaptApiToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update filling system');
  }
}

/**
 * Delete a filling system
 */
export async function deleteFillingSystem_Legacy(id: string): Promise<boolean> {
  try {
    const response = await apiDeleteFillingSystem(id);
    return !response.error;
  } catch (error) {
    console.error('Error deleting filling system:', error);
    return false;
  }
}

/**
 * Get filling systems summary
 */
export async function getSystemsSummary(): Promise<FillingSystemStats> {
  try {
    const systems = await getFillingSystems_Legacy();
    
    return {
      total_sales: 0, // Would need API support for sales data
      total_volume: 0, // Would need API support for volume data
      average_daily_sales: 0, // Would need API support for calculations
      last_maintenance: undefined, // Would need API support for maintenance data
    };
  } catch (error) {
    console.error("Error calculating systems summary:", error);
    return {
      total_sales: 0,
      total_volume: 0,
      average_daily_sales: 0,
      last_maintenance: undefined,
    };
  }
}

// Validate tank IDs
export async function validateTankIds(tankIds: string[]): Promise<{ valid: boolean; invalidIds: string[] }> {
  // Simple implementation - assuming all tank IDs are valid
  return { valid: true, invalidIds: [] };
}

// Export as an object for compatibility with existing code
export const fillingSystemsService = {
  getFillingSystems: getFillingSystems_Legacy,
  getFillingSystemById: getFillingSystemById_Legacy,
  createFillingSystem: createFillingSystem_Legacy,
  updateFillingSystem: updateFillingSystem_Legacy,
  deleteFillingSystem: deleteFillingSystem_Legacy,
  getSystemsSummary,
};
