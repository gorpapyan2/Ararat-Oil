import { fuelPricesApi, FuelPrice, ApiError } from "@/core/api";
import { FuelType, FuelTypeCode } from "@/types";

export interface FuelPrice {
  id: string;
  fuel_type: FuelType;
  fuel_type_id?: string;
  price_per_liter: number;
  effective_date: string;
  created_at?: string;
  updated_at?: string;
}

// List all fuel prices, optionally filter by fuel type
export async function getFuelPrices(fuelType?: FuelType): Promise<FuelPrice[]> {
  const response = await fuelPricesApi.getAll(fuelType);
  if (response.error) throw new Error(response.error.message);
  return response.data || [];
}

// Get a specific fuel price by ID
export async function getFuelPriceById(id: string): Promise<FuelPrice | null> {
  const response = await fuelPricesApi.getById(id);
  if (response.error) throw new Error(response.error.message);
  return response.data || null;
}

// Create a new fuel price
export async function createFuelPrice(price: Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>): Promise<FuelPrice> {
  const response = await fuelPricesApi.create(price);
  if (response.error) throw new Error(response.error.message);
  return response.data!;
}

// Update a fuel price by ID
export async function updateFuelPrice(id: string, updates: Partial<Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>>): Promise<FuelPrice> {
  const response = await fuelPricesApi.update(id, updates);
  if (response.error) throw new Error(response.error.message);
  return response.data!;
}

// Delete a fuel price by ID
export async function deleteFuelPrice(id: string): Promise<{ success: boolean }> {
  const response = await fuelPricesApi.delete(id);
  if (response.error) throw new Error(response.error.message);
  return { success: true };
}

// Get fuel price history for a specific type or all types
export async function getFuelPriceHistory(fuelType?: FuelType, limit = 50): Promise<FuelPrice[]> {
  try {
    const response = await fuelPricesApi.getAll(fuelType);

    if (response.error) {
      console.error("Error fetching fuel price history:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch fuel price history:", err);
    throw err;
  }
}

// Set or update the fuel price for a specific type
export async function setFuelPrice(fuelType: FuelType, price: number): Promise<FuelPrice> {
  try {
    const response = await fuelPricesApi.create({
      fuel_type: fuelType,
      price_per_liter: price,
      effective_date: new Date().toISOString()
    });

    if (response.error) {
      console.error(`Error setting fuel price for ${fuelType}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to set fuel price for ${fuelType}:`, err);
    throw err;
  }
}

// Update prices for all fuel types at once
export async function updateAllFuelPrices(
  prices: Record<FuelTypeCode, number>
): Promise<Record<FuelTypeCode, FuelPrice>> {
  try {
    const results: Record<FuelTypeCode, FuelPrice> = {} as Record<FuelTypeCode, FuelPrice>;
    
    for (const [type, price] of Object.entries(prices)) {
      const response = await fuelPricesApi.update(type, {
        price_per_liter: price,
        effective_date: new Date().toISOString()
      });
      
      if (response.error) {
        console.error(`Error updating price for ${type}:`, response.error);
        throw new Error(response.error.message);
      }
      
      if (response.data) {
        results[type as FuelTypeCode] = response.data;
      }
    }

    return results;
  } catch (err) {
    console.error("Failed to update all fuel prices:", err);
    throw err;
  }
} 