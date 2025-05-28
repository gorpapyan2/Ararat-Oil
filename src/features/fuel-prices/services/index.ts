// Re-export the original service and adapters
export * from "./fuel-prices.service";
export * from "./adapters";

// Import API endpoints
import { fuelPricesApi } from "@/core/api/endpoints/fuel-prices";
import type { FuelPrice as ApiFuelPrice } from "@/core/api/types";
import type {
  FuelPrice,
  FuelPriceFormData,
  FuelPriceFilters,
  FuelPriceSummary,
} from "../types";
import {
  getFuelPrices as getFilteredFuelPrices,
  fuelPricesService as originalService,
} from "./fuel-prices.service";

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiPrice: ApiFuelPrice): FuelPrice {
  return {
    id: apiPrice.id,
    fuel_type: apiPrice.fuel_type,
    fuel_type_id: apiPrice.fuel_type_id,
    price_per_liter: apiPrice.price_per_liter,
    effective_date: apiPrice.effective_date,
    status: (apiPrice.status as "active" | "inactive") || "active",
    created_at: apiPrice.created_at,
    updated_at: apiPrice.updated_at,
  };
}

// Helper function to adapt feature type to API request
function adaptFeatureTypeToApiRequest(priceData: FuelPriceFormData) {
  return {
    fuel_type: priceData.fuel_type,
    price_per_liter: priceData.price_per_liter,
    effective_date: priceData.effective_date,
    status: priceData.status,
  };
}

/**
 * Get all fuel prices with optional filters
 */
export async function getFuelPrices(
  filters?: FuelPriceFilters
): Promise<FuelPrice[]> {
  const apiParams = filters
    ? {
        fuel_type: filters.fuel_type,
        status: filters.status,
        start_date: filters.date_range?.start,
        end_date: filters.date_range?.end,
      }
    : undefined;

  const response = await fuelPricesApi.getFuelPrices(apiParams);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return (response.data || []).map(adaptApiResponseToFeatureType);
}

/**
 * Get a fuel price by ID
 */
export async function getFuelPriceById(id: string): Promise<FuelPrice | null> {
  const response = await fuelPricesApi.getFuelPriceById(id);

  if (response.error) {
    console.error("Error fetching fuel price:", response.error.message);
    return null;
  }

  if (!response.data) {
    return null;
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Create a new fuel price
 */
export async function createFuelPrice(
  priceData: FuelPriceFormData
): Promise<FuelPrice> {
  const apiData = adaptFeatureTypeToApiRequest(priceData);

  const response = await fuelPricesApi.createFuelPrice(apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Update an existing fuel price
 */
export async function updateFuelPrice(
  id: string,
  priceData: Partial<FuelPriceFormData>
): Promise<FuelPrice> {
  // For partial updates, only include provided fields
  const apiData: Partial<FuelPriceFormData> = {};

  if (priceData.fuel_type !== undefined)
    apiData.fuel_type = priceData.fuel_type;
  if (priceData.price_per_liter !== undefined)
    apiData.price_per_liter = priceData.price_per_liter;
  if (priceData.effective_date !== undefined)
    apiData.effective_date = priceData.effective_date;
  if (priceData.status !== undefined) apiData.status = priceData.status;

  const response = await fuelPricesApi.updateFuelPrice(id, apiData);

  if (response.error) {
    throw new Error(response.error.message);
  }

  if (!response.data) {
    throw new Error("No data returned from API");
  }

  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Delete a fuel price
 */
export async function deleteFuelPrice(id: string): Promise<boolean> {
  const response = await fuelPricesApi.deleteFuelPrice(id);

  if (response.error) {
    throw new Error(response.error.message);
  }

  return true;
}

/**
 * Get current prices for each fuel type
 */
export async function getCurrentPrices(): Promise<Record<string, number>> {
  const prices = await getFuelPrices({ status: "active" });

  return prices.reduce(
    (acc, price) => {
      acc[price.fuel_type] = price.price_per_liter;
      return acc;
    },
    {} as Record<string, number>
  );
}

/**
 * Get fuel price summary statistics
 */
export async function getPriceSummary(): Promise<FuelPriceSummary> {
  try {
    const prices = await getFilteredFuelPrices();
    const currentPrices: Record<string, number> = {};
    let last24hChanges = 0;
    let last7dChanges = 0;
    let last30dChanges = 0;

    // Get current date for comparisons
    const now = new Date();
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get latest price for each fuel type
    const fuelTypes = new Set(prices.map((p) => p.fuel_type));

    fuelTypes.forEach((fuelType) => {
      const typePrices = prices
        .filter((p) => p.fuel_type === fuelType)
        .sort(
          (a, b) =>
            new Date(b.effective_date).getTime() -
            new Date(a.effective_date).getTime()
        );

      if (typePrices.length > 0) {
        currentPrices[fuelType] = typePrices[0].price_per_liter;
      }
    });

    // Count price changes in time periods
    prices.forEach((price) => {
      const effectiveDate = new Date(price.effective_date);

      if (effectiveDate >= oneDayAgo) {
        last24hChanges++;
      }

      if (effectiveDate >= sevenDaysAgo) {
        last7dChanges++;
      }

      if (effectiveDate >= thirtyDaysAgo) {
        last30dChanges++;
      }
    });

    return {
      current_prices: currentPrices,
      price_changes: {
        last_24h: last24hChanges,
        last_7d: last7dChanges,
        last_30d: last30dChanges,
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

// Update service object to include the new function
export const fuelPricesService = {
  ...originalService,
  getPriceSummary,
};
