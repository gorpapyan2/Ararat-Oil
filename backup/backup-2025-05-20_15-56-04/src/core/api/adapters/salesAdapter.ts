/**
 * Sales Type Adapter
 * 
 * This file provides adapter functions to convert between the core API Sale type
 * and the application's Sale type as defined in src/types/index.ts.
 */

import { Sale as ApiSale } from '@/core/api/types';
import { Sale as AppSale, FuelTypeCode, PaymentStatus } from '@/types';

/**
 * Converts a core API Sale to the application Sale type
 */
export function adaptApiSaleToAppSale(apiSale: ApiSale): AppSale {
  // Handle fuel type conversion safely
  const fuelTypeMap: Record<string, FuelTypeCode> = {
    'diesel': 'diesel',
    'gas': 'gas',
    'petrol_regular': 'petrol_regular',
    'petrol_premium': 'petrol_premium'
  };

  // Default to diesel if unknown fuel type
  const fuelType: FuelTypeCode = 
    fuelTypeMap[apiSale.fuel_type_id] ? 
    fuelTypeMap[apiSale.fuel_type_id] as FuelTypeCode : 
    'diesel';

  // Map payment method to payment status
  const paymentStatus: PaymentStatus = 
    apiSale.payment_method === 'pending' ? 'pending' : 'completed';

  return {
    id: apiSale.id,
    date: apiSale.created_at,
    fuel_type: fuelType,
    quantity: apiSale.quantity,
    price_per_unit: apiSale.price_per_liter,
    total_sales: apiSale.total_price,
    payment_status: paymentStatus,
    filling_system_name: '', // This needs to be populated separately if needed
    meter_start: 0, // Default value
    meter_end: 0, // Default value
    filling_system_id: apiSale.filling_system_id,
    shift_id: apiSale.shift_id || '',
    created_at: apiSale.created_at
  };
}

/**
 * Converts an array of core API Sales to application Sale types
 */
export function adaptApiSalesToAppSales(apiSales: ApiSale[]): AppSale[] {
  return apiSales.map(adaptApiSaleToAppSale);
}

/**
 * Converts an application Sale to the core API Sale type
 */
export function adaptAppSaleToApiSale(appSale: AppSale): Omit<ApiSale, 'created_at' | 'updated_at'> {
  // Map payment status to payment method
  const paymentMethod: string = appSale.payment_status === 'pending' ? 'pending' : 'cash';

  return {
    id: appSale.id,
    filling_system_id: appSale.filling_system_id,
    fuel_type_id: appSale.fuel_type,
    quantity: appSale.quantity,
    price_per_liter: appSale.price_per_unit,
    total_price: appSale.total_sales,
    payment_method: paymentMethod,
    employee_id: '', // This needs to be populated separately
    shift_id: appSale.shift_id
  };
}

/**
 * Converts an array of application Sales to core API Sale types
 */
export function adaptAppSalesToApiSales(appSales: AppSale[]): Omit<ApiSale, 'created_at' | 'updated_at'>[] {
  return appSales.map(adaptAppSaleToApiSale);
} 