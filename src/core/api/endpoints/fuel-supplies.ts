/**
 * Fuel Supplies API
 *
 * This file provides API functions for working with fuel supplies data.
 */

import { fetchFromFunction, ApiResponse, createApiError } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import { API_ERROR_TYPE } from "@/core/config/api";
import type { FuelSupply, FuelSupplyCreate, FuelSupplyUpdate } from "../types";
  
const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FUEL_SUPPLIES;

/**
 * Fetches all fuel supplies
 */
export async function getFuelSupplies(): Promise<ApiResponse<FuelSupply[]>> {
  try {
    // Use 'unknown' for the response type since we need to handle multiple formats
    const response = await fetchFromFunction<unknown>(ENDPOINT, {
      // Always fetch fresh data, no caching
      cache: "no-cache"
    });

    // Handle potential response formats:
    let supplies: FuelSupply[] = [];
    
    if (!response.data && Array.isArray(response)) {
      // Case 1: Direct array in the response itself (rare edge case)
      supplies = response;
    } else if (response.data) {
      if (Array.isArray(response.data)) {
        // Case 2: Array directly in response.data (expected format)
        supplies = response.data;
      } else if (typeof response.data === 'object' && response.data !== null && 'data' in response.data) {
        // Case 3: Nested data property containing array
        const nestedData = (response.data as { data: unknown }).data;
        if (Array.isArray(nestedData)) {
          supplies = nestedData as FuelSupply[];
        }
      }
    }
    
    // Only log empty responses, don't log on successful data retrieval
    if (supplies.length === 0) {
      console.warn('Unexpected data format or empty response in fuel supplies:', response);
    }
    
    return {
      ...response as ApiResponse<unknown>,
      data: supplies
    };
  } catch (error) {
    return {
      error: createApiError(
        API_ERROR_TYPE.UNKNOWN,
        `Failed to fetch fuel supplies: ${error.message}`,
        undefined,
        error
      )
    };
  }
}

/**
 * Fetches a fuel supply by ID
 */
export async function getFuelSupplyById(
  id: string
): Promise<ApiResponse<FuelSupply>> {
  return fetchFromFunction<FuelSupply>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new fuel supply
 */
export async function createFuelSupply(
  data: FuelSupplyCreate
): Promise<ApiResponse<FuelSupply>> {
  return fetchFromFunction<FuelSupply>(ENDPOINT, {
    method: "POST",
    body: data,
  });
}

/**
 * Updates a fuel supply by ID
 */
export async function updateFuelSupply(
  id: string,
  data: FuelSupplyUpdate
): Promise<ApiResponse<FuelSupply>> {
  return fetchFromFunction<FuelSupply>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * Deletes a fuel supply by ID
 */
export async function deleteFuelSupply(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fuel supplies API object with all methods
 */
export const fuelSuppliesApi = {
  getFuelSupplies,
  getFuelSupplyById,
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
};
