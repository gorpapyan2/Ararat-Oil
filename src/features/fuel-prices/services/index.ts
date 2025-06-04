// Modern centralized services approach
import { useCentralizedEntity } from "@/hooks/useCentralizedEntity";
import { fuelPricesApi } from "@/services/api";
import type { FuelPrice as ApiFuelPrice } from "@/core/api/types";
import type {
  FuelPrice,
  FuelPriceFormData,
  FuelPriceFilters,
  FuelPriceSummary,
} from "../types";

// Modern hook-based approach
export const useFuelPricesModern = (options?: Parameters<typeof useCentralizedEntity>[1]) => 
  useCentralizedEntity<ApiFuelPrice>('fuel_prices', options);

// Re-export for backward compatibility
export { useCentralizedEntity } from "@/hooks/useCentralizedEntity";

// Helper function to adapt API price to feature type
function adaptApiToFeatureType(apiPrice: ApiFuelPrice): FuelPrice {
  return {
    id: apiPrice.id,
    fuel_type: apiPrice.fuel_type,
    fuel_type_id: apiPrice.fuel_type_id || "",
    price_per_liter: apiPrice.price_per_liter,
    effective_date: apiPrice.effective_date,
    status: (apiPrice.status as "active" | "inactive") || "active",
    created_at: apiPrice.created_at || "",
    updated_at: apiPrice.updated_at || "",
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureToApiType(priceData: FuelPriceFormData) {
  return {
    fuel_type: priceData.fuel_type,
    price_per_liter: priceData.price_per_liter,
    effective_date: priceData.effective_date,
    status: priceData.status || "active",
  };
}

/**
 * Get all fuel prices with optional filters
 */
export async function getFuelPrices(filters?: FuelPriceFilters): Promise<FuelPrice[]> {
  try {
    const response = await fuelPricesApi.getAll();
    if (response.error) {
      throw new Error(response.error);
    }
    
    // Handle case where data might be empty or not an array
    const data = response.data;
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    let prices = data.map((apiPrice: ApiFuelPrice) => adaptApiToFeatureType(apiPrice));

    // Apply client-side filtering if filters provided
    if (filters?.fuel_type) {
      prices = prices.filter((price: FuelPrice) => price.fuel_type === filters.fuel_type);
    }
    if (filters?.status) {
      prices = prices.filter((price: FuelPrice) => price.status === filters.status);
    }

    return prices;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch fuel prices');
  }
}

/**
 * Get fuel price by ID
 */
export async function getFuelPriceById(id: string): Promise<FuelPrice | null> {
  try {
    const response = await fuelPricesApi.getById(id);
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response.data ? adaptApiToFeatureType(response.data as ApiFuelPrice) : null;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch fuel price');
  }
}

/**
 * Create a new fuel price
 */
export async function createFuelPrice(priceData: FuelPriceFormData): Promise<FuelPrice> {
  try {
    const apiData = adaptFeatureToApiType(priceData);
    const response = await fuelPricesApi.create(apiData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from create operation');
    }
    
    return adaptApiToFeatureType(response.data as ApiFuelPrice);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create fuel price');
  }
}

/**
 * Update an existing fuel price
 */
export async function updateFuelPrice(id: string, priceData: Partial<FuelPriceFormData>): Promise<FuelPrice> {
  try {
    const response = await fuelPricesApi.update(id, priceData);
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    if (!response.data) {
      throw new Error('No data returned from update operation');
    }
    
    return adaptApiToFeatureType(response.data as ApiFuelPrice);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update fuel price');
  }
}

/**
 * Delete a fuel price
 */
export async function deleteFuelPrice(id: string): Promise<boolean> {
  try {
    const response = await fuelPricesApi.delete(id);
    return !response.error;
  } catch (error) {
    console.error('Error deleting fuel price:', error);
    return false;
  }
}

/**
 * Get current fuel prices
 */
export async function getCurrentPrices(): Promise<FuelPrice[]> {
  return getFuelPrices({ status: "active" });
}

/**
 * Get fuel price summary
 */
export async function getPriceSummary(): Promise<FuelPriceSummary> {
  try {
    const prices = await getFuelPrices();
    const currentPrices: Record<string, number> = {};
    
    // Get current price for each fuel type
    const fuelTypes = new Set(prices.map(p => p.fuel_type));
    
    fuelTypes.forEach(fuelType => {
      const typePrices = prices
        .filter(p => p.fuel_type === fuelType && p.status === "active")
        .sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime());
      
      if (typePrices.length > 0) {
        currentPrices[fuelType] = typePrices[0].price_per_liter;
      }
    });
    
    return {
      current_prices: currentPrices,
      price_changes: {
        last_24h: 0,
        last_7d: 0,
        last_30d: 0,
      },
    };
  } catch (error) {
    console.error("Error calculating price summary:", error);
    return {
      current_prices: {},
      price_changes: {
        last_24h: 0,
        last_7d: 0,
        last_30d: 0,
      },
    };
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
  getPriceSummary,
};
