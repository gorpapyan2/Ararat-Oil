// Import centralized services from core API
import {
  salesApi,
  type Sale as APISale, 
  type SaleCreate, 
  type SaleUpdate 
} from "@/core/api";

import type { Sale } from "../types";
import type { FuelTypeCode, PaymentMethod } from "@/types";

// Helper function to adapt API sale to domain sale type
function adaptAPIToDomainSale(apiSale: APISale): Sale {
  return {
    id: apiSale.id,
    amount: apiSale.total_sales || (apiSale.liters * apiSale.price_per_unit),
    quantityLiters: apiSale.liters,
    unitPrice: apiSale.price_per_unit,
    saleDate: new Date(apiSale.date),
    fuelType: apiSale.fuel_type as FuelTypeCode,
    customerName: undefined, // Not available in API
    paymentMethod: adaptPaymentMethod("cash"), // Default since payment_method doesn't exist
    paymentStatus: "completed" as const,
    notes: undefined, // Not available in API
    createdAt: new Date(apiSale.created_at),
    updatedAt: apiSale.updated_at ? new Date(apiSale.updated_at) : null,
    fillingSystemId: apiSale.filling_system_id,
    shiftId: undefined, // Not available in API
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

// Helper function to reverse adapt payment method for API
function adaptPaymentMethodToAPI(paymentMethod: PaymentMethod): "cash" | "card" | "credit" {
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

// Helper function to adapt domain sale to API request
function adaptDomainToAPIRequest(saleData: Partial<Sale>): Partial<SaleCreate | SaleUpdate> {
  return {
    filling_system_id: saleData.fillingSystemId,
    fuel_type: saleData.fuelType,
    liters: saleData.quantityLiters,
    price_per_unit: saleData.unitPrice,
    total_sales: saleData.amount,
    date: saleData.saleDate instanceof Date ? saleData.saleDate.toISOString().split('T')[0] : saleData.saleDate,
  };
}

/**
 * Get all sales using core API
 */
export async function getSales(): Promise<Sale[]> {
  try {
    const response = await salesApi.getSales();
    const apiSales = response.data || [];
    return apiSales.map(adaptAPIToDomainSale);
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
    const apiSales = response.data || [];
    return apiSales.map(adaptAPIToDomainSale);
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

    return adaptAPIToDomainSale(response.data);
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
    const apiData = adaptDomainToAPIRequest(saleData);
    const response = await salesApi.createSale(apiData as SaleCreate);
    
    if (!response.data) {
      throw new Error('No sale data returned from API');
    }
    
    return adaptAPIToDomainSale(response.data);
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to create sale');
  }
}

/**
 * Update an existing sale using core API
 */
export async function updateSale(id: string, saleData: Partial<Sale>): Promise<Sale> {
  try {
    const apiData = adaptDomainToAPIRequest(saleData);
    const response = await salesApi.updateSale(id, apiData as SaleUpdate);
    
    if (!response.data) {
      throw new Error('No sale data returned from API');
    }
    
    return adaptAPIToDomainSale(response.data);
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
    const apiSales = response.data || [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return apiSales
      .filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= start && saleDate <= end;
      })
      .map(adaptAPIToDomainSale);
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
    const apiSales = response.data || [];
    
    return apiSales
      .filter(sale => sale.fuel_type === fuelType)
      .map(adaptAPIToDomainSale);
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

// Export the adapter functions for reuse
export { adaptAPIToDomainSale, adaptDomainToAPIRequest, adaptPaymentMethod, adaptPaymentMethodToAPI };
