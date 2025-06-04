// Import centralized services from core API
import {
  salesApi,
  type Sale as CentralizedSale, 
  type SaleCreate, 
  type SaleUpdate 
} from "@/core/api";

import type { Sale } from "../types";
import type { FuelTypeCode, PaymentMethod } from "@/types";

// Helper function to adapt centralized sale to feature type
function adaptCentralizedToFeatureType(centralizedSale: CentralizedSale): Sale {
  return {
    id: centralizedSale.id,
    customerName: "", // Not available in centralized sale
    fuelType: centralizedSale.fuel_type_id as FuelTypeCode,
    quantityLiters: centralizedSale.quantity,
    unitPrice: centralizedSale.price_per_liter,
    amount: centralizedSale.total_price,
    saleDate: new Date(centralizedSale.created_at),
    paymentMethod: adaptPaymentMethod(centralizedSale.payment_method as "cash" | "card" | "credit"),
    paymentStatus: "completed", // Default status from centralized service
    notes: "",
    createdAt: new Date(centralizedSale.created_at || new Date().toISOString()),
    updatedAt: centralizedSale.updated_at ? new Date(centralizedSale.updated_at) : null,
    fillingSystemId: centralizedSale.filling_system_id,
  };
}

// Helper function to adapt payment method types
function adaptPaymentMethod(paymentMethod?: "cash" | "card" | "credit"): PaymentMethod {
  switch (paymentMethod) {
    case "cash":
      return "cash";
    case "card":
    case "credit":
      return "credit_card";
    default:
      return "cash";
  }
}

// Helper function to reverse adapt payment method for centralized service
function adaptPaymentMethodToCentralized(paymentMethod: PaymentMethod): "cash" | "card" | "credit" {
  switch (paymentMethod) {
    case "credit_card":
    case "debit_card":
    case "card":
      return "card";
    case "bank_transfer":
    case "mobile_payment":
      return "credit";
    default:
      return "cash";
  }
}

// Helper function to adapt feature type to centralized request
function adaptFeatureTypeToCentralizedRequest(saleData: Partial<Sale>): Partial<SaleCreate | SaleUpdate> {
  return {
    filling_system_id: saleData.fillingSystemId,
    fuel_type_id: saleData.fuelType,
    quantity: saleData.quantityLiters,
    price_per_liter: saleData.unitPrice,
    total_price: saleData.amount,
    payment_method: saleData.paymentMethod ? adaptPaymentMethodToCentralized(saleData.paymentMethod) : undefined,
    employee_id: "default-employee", // Required field - would need to be passed in
  };
}

/**
 * Get all sales using core API
 */
export async function getSales(): Promise<Sale[]> {
  try {
    const response = await salesApi.getSales();
    const centralizedSales = response.data || [];
    return centralizedSales.map(adaptCentralizedToFeatureType);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch sales');
  }
}

/**
 * Get active sales using core API
 */
export async function getActiveSales(): Promise<Sale[]> {
  try {
    // Use regular getSales since getActiveSales doesn't exist
    const response = await salesApi.getSales();
    const centralizedSales = response.data || [];
    return centralizedSales.map(adaptCentralizedToFeatureType);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch active sales');
  }
}

/**
 * Get a sale by ID using core API
 */
export async function getSaleById(id: string): Promise<Sale | null> {
  try {
    const response = await salesApi.getSaleById(id);
    
    if (!response.data) {
      return null;
    }

    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    console.error("Error fetching sale:", error);
    return null;
  }
}

/**
 * Create a new sale using core API
 */
export async function createSale(saleData: Partial<Sale>): Promise<Sale> {
  try {
    const centralizedData = adaptFeatureTypeToCentralizedRequest(saleData);
    const response = await salesApi.createSale(centralizedData as SaleCreate);
    
    if (!response.data) {
      throw new Error('No sale data returned from API');
    }
    
    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create sale');
  }
}

/**
 * Update an existing sale using core API
 */
export async function updateSale(id: string, saleData: Partial<Sale>): Promise<Sale> {
  try {
    const centralizedData = adaptFeatureTypeToCentralizedRequest(saleData);
    const response = await salesApi.updateSale(id, centralizedData as SaleUpdate);
    
    if (!response.data) {
      throw new Error('No sale data returned from API');
    }
    
    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to update sale');
  }
}

/**
 * Delete a sale using core API
 */
export async function deleteSale(id: string): Promise<boolean> {
  try {
    await salesApi.deleteSale(id);
    return true;
  } catch (error) {
    console.error('Error deleting sale:', error);
    return false;
  }
}

/**
 * Get sales by date range using core API
 */
export async function getSalesByDateRange(startDate: string, endDate: string): Promise<Sale[]> {
  try {
    // Use basic getSales and filter client-side since getSalesByDateRange doesn't exist
    const response = await salesApi.getSales();
    const centralizedSales = response.data || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return centralizedSales
      .filter(sale => {
        const saleDate = new Date(sale.created_at);
        return saleDate >= start && saleDate <= end;
      })
      .map(adaptCentralizedToFeatureType);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch sales by date range');
  }
}

/**
 * Get sales by fuel type using core API
 */
export async function getSalesByFuelType(fuelType: string): Promise<Sale[]> {
  try {
    // Use basic getSales and filter client-side since getSalesByFuelType doesn't exist
    const response = await salesApi.getSales();
    const centralizedSales = response.data || [];
    
    return centralizedSales
      .filter(sale => sale.fuel_type_id === fuelType)
      .map(adaptCentralizedToFeatureType);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch sales by fuel type');
  }
}

/**
 * Get sales summary statistics using core API
 */
export async function getSalesSummary(): Promise<{
  totalSales: number;
  totalAmount: number;
  totalQuantity: number;
  averageAmount: number;
}> {
  try {
    const sales = await getSales();
    const totalSales = sales.length;
    const totalAmount = sales.reduce((sum, sale) => sum + sale.amount, 0);
    const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantityLiters, 0);
    const averageAmount = totalSales > 0 ? totalAmount / totalSales : 0;

    return {
      totalSales,
      totalAmount,
      totalQuantity,
      averageAmount,
    };
  } catch (error) {
    console.error("Error calculating sales summary:", error);
    return {
      totalSales: 0,
      totalAmount: 0,
      totalQuantity: 0,
      averageAmount: 0,
    };
  }
}

// Export as an object for compatibility with existing code
export const salesService = {
  getSales,
  getActiveSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  getSalesByDateRange,
  getSalesByFuelType,
  getSalesSummary,
};
