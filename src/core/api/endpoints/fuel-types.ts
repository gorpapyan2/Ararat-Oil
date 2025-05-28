/**
 * Fuel Types API
 *
 * This file provides API functions for working with fuel types data.
 */

import { fetchFromFunction, ApiResponse } from "../client";
import { API_ENDPOINTS } from "@/core/config/api";
import type { FuelType, FuelTypeCreate, FuelTypeUpdate } from "../types";

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FUEL_TYPES;

/**
 * Fetches all fuel types
 */
export async function getFuelTypes(): Promise<ApiResponse<FuelType[]>> {
  return fetchFromFunction<FuelType[]>(ENDPOINT);
}

/**
 * Fetches active fuel types
 */
export async function getActiveFuelTypes(): Promise<ApiResponse<FuelType[]>> {
  return fetchFromFunction<FuelType[]>(`${ENDPOINT}/active`);
}

/**
 * Fetches a fuel type by ID
 */
export async function getFuelTypeById(
  id: string
): Promise<ApiResponse<FuelType>> {
  return fetchFromFunction<FuelType>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new fuel type
 */
export async function createFuelType(
  data: FuelTypeCreate
): Promise<ApiResponse<FuelType>> {
  return fetchFromFunction<FuelType>(ENDPOINT, {
    method: "POST",
    body: data,
  });
}

/**
 * Updates a fuel type by ID
 */
export async function updateFuelType(
  id: string,
  data: FuelTypeUpdate
): Promise<ApiResponse<FuelType>> {
  return fetchFromFunction<FuelType>(`${ENDPOINT}/${id}`, {
    method: "PUT",
    body: data,
  });
}

/**
 * Deletes a fuel type by ID
 */
export async function deleteFuelType(
  id: string
): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: "DELETE",
  });
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
