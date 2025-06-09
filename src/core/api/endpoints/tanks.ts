/**
 * Tanks API
 *
 * This file provides API functions for working with tanks data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { Tank, TankCreate, TankUpdate } from "../types";
import { TankLevelChange } from "@/types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.TANKS;

/**
 * Fetches all tanks
 */
export async function getTanks(): Promise<ApiResponse<Tank[]>> {
  const response = await fetchFromFunction<Tank[] | { tanks: Tank[] }>(ENDPOINT, {
    cache: "force-cache",
    queryParams: {
      // Cache key that changes every 5 minutes (tanks don't change often)
      _cache: Math.floor(Date.now() / 300000)
    }
  });
  
  // Handle both direct array response and nested response
  let tanks: Tank[] = [];
  if (Array.isArray(response.data)) {
    // Direct array response
    tanks = response.data;
  } else if (response.data && typeof response.data === 'object' && 'tanks' in response.data) {
    // Nested response
    tanks = response.data.tanks || [];
  }
  
  return {
    ...response,
    data: tanks
  };
}

/**
 * Fetches a tank by ID
 */
export async function getTankById(id: string): Promise<ApiResponse<Tank>> {
  const response = await fetchFromFunction<{ tank: Tank }>(`${ENDPOINT}/${id}`);
  return {
    ...response,
    data: response.data?.tank
  };
}

/**
 * Gets tank level changes/history for a specific tank
 * Note: This endpoint is implemented in the Edge Function
 */
export async function getTankLevelChanges(tankId: string): Promise<ApiResponse<TankLevelChange[]>> {
  const response = await fetchFromFunction<{ levelChanges: TankLevelChange[] }>(`${ENDPOINT}/${tankId}/level-changes`);
  return {
    ...response,
    data: response.data?.levelChanges || []
  };
}

/**
 * Creates a new tank
 */
export async function createTank(data: TankCreate): Promise<ApiResponse<Tank>> {
  const response = await fetchFromFunction<{ tank: Tank }>(ENDPOINT, {
    method: "POST",
    body: data,
  });
  return {
    ...response,
    data: response.data?.tank
  };
}

/**
 * Updates a tank
 */
export async function updateTank(id: string, data: TankUpdate): Promise<ApiResponse<Tank>> {
  const response = await fetchFromFunction<{ tank: Tank }>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: data,
  });
  return {
    ...response,
    data: response.data?.tank
  };
}

/**
 * Deletes a tank
 */
export async function deleteTank(id: string): Promise<ApiResponse<void>> {
  return fetchFromFunction<void>(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Adjusts tank level
 * Note: This endpoint is implemented in the Edge Function
 */
export async function adjustTankLevel(
  tankId: string, 
  changeAmount: number, 
  changeType: "add" | "subtract", 
  reason?: string
): Promise<ApiResponse<TankLevelChange>> {
  const response = await fetchFromFunction<{ levelChange: TankLevelChange }>(`${ENDPOINT}/${tankId}/adjust-level`, {
    method: "POST",
    body: {
      change_amount: changeAmount,
      change_type: changeType,
      reason
    },
  });
  return {
    ...response,
    data: response.data?.levelChange
  };
}

/**
 * Gets tank summary with statistics
 */
export async function getTankSummary(): Promise<ApiResponse<{
  totalTanks: number;
  activeTanks: number;
  totalCapacity: number;
  totalCurrentLevel: number;
  lowLevelTanks: number;
  criticalLevelTanks: number;
}>> {
  const response = await fetchFromFunction<{ summary: {
    totalTanks: number;
    activeTanks: number;
    totalCapacity: number;
    totalCurrentLevel: number;
    lowLevelTanks: number;
    criticalLevelTanks: number;
  } }>(`${ENDPOINT}/summary`);
  return {
    ...response,
    data: response.data?.summary
  };
}

/**
 * Tanks API object with all methods
 */
export const tanksApi = {
  getTanks,
  getTankById,
  getTankLevelChanges,
  createTank,
  updateTank,
  deleteTank,
  adjustTankLevel,
  getTankSummary,
};
