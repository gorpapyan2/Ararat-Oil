import type { FuelPrice as ApiFuelPrice } from "@/core/api/types";
import type { FuelPrice, FuelPriceFormData } from "../types";

/**
 * Convert API FuelPrice to feature FuelPrice
 */
export function adaptApiResponseToFeatureType(
  apiPrice: ApiFuelPrice
): FuelPrice {
  return {
    id: apiPrice.id,
    fuel_type: apiPrice.fuel_type,
    fuel_type_id: apiPrice.fuel_type_id,
    price_per_liter: apiPrice.price_per_liter,
    effective_date: apiPrice.effective_date,
    status:
      apiPrice.status === "active" || apiPrice.status === "inactive"
        ? apiPrice.status
        : "active", // Default to active if invalid status
    created_at: apiPrice.created_at,
    updated_at: apiPrice.updated_at,
  };
}

/**
 * Convert feature FuelPriceFormData to API request data
 */
export function adaptFeatureTypeToApiRequest(priceData: FuelPriceFormData) {
  return {
    fuel_type: priceData.fuel_type,
    price_per_liter: priceData.price_per_liter,
    effective_date: priceData.effective_date,
    status: priceData.status,
  };
}
