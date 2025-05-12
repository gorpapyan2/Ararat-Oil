import { fuelPricesApi } from "@/services/api";
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
  const { data, error } = await fuelPricesApi.getAll(fuelType);
  if (error) throw new Error(error);
  return data || [];
}

// Get a specific fuel price by ID
export async function getFuelPriceById(id: string): Promise<FuelPrice | null> {
  const { data, error } = await fuelPricesApi.getById(id);
  if (error) throw new Error(error);
  return data || null;
}

// Create a new fuel price
export async function createFuelPrice(price: Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>): Promise<FuelPrice> {
  const { data, error } = await fuelPricesApi.create(price);
  if (error) throw new Error(error);
  return data;
}

// Update a fuel price by ID
export async function updateFuelPrice(id: string, updates: Partial<Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>>): Promise<FuelPrice> {
  const { data, error } = await fuelPricesApi.update(id, updates);
  if (error) throw new Error(error);
  return data;
}

// Delete a fuel price by ID
export async function deleteFuelPrice(id: string): Promise<{ success: boolean }> {
  const { data, error } = await fuelPricesApi.delete(id);
  if (error) throw new Error(error);
  return data;
}

// Get fuel price history for a specific type or all types
export async function getFuelPriceHistory(fuelType?: FuelType, limit = 50): Promise<FuelPrice[]> {
  try {
    const { data, error } = await fuelPricesApi.getAll(fuelType);

    if (error) {
      console.error("Error fetching fuel price history:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch fuel price history:", err);
    throw err;
  }
}

// Set or update the fuel price for a specific type
export async function setFuelPrice(fuelType: FuelType, price: number): Promise<FuelPrice> {
  try {
    const { data, error } = await fuelPricesApi.create({
      fuel_type: fuelType,
      price_per_liter: price,
      effective_date: new Date().toISOString()
    });

    if (error) {
      console.error(`Error setting fuel price for ${fuelType}:`, error);
      throw new Error(error);
    }

    return data;
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
      const { data, error } = await fuelPricesApi.update(type, {
        price_per_liter: price,
        effective_date: new Date().toISOString()
      });
      
      if (error) {
        console.error(`Error updating price for ${type}:`, error);
        throw new Error(error);
      }
      
      if (data) {
        results[type as FuelTypeCode] = data;
      }
    }

    return results;
  } catch (err) {
    console.error("Failed to update all fuel prices:", err);
    throw err;
  }
} 