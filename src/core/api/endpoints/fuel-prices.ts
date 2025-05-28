import { fetchFromFunction, ApiResponse } from "../client";
import type { FuelPrice } from "../types";

/**
 * Query parameters for fuel prices
 */
export interface FuelPricesQueryParams {
  fuel_type?: string;
  fuel_type_id?: string;
  status?: string;
  effective_date_from?: string;
  effective_date_to?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get all fuel prices with optional filtering by fuel type
 * @param params Optional query parameters
 * @returns ApiResponse with array of fuel prices
 */
export async function getFuelPrices(
  params?: FuelPricesQueryParams
): Promise<ApiResponse<FuelPrice[]>> {
  return fetchFromFunction("fuel-prices", {
    queryParams: params,
  });
}

/**
 * Get a specific fuel price by ID
 * @param id The fuel price ID
 * @returns ApiResponse with the fuel price data
 */
export async function getFuelPriceById(
  id: string
): Promise<ApiResponse<FuelPrice>> {
  return fetchFromFunction(`fuel-prices/${id}`);
}

/**
 * Create a new fuel price
 * @param data The fuel price data to create
 * @returns ApiResponse with the created fuel price
 */
export async function createFuelPrice(data: {
  fuel_type: string;
  price_per_liter: number;
  effective_date: string;
}): Promise<ApiResponse<FuelPrice>> {
  return fetchFromFunction("fuel-prices", { method: "POST", body: data });
}

/**
 * Update an existing fuel price
 * @param id The fuel price ID to update
 * @param data The updated fuel price data
 * @returns ApiResponse with the updated fuel price
 */
export async function updateFuelPrice(
  id: string,
  data: Partial<{
    fuel_type: string;
    price_per_liter: number;
    effective_date: string;
    status?: string;
  }>
): Promise<ApiResponse<FuelPrice>> {
  return fetchFromFunction(`fuel-prices/${id}`, { method: "PUT", body: data });
}

/**
 * Delete a fuel price
 * @param id The fuel price ID to delete
 * @returns ApiResponse with success status
 */
export async function deleteFuelPrice(id: string): Promise<ApiResponse<void>> {
  return fetchFromFunction(`fuel-prices/${id}`, { method: "DELETE" });
}

/**
 * Fuel Prices API functions for managing fuel price data
 */
export const fuelPricesApi = {
  getFuelPrices,
  getFuelPriceById,
  createFuelPrice,
  updateFuelPrice,
  deleteFuelPrice,
};
