/**
 * Filling Systems API
 *
 * This file provides API functions for working with filling systems data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type {
  FillingSystem,
  FillingSystemCreate,
  FillingSystemUpdate,
} from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FILLING_SYSTEMS;

/**
 * Fetches all filling systems
 */
export async function getFillingSystems(): Promise<
  ApiResponse<FillingSystem[]>
> {
  return fetchFromFunction<FillingSystem[]>(ENDPOINT);
}

/**
 * Fetches a filling system by ID
 */
export async function getFillingSystemById(
  id: string
): Promise<ApiResponse<FillingSystem>> {
  return fetchFromFunction<FillingSystem>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new filling system
 */
export async function createFillingSystem(
  data: FillingSystemCreate
): Promise<ApiResponse<FillingSystem>> {
  return fetchFromFunction<FillingSystem>(ENDPOINT, {
    method: "POST",
    body: data,
  });
}

/**
 * Updates a filling system by ID
 */
export async function updateFillingSystem(
  id: string,
  data: FillingSystemUpdate
): Promise<ApiResponse<FillingSystem>> {
  return fetchFromFunction<FillingSystem>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * Deletes a filling system by ID
 */
export async function deleteFillingSystem(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
}

/**
 * Validates if tank IDs are valid and available
 */
export async function validateTankIds(
  tankIds: string[]
): Promise<ApiResponse<{ valid: boolean; invalidIds?: string[] }>> {
  return fetchFromFunction<{ valid: boolean; invalidIds?: string[] }>(
    "filling-systems/validate-tank-ids",
    {
      queryParams: { tankIds: tankIds.join(",") },
    }
  );
}

/**
 * Filling systems API object with all methods
 */
export const fillingSystemsApi = {
  getFillingSystems,
  getFillingSystemById,
  createFillingSystem,
  updateFillingSystem,
  deleteFillingSystem,
  validateTankIds,
};
