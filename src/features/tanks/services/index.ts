// Modern centralized services approach
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import { tanksApi, fuelTypesApi } from "@/services/api";
import type { Tank, FuelType, TankCreate, TankUpdate, FuelTypeCreate } from "@/core/api/types";
import type {
  FuelTank,
  TankLevelChange,
  CreateTankRequest,
  UpdateTankRequest,
  TankSummary,
} from "../types/tanks.types";

// Modern hook-based approach
export const useTanks = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<Tank>('tanks', options);

export const useFuelTypes = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<FuelType>('fuel_types', options);

// Re-export for backward compatibility
export { useCentralizedEntity } from "@/hooks/useCentralizedEntity";

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiTank: Tank): FuelTank {
  return {
    id: apiTank.id,
    name: apiTank.name,
    fuel_type_id: apiTank.fuel_type_id,
    capacity: apiTank.capacity,
    current_level: apiTank.current_level,
    is_active: apiTank.is_active,
    created_at: apiTank.created_at,
    updated_at: apiTank.updated_at,
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(featureTank: CreateTankRequest): TankCreate {
  return {
    name: featureTank.name,
    fuel_type_id: featureTank.fuel_type_id,
    capacity: featureTank.capacity,
    current_level: featureTank.current_level,
    is_active: featureTank.is_active,
  };
}

/**
 * Gets all tanks using modern API
 */
export async function getTanks(): Promise<FuelTank[]> {
  try {
    const response = await tanksApi.getAll();
    if (response.error) {
      throw new Error(response.error);
    }
    
    const data = response.data;
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.map(adaptApiResponseToFeatureType);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tanks');
  }
}

/**
 * Gets a tank by ID using modern API
 */
export async function getTankById(id: string): Promise<FuelTank> {
  try {
    const response = await tanksApi.getById(id);
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('Tank not found');
    }
    
    return adaptApiResponseToFeatureType(response.data as Tank);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch tank');
  }
}

/**
 * Creates a new tank using modern API
 */
export async function createTank(data: CreateTankRequest): Promise<FuelTank> {
  try {
    const apiData = adaptFeatureTypeToApiRequest(data);
    const response = await tanksApi.create(apiData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from create operation');
    }
    
    return adaptApiResponseToFeatureType(response.data as Tank);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create tank');
  }
}

/**
 * Updates an existing tank using modern API
 */
export async function updateTank(id: string, data: UpdateTankRequest): Promise<FuelTank> {
  try {
    const apiData = {
      name: data.name,
      fuel_type_id: data.fuel_type_id,
      capacity: data.capacity,
      current_level: data.current_level,
      status: data.is_active !== undefined ? (data.is_active ? "active" : "inactive") : undefined,
    };

    const response = await tanksApi.update(id, apiData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from update operation');
    }
    
    return adaptApiResponseToFeatureType(response.data as Tank);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update tank');
  }
}

/**
 * Deletes a tank using modern API
 */
export async function deleteTank(id: string): Promise<boolean> {
  try {
    const response = await tanksApi.delete(id);
    return !response.error;
  } catch (error) {
    console.error('Error deleting tank:', error);
    return false;
  }
}

/**
 * Gets fuel types for tank selection using modern API
 */
export async function getFuelTypes(): Promise<{ id: string; name: string }[]> {
  try {
    const response = await fuelTypesApi.getAll();
    if (response.error) {
      throw new Error(response.error);
    }
    
    const data = response.data;
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    return data.map((type: FuelType) => ({
      id: type.id,
      name: type.name,
    }));
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch fuel types');
  }
}

/**
 * Gets level change history for a tank
 * Note: This functionality needs to be implemented in the API
 */
export async function getTankLevelChanges(tankId: string): Promise<TankLevelChange[]> {
  // TODO: Implement this in the API
  console.warn('Tank level changes functionality needs to be implemented in API');
  return [];
}

/**
 * Adjusts tank level
 * Note: This functionality needs to be implemented in the API
 */
export async function adjustTankLevel(
  tankId: string,
  adjustment: {
    change_amount: number;
    change_type: "add" | "subtract";
    reason?: string;
  }
): Promise<TankLevelChange> {
  // TODO: Implement this in the API
  console.warn('Tank level adjustment functionality needs to be implemented in API');
  
  const tankLevelChange: TankLevelChange = {
    id: `temp-${Date.now()}`,
    tank_id: tankId,
    previous_level: 0,
    new_level: 0,
    change_amount: adjustment.change_amount,
    change_type: adjustment.change_type,
    reason: adjustment.reason,
    created_at: new Date().toISOString(),
    created_by: "system",
  };

  return tankLevelChange;
}

// Export as an object for compatibility with existing code
export const tanksService = {
  getTanks,
  getTankById,
  createTank,
  updateTank,
  deleteTank,
  getFuelTypes,
  getTankLevelChanges,
  adjustTankLevel,
};

// Legacy API adapters for backward compatibility (deprecated)
// @deprecated Use new hooks and functions instead
export const legacyTanksApi = {
  async getTanks() {
    console.warn('legacyTanksApi.getTanks is deprecated. Use getTanks() or useTanks() instead.');
    return getTanks();
  },
  async getTankById(id: string) {
    console.warn('legacyTanksApi.getTankById is deprecated. Use getTankById() instead.');
    return getTankById(id);
  },
  async createTank(data: CreateTankRequest) {
    console.warn('legacyTanksApi.createTank is deprecated. Use createTank() instead.');
    return createTank(data);
  },
  async updateTank(id: string, data: UpdateTankRequest) {
    console.warn('legacyTanksApi.updateTank is deprecated. Use updateTank() instead.');
    return updateTank(id, data);
  },
  async deleteTank(id: string) {
    console.warn('legacyTanksApi.deleteTank is deprecated. Use deleteTank() instead.');
    return deleteTank(id);
  },
};

// Legacy fuel types API adapters (deprecated)
// @deprecated Use new hooks and functions instead
export const legacyFuelTypeService = {
  async getFuelTypes() {
    console.warn('legacyFuelTypeService.getFuelTypes is deprecated. Use getFuelTypes() or useFuelTypes() instead.');
    return getFuelTypes();
  },
  async getFuelTypeById(id: string) {
    console.warn('legacyFuelTypeService.getFuelTypeById is deprecated. Use useFuelTypes() instead.');
    const response = await fuelTypesApi.getById(id);
    return response.data as FuelType;
  },
  async createFuelType(data: Partial<FuelType>) {
    console.warn('legacyFuelTypeService.createFuelType is deprecated. Use fuelTypesApi directly.');
    const response = await fuelTypesApi.create(data as FuelTypeCreate);
    return response.data as FuelType;
  },
  async updateFuelType(id: string, data: Partial<FuelType>) {
    console.warn('legacyFuelTypeService.updateFuelType is deprecated. Use fuelTypesApi directly.');
    const response = await fuelTypesApi.update(id, data);
    return response.data as FuelType;
  },
  async deleteFuelType(id: string) {
    console.warn('legacyFuelTypeService.deleteFuelType is deprecated. Use fuelTypesApi directly.');
    await fuelTypesApi.delete(id);
    return true;
  },
};
