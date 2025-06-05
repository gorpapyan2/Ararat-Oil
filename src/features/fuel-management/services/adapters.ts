import type { Sale as ApiSale } from "@/core/api/types";
import type { FuelSale, FuelSaleFormData } from "../types";

/**
 * Convert API Sale to feature FuelSale
 */
export function adaptApiResponseToFeatureType(apiSale: ApiSale): FuelSale {
  return {
    id: apiSale.id,
    filling_system_id: apiSale.filling_system_id,
    fuel_type_id: apiSale.fuel_type_id,
    quantity: apiSale.quantity,
    price_per_liter: apiSale.price_per_liter,
    total_price: apiSale.total_price,
    payment_method: apiSale.payment_method,
    payment_status:
      apiSale.payment_method === "pending" ? "pending" : "completed", // Default assumption
    employee_id: apiSale.employee_id,
    shift_id: apiSale.shift_id,
    created_at: apiSale.created_at,
    updated_at: apiSale.updated_at,
  };
}

/**
 * Convert feature FuelSaleFormData to API request data
 */
export function adaptFeatureTypeToApiRequest(
  saleData: FuelSaleFormData
): Omit<ApiSale, "id" | "created_at" | "updated_at"> {
  return {
    filling_system_id: saleData.filling_system_id,
    fuel_type_id: saleData.fuel_type_id,
    quantity: saleData.quantity,
    price_per_liter: saleData.price_per_liter,
    total_price: saleData.total_price,
    payment_method: saleData.payment_method,
    employee_id: saleData.employee_id,
    shift_id: saleData.shift_id,
    // Other optional fields
  };
}
