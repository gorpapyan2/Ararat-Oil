/**
 * Fuel Sales Type Definitions
 *
 * This file contains types specific to the fuel sales feature
 */

/**
 * Fuel Sale model used within the feature
 */
export interface FuelSale {
  id: string;
  filling_system_id: string;
  filling_system_name?: string;
  fuel_type_id: string;
  fuel_type_name?: string;
  quantity: number;
  price_per_liter: number;
  total_price: number;
  payment_method: "cash" | "card" | "credit" | "transfer" | string;
  payment_status?: "completed" | "pending" | "cancelled";
  employee_id: string;
  employee_name?: string;
  shift_id?: string;
  transaction_date?: string;
  created_at: string;
  updated_at: string;
  notes?: string;
}

/**
 * Data required to create a new fuel sale
 */
export interface FuelSaleFormData {
  filling_system_id: string;
  fuel_type_id: string;
  quantity: number;
  price_per_liter: number;
  total_price: number;
  payment_method: string;
  employee_id: string;
  shift_id?: string;
  notes?: string;
}

/**
 * Filter options for fuel sales
 */
export interface FuelSaleFilters {
  date_range?: {
    start: string;
    end: string;
  };
  fuel_type_id?: string;
  filling_system_id?: string;
  payment_method?: string;
  payment_status?: string;
  employee_id?: string;
  shift_id?: string;
  search_query?: string;
}

/**
 * Export options for fuel sales
 */
export interface FuelSaleExportOptions {
  date_range?: {
    start: string;
    end: string;
  };
  format: "csv" | "xlsx" | "pdf";
  include_fields: string[];
}

/**
 * Summary statistics for fuel sales
 */
export interface FuelSaleSummary {
  total_sales: number;
  total_quantity: number;
  average_price: number;
  sales_by_fuel_type: Record<
    string,
    {
      quantity: number;
      amount: number;
    }
  >;
  sales_by_payment_method: Record<string, number>;
  daily_sales: Array<{
    date: string;
    amount: number;
    quantity: number;
  }>;
}
