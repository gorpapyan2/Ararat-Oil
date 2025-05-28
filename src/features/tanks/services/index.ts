// Re-export the tank service
export * from "./tanksService";

// New API-based service implementation
import { tanksApi } from "@/core/api/endpoints/tanks";
import { fuelTypesApi } from "@/core/api/endpoints/fuel-types";
import type { Tank, FuelType, TankCreate, TankUpdate } from "@/core/api/types";
import type {
  FuelTank,
  TankLevelChange,
  CreateTankRequest,
  UpdateTankRequest,
  TankSummary,
} from "../types/tanks.types";

// API response type for tank level changes
interface ApiTankLevelChange {
  id: string;
  previous_level: number;
  new_level: number;
  change_amount: number;
  change_type: "add" | "subtract";
  reason?: string;
  created_at: string;
  created_by?: string;
}

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiTank: Tank): FuelTank {
  return {
    id: apiTank.id,
    name: apiTank.name,
    fuel_type_id: apiTank.fuel_type_id,
    capacity: apiTank.capacity,
    current_level: apiTank.current_level,
    is_active: apiTank.status === "active",
    created_at: apiTank.created_at,
    updated_at: apiTank.updated_at,
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(
  featureTank: CreateTankRequest
): TankCreate {
  return {
    name: featureTank.name,
    fuel_type_id: featureTank.fuel_type_id,
    capacity: featureTank.capacity,
    current_level: featureTank.current_level,
    status: featureTank.is_active ? "active" : "inactive",
  };
}

/**
 * Gets all tanks
 */
export async function getTanks(): Promise<FuelTank[]> {
  const response = await tanksApi.getTanks();

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response to feature type
  return (response.data || []).map(adaptApiResponseToFeatureType);
}

/**
 * Gets a tank by ID
 */
export async function getTankById(id: string): Promise<FuelTank> {
  const response = await tanksApi.getTankById(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("Tank not found");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Gets level change history for a tank
 */
export async function getTankLevelChanges(
  tankId: string
): Promise<TankLevelChange[]> {
  const response = await tanksApi.getTankLevelChanges(tankId);

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response to feature type
  return (response.data || []).map((change: ApiTankLevelChange) => ({
    id: change.id,
    tank_id: tankId,
    previous_level: change.previous_level,
    new_level: change.new_level,
    change_amount: change.change_amount,
    change_type: change.change_type,
    reason: change.reason,
    created_at: change.created_at,
    created_by: change.created_by || "system",
  }));
}

/**
 * Creates a new tank
 */
export async function createTank(data: CreateTankRequest): Promise<FuelTank> {
  const apiData = adaptFeatureTypeToApiRequest(data);

  const response = await tanksApi.createTank(apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Updates an existing tank
 */
export async function updateTank(
  id: string,
  data: UpdateTankRequest
): Promise<FuelTank> {
  const apiData: TankUpdate = {
    name: data.name,
    fuel_type_id: data.fuel_type_id,
    capacity: data.capacity,
    current_level: data.current_level,
    status:
      data.is_active !== undefined
        ? data.is_active
          ? "active"
          : "inactive"
        : undefined,
  };

  const response = await tanksApi.updateTank(id, apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Deletes a tank
 */
export async function deleteTank(id: string): Promise<boolean> {
  const response = await tanksApi.deleteTank(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data?.success || false;
}

/**
 * Gets fuel types for tank selection
 */
export async function getFuelTypes(): Promise<{ id: string; name: string }[]> {
  const response = await fuelTypesApi.getFuelTypes();

  if (response.error) {
    throw new Error(response.error.message);
  }

  return (response.data || []).map((type: FuelType) => ({
    id: type.id,
    name: type.name,
  }));
}

/**
 * Adjusts tank level
 */
export async function adjustTankLevel(
  tankId: string,
  adjustment: {
    change_amount: number;
    change_type: "add" | "subtract";
    reason?: string;
  }
): Promise<TankLevelChange> {
  const response = await tanksApi.adjustTankLevel(
    tankId,
    adjustment.change_amount,
    adjustment.change_type,
    adjustment.reason
  );

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Since the response format may differ, we create a placeholder
  // In a real implementation, you'd map the response to the TankLevelChange type
  if (!response.data) {
    throw new Error("No data returned from API");
  }

  // This is a placeholder implementation
  const tankLevelChange: TankLevelChange = {
    id: response.data.id || "",
    tank_id: tankId,
    previous_level:
      response.data.current_level -
      (adjustment.change_type === "add"
        ? adjustment.change_amount
        : -adjustment.change_amount),
    new_level: response.data.current_level,
    change_amount: adjustment.change_amount,
    change_type: adjustment.change_type,
    reason: adjustment.reason,
    created_at: new Date().toISOString(),
    created_by: "system",
  };

  return tankLevelChange;
}

export const tanksService = {
  getTanks,
  getTankById,
  createTank,
  updateTank,
  deleteTank,
  getFuelTypes,
  adjustTankLevel,
  getTankLevelChanges,
};
