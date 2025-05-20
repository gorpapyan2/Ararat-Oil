/**
 * Fuel Prices Type Definitions
 * 
 * This file contains types specific to the fuel prices feature
 */

/**
 * Fuel Price model used within the feature
 */
export interface FuelPrice {
  id: string;
  fuel_type: string;
  fuel_type_id?: string;
  price_per_liter: number;
  effective_date: string;
  status?: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

/**
 * Data required to create a new fuel price
 */
export interface FuelPriceFormData {
  fuel_type: string;
  price_per_liter: number;
  effective_date: string;
  status?: 'active' | 'inactive';
}

/**
 * Filter options for fuel prices
 */
export interface FuelPriceFilters {
  fuel_type?: string;
  date_range?: {
    start: string;
    end: string;
  };
  status?: 'active' | 'inactive';
}

/**
 * Summary statistics for fuel prices
 */
export interface FuelPriceSummary {
  current_prices: Record<string, number>;
  price_changes: {
    last_24h: number;
    last_7d: number;
    last_30d: number;
  };
} 