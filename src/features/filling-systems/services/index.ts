// Re-export the original service
export * from "./fillingSystemsService";

// Import API endpoints
import { fillingSystemsApi } from "@/core/api/endpoints/filling-systems";
import type {
  FillingSystem as ApiFillingSystem,
  FillingSystemCreate,
  FillingSystemUpdate,
} from "@/core/api/types";
import type {
  FillingSystem,
  CreateFillingSystemRequest,
  UpdateFillingSystemRequest,
  FillingSystemFilters,
} from "../types";

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(
  apiFillingSystem: ApiFillingSystem
): FillingSystem {
  return {
    id: apiFillingSystem.id,
    name: apiFillingSystem.name,
    status: apiFillingSystem.status,
    location: apiFillingSystem.location,
    // In the feature type, we expect a single tank_id, but the API uses an array
    // We'll use the first one if available, or an empty string otherwise
    tank_id:
      apiFillingSystem.tank_ids && apiFillingSystem.tank_ids.length > 0
        ? apiFillingSystem.tank_ids[0]
        : "",
    // This is a placeholder, you might need to get the actual type from elsewhere
    type: "standard",
    created_at: apiFillingSystem.created_at,
    updated_at: apiFillingSystem.updated_at,
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiCreateRequest(
  featureFillingSystem: CreateFillingSystemRequest
): FillingSystemCreate {
  return {
    name: featureFillingSystem.name,
    location: featureFillingSystem.location || "",
    tank_ids: [featureFillingSystem.tank_id], // Convert single tank_id to array
    status: featureFillingSystem.status,
  };
}

// Helper function to adapt feature type to API update request
function adaptFeatureTypeToApiUpdateRequest(
  featureFillingSystem: UpdateFillingSystemRequest
): FillingSystemUpdate {
  const updateData: FillingSystemUpdate = {
    name: featureFillingSystem.name,
    location: featureFillingSystem.location,
    status: featureFillingSystem.status,
  };

  // Only add tank_ids if tank_id is provided
  if (featureFillingSystem.tank_id) {
    updateData.tank_ids = [featureFillingSystem.tank_id];
  }

  return updateData;
}

/**
 * Get all filling systems with optional filters
 */
export async function getFillingSystemsWithFilters(
  filters?: FillingSystemFilters
): Promise<FillingSystem[]> {
  const response = await fillingSystemsApi.getFillingSystems();

  if (response.error) {
    throw new Error(response.error.message);
  }

  // Convert API response to feature type
  let fillingSystems = (response.data || []).map(adaptApiResponseToFeatureType);

  // Apply filters client-side (these should eventually move to the API)
  if (filters) {
    if (filters.status) {
      fillingSystems = fillingSystems.filter(
        (fs) => fs.status === filters.status
      );
    }

    if (filters.tank_id) {
      fillingSystems = fillingSystems.filter(
        (fs) => fs.tank_id === filters.tank_id
      );
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      fillingSystems = fillingSystems.filter(
        (fs) =>
          fs.name.toLowerCase().includes(searchLower) ||
          (fs.location && fs.location.toLowerCase().includes(searchLower))
      );
    }
  }

  return fillingSystems;
}

/**
 * Get a filling system by ID
 */
export async function getFillingSystemById(id: string): Promise<FillingSystem> {
  const response = await fillingSystemsApi.getFillingSystemById(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("Filling system not found");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Create a new filling system
 */
export async function createFillingSystem(
  data: CreateFillingSystemRequest
): Promise<FillingSystem> {
  const apiData = adaptFeatureTypeToApiCreateRequest(data);

  const response = await fillingSystemsApi.createFillingSystem(apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Update an existing filling system
 */
export async function updateFillingSystem(
  id: string,
  data: UpdateFillingSystemRequest
): Promise<FillingSystem> {
  const apiData = adaptFeatureTypeToApiUpdateRequest(data);

  const response = await fillingSystemsApi.updateFillingSystem(id, apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Delete a filling system
 */
export async function deleteFillingSystem(id: string): Promise<boolean> {
  const response = await fillingSystemsApi.deleteFillingSystem(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data?.success || false;
}

/**
 * Validate tank IDs are available for use with filling systems
 */
export async function validateTankIds(
  tankIds: string[]
): Promise<{ valid: boolean; invalidIds?: string[] }> {
  const response = await fillingSystemsApi.validateTankIds(tankIds);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data || { valid: false };
}

// Export as an object for compatibility with existing code
export const fillingSystemsService = {
  getFillingSystemsWithFilters,
  getFillingSystemById,
  createFillingSystem,
  updateFillingSystem,
  deleteFillingSystem,
  validateTankIds,
};
