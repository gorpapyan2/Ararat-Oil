/**
 * Filling Systems Service
 *
 * Service for interacting with filling systems API
 */
import { fillingSystemsApi } from "@/core/api";
import type {
  FillingSystem,
  CreateFillingSystemRequest,
  UpdateFillingSystemRequest,
  FillingSystemFilters,
} from "../types";

/**
 * Get all filling systems with optional filters
 */
export const getFillingSystemsWithFilters = async (
  filters?: FillingSystemFilters
) => {
  return fillingSystemsApi.getFilingSystems();
};

/**
 * Get a filling system by ID
 */
export const getFillingSystemById = async (id: string) => {
  return fillingSystemsApi.getFillingSystemById(id);
};

/**
 * Create a new filling system
 */
export const createFillingSystem = async (
  fillingSystem: CreateFillingSystemRequest
) => {
  // Adapt our feature's type to the API's expected type
  return fillingSystemsApi.createFillingSystem({
    name: fillingSystem.name,
    location: fillingSystem.location || "",
    tank_ids: [fillingSystem.tank_id], // Convert single tank_id to array of tank_ids
    status: fillingSystem.status,
  });
};

/**
 * Update an existing filling system
 */
export const updateFillingSystem = async (
  id: string,
  fillingSystem: UpdateFillingSystemRequest
) => {
  // Adapt our feature's type to the API's expected type
  const updateData: {
    name?: string;
    location?: string;
    status?: "active" | "inactive" | "maintenance";
    tank_ids?: string[];
  } = {
    name: fillingSystem.name,
    location: fillingSystem.location,
    status: fillingSystem.status,
  };

  // Only add tank_ids if tank_id is provided
  if (fillingSystem.tank_id) {
    updateData.tank_ids = [fillingSystem.tank_id];
  }

  return fillingSystemsApi.updateFillingSystem(id, updateData);
};

/**
 * Delete a filling system
 */
export const deleteFillingSystem = async (id: string) => {
  return fillingSystemsApi.deleteFillingSystem(id);
};
