import { fuelPricesApi } from "@/core/api";
import { FuelPrice, FuelPriceFormData, FuelPriceFilters } from "../types";
import { adaptApiResponseToFeatureType, adaptFeatureTypeToApiRequest } from "./adapters";

// Get all fuel prices with optional filter
export async function getFuelPrices(filters?: FuelPriceFilters): Promise<FuelPrice[]> {
  try {
    const apiParams = filters ? {
      fuel_type: filters.fuel_type,
      status: filters.status,
      start_date: filters.date_range?.start,
      end_date: filters.date_range?.end
    } : undefined;

    const response = await fuelPricesApi.getFuelPrices(apiParams);
    if (response.error) throw new Error(response.error.message);
    return (response.data || []).map(adaptApiResponseToFeatureType);
  } catch (error) {
    console.error("Error fetching fuel prices:", error);
    throw error;
  }
}

// Get a specific fuel price by ID
export async function getFuelPriceById(id: string): Promise<FuelPrice | null> {
  try {
    const response = await fuelPricesApi.getFuelPriceById(id);
    if (response.error) throw new Error(response.error.message);
    if (!response.data) return null;
    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error(`Error fetching fuel price ${id}:`, error);
    throw error;
  }
}

// Create a new fuel price
export async function createFuelPrice(priceData: FuelPriceFormData): Promise<FuelPrice> {
  try {
    const apiData = adaptFeatureTypeToApiRequest(priceData);
    const response = await fuelPricesApi.createFuelPrice(apiData);
    if (response.error) throw new Error(response.error.message);
    if (!response.data) throw new Error('No data returned from API');
    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error("Error creating fuel price:", error);
    throw error;
  }
}

// Update a fuel price
export async function updateFuelPrice(id: string, priceData: Partial<FuelPriceFormData>): Promise<FuelPrice> {
  try {
    // For partial updates, only include provided fields
    const apiData: Partial<FuelPriceFormData> = {};
    
    if (priceData.fuel_type !== undefined) apiData.fuel_type = priceData.fuel_type;
    if (priceData.price_per_liter !== undefined) apiData.price_per_liter = priceData.price_per_liter;
    if (priceData.effective_date !== undefined) apiData.effective_date = priceData.effective_date;
    if (priceData.status !== undefined) apiData.status = priceData.status;
    
    const response = await fuelPricesApi.updateFuelPrice(id, apiData);
    if (response.error) throw new Error(response.error.message);
    if (!response.data) throw new Error('No data returned from API');
    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error(`Error updating fuel price ${id}:`, error);
    throw error;
  }
}

// Delete a fuel price
export async function deleteFuelPrice(id: string): Promise<boolean> {
  try {
    const response = await fuelPricesApi.deleteFuelPrice(id);
    if (response.error) throw new Error(response.error.message);
    return true;
  } catch (error) {
    console.error(`Error deleting fuel price ${id}:`, error);
    throw error;
  }
}

// Get current prices for each fuel type
export async function getCurrentPrices(): Promise<Record<string, number>> {
  try {
    const prices = await getFuelPrices({ status: 'active' });
    
    return prices.reduce((acc, price) => {
      acc[price.fuel_type] = price.price_per_liter;
      return acc;
    }, {} as Record<string, number>);
  } catch (error) {
    console.error("Error getting current prices:", error);
    throw error;
  }
}

// Export as an object for compatibility with existing code
export const fuelPricesService = {
  getFuelPrices,
  getFuelPriceById,
  createFuelPrice,
  updateFuelPrice,
  deleteFuelPrice,
  getCurrentPrices,
}; 