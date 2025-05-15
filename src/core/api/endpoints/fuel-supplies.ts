/**
 * Fuel Supplies API
 * 
 * This file provides API functions for working with fuel supplies data.
 */

import { fetchFromFunction, ApiResponse } from '../client';
import { API_ENDPOINTS } from '@/core/config/api';
import type { FuelSupply, FuelSupplyCreate, FuelSupplyUpdate } from '../types';

const ENDPOINT = API_ENDPOINTS.FUNCTIONS.FUEL_SUPPLIES;

/**
 * Fetches all fuel supplies
 */
export async function getFuelSupplies(): Promise<ApiResponse<FuelSupply[]>> {
  return fetchFromFunction<FuelSupply[]>(ENDPOINT);
}

/**
 * Fetches a fuel supply by ID
 */
export async function getFuelSupplyById(id: string): Promise<ApiResponse<FuelSupply>> {
  return fetchFromFunction<FuelSupply>(`${ENDPOINT}/${id}`);
}

/**
 * Creates a new fuel supply
 */
export async function createFuelSupply(data: FuelSupplyCreate): Promise<ApiResponse<FuelSupply>> {
  return fetchFromFunction<FuelSupply>(ENDPOINT, {
    method: 'POST',
    body: data
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
    method: 'PUT',
    body: data
  });
}

/**
 * Deletes a fuel supply by ID
 */
export async function deleteFuelSupply(id: string): Promise<ApiResponse<{ success: boolean }>> {
  return fetchFromFunction<{ success: boolean }>(`${ENDPOINT}/${id}`, {
    method: 'DELETE'
  });
}

/**
 * Fuel supplies API object with all methods
 */
export const fuelSuppliesApi = {
  getAll: getFuelSupplies,
  getById: getFuelSupplyById,
  create: createFuelSupply,
  update: updateFuelSupply,
  delete: deleteFuelSupply
}; 