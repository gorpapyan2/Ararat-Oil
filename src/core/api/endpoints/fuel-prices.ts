import { fetchFromFunction, ApiResponse } from '../client';
import type { FuelPrice } from '../types';

/**
 * Fuel Prices API functions for managing fuel price data
 */
export const fuelPricesApi = {
  /**
   * Get all fuel prices with optional filtering by fuel type
   * @param fuelType Optional fuel type filter
   * @returns ApiResponse with array of fuel prices
   */
  getAll: (fuelType?: string): Promise<ApiResponse<FuelPrice[]>> => 
    fetchFromFunction('fuel-prices', {
      queryParams: fuelType ? { fuel_type: fuelType } : undefined,
    }),
  
  /**
   * Get a specific fuel price by ID
   * @param id The fuel price ID
   * @returns ApiResponse with the fuel price data
   */
  getById: (id: string): Promise<ApiResponse<FuelPrice>> => 
    fetchFromFunction(`fuel-prices/${id}`),
  
  /**
   * Create a new fuel price
   * @param data The fuel price data to create
   * @returns ApiResponse with the created fuel price
   */
  create: (data: { fuel_type: string; price_per_liter: number; effective_date: string }): Promise<ApiResponse<FuelPrice>> => 
    fetchFromFunction('fuel-prices', { method: 'POST', body: data }),
  
  /**
   * Update an existing fuel price
   * @param id The fuel price ID to update
   * @param data The updated fuel price data
   * @returns ApiResponse with the updated fuel price
   */
  update: (id: string, data: Partial<{ fuel_type: string; price_per_liter: number; effective_date: string; status?: string }>): Promise<ApiResponse<FuelPrice>> => 
    fetchFromFunction(`fuel-prices/${id}`, { method: 'PUT', body: data }),
  
  /**
   * Delete a fuel price
   * @param id The fuel price ID to delete
   * @returns ApiResponse with success status
   */
  delete: (id: string): Promise<ApiResponse<void>> => 
    fetchFromFunction(`fuel-prices/${id}`, { method: 'DELETE' }),
}; 