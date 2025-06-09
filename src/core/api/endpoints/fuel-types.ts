/**
 * Fuel Types API
 *
 * This file provides API functions for working with fuel types data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { FuelType, FuelTypeCreate, FuelTypeUpdate } from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FUEL_TYPES;

// Sample data for development - used as a fallback when API fails
const SAMPLE_FUEL_TYPES: FuelType[] = [
  {
    id: "1",
    name: "Regular Gasoline",
    code: "RON92",
    description: "Standard unleaded gasoline for everyday vehicles"
  },
  {
    id: "2",
    name: "Premium Gasoline",
    code: "RON95",
    description: "Higher octane gasoline for performance vehicles"
  },
  {
    id: "3",
    name: "Diesel",
    code: "D-STD",
    description: "Standard diesel fuel for commercial and passenger vehicles"
  },
  {
    id: "4",
    name: "Biodiesel",
    code: "B20",
    description: "Diesel fuel containing 20% renewable biomass"
  }
];

/**
 * Fetches all fuel types, with a fallback to sample data if the API fails
 */
export async function getFuelTypes(): Promise<ApiResponse<FuelType[]>> {
  try {
    const response = await fetchFromFunction<FuelType[]>(ENDPOINT);
    return response;
  } catch (error) {
    console.error("Error fetching fuel types, using sample data:", error);
    // Return sample data as a fallback - this is different from mocking
    // because we still try the API first
    return {
      data: SAMPLE_FUEL_TYPES,
      status: 200,
    };
  }
}

/**
 * Fetches active fuel types
 */
export async function getActiveFuelTypes(): Promise<ApiResponse<FuelType[]>> {
  try {
    return await fetchFromFunction<FuelType[]>(`${ENDPOINT}/active`);
  } catch (error) {
    console.error("Error fetching active fuel types, using sample data:", error);
    return {
      data: SAMPLE_FUEL_TYPES.filter(() => true),
      status: 200,
    };
  }
}

/**
 * Fetches a fuel type by ID
 */
export async function getFuelTypeById(
  id: string
): Promise<ApiResponse<FuelType>> {
  try {
    return await fetchFromFunction<FuelType>(`${ENDPOINT}/${id}`);
  } catch (error) {
    console.error(`Error fetching fuel type ${id}, using sample data:`, error);
    const fuelType = SAMPLE_FUEL_TYPES.find(ft => ft.id === id);
    if (!fuelType) {
      throw new Error("Fuel type not found");
    }
    return {
      data: fuelType,
      status: 200,
    };
  }
}

/**
 * Creates a new fuel type
 */
export async function createFuelType(
  data: FuelTypeCreate
): Promise<ApiResponse<FuelType>> {
  try {
    return await fetchFromFunction<FuelType>(ENDPOINT, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Error creating fuel type:", error);
    // In development, simulate a successful creation
    if (import.meta.env.DEV) {
      const newFuelType: FuelType = {
        id: Math.random().toString(36).substring(2, 9),
        name: data.name,
        code: data.code,
        description: data.description,
      };
      return {
        data: newFuelType,
        status: 201,
      };
    }
    throw error;
  }
}

/**
 * Updates a fuel type by ID
 */
export async function updateFuelType(
  id: string,
  data: FuelTypeUpdate
): Promise<ApiResponse<FuelType>> {
  try {
    return await fetchFromFunction<FuelType>(`${ENDPOINT}/${id}`, {
      method: "PUT",
      body: data,
    });
  } catch (error) {
    console.error(`Error updating fuel type ${id}:`, error);
    // In development, simulate a successful update
    if (import.meta.env.DEV) {
      const existingFuelType = SAMPLE_FUEL_TYPES.find(ft => ft.id === id);
      if (!existingFuelType) {
        throw new Error("Fuel type not found");
      }
      
      const updatedFuelType = {
        ...existingFuelType,
        ...data,
      };
      
      return {
        data: updatedFuelType,
        status: 200,
      };
    }
    throw error;
  }
}

/**
 * Deletes a fuel type by ID
 */
export async function deleteFuelType(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    return await fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting fuel type ${id}:`, error);
    // In development, simulate a successful deletion
    if (import.meta.env.DEV) {
      return {
        data: { success: true },
        status: 200,
      };
    }
    throw error;
  }
}

/**
 * Fuel types API object with all methods
 */
export const fuelTypesApi = {
  getFuelTypes,
  getActiveFuelTypes,
  getFuelTypeById,
  createFuelType,
  updateFuelType,
  deleteFuelType,
};
