import { salesApi } from "@/core/api";
import {
  FuelSale,
  FuelSaleFormData,
  FuelSaleFilters,
  FuelSaleExportOptions,
} from "../types";
import {
  adaptApiResponseToFeatureType,
  adaptFeatureTypeToApiRequest,
} from "./adapters";

/**
 * Get all fuel sales with optional filtering
 */
export async function getFuelSales(
  filters?: FuelSaleFilters
): Promise<FuelSale[]> {
  try {
    const apiFilters = {
      shift_id: filters?.shift_id,
      start_date: filters?.date_range?.start,
      end_date: filters?.date_range?.end,
      employee: filters?.employee_id,
    };

    const response = await salesApi.getSales(apiFilters);

    if (response.error) {
      throw new Error(response.error.message);
    }

    let sales = (response.data || []).map(adaptApiResponseToFeatureType);

    // Apply any additional client-side filtering
    if (filters) {
      if (filters.fuel_type_id) {
        sales = sales.filter(
          (sale) => sale.fuel_type_id === filters.fuel_type_id
        );
      }

      if (filters.filling_system_id) {
        sales = sales.filter(
          (sale) => sale.filling_system_id === filters.filling_system_id
        );
      }

      if (filters.payment_method) {
        sales = sales.filter(
          (sale) => sale.payment_method === filters.payment_method
        );
      }

      if (filters.payment_status) {
        sales = sales.filter(
          (sale) => sale.payment_status === filters.payment_status
        );
      }

      if (filters.search_query) {
        const query = filters.search_query.toLowerCase();
        sales = sales.filter(
          (sale) =>
            sale.id.toLowerCase().includes(query) ||
            sale.filling_system_name?.toLowerCase().includes(query) ||
            sale.employee_name?.toLowerCase().includes(query)
        );
      }
    }

    return sales;
  } catch (error) {
    console.error("Error fetching fuel sales:", error);
    throw error;
  }
}

/**
 * Get a fuel sale by ID
 */
export async function getFuelSaleById(id: string): Promise<FuelSale | null> {
  try {
    const response = await salesApi.getSaleById(id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      return null;
    }

    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error(`Error fetching fuel sale ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new fuel sale
 */
export async function createFuelSale(
  saleData: FuelSaleFormData
): Promise<FuelSale> {
  try {
    const apiData = adaptFeatureTypeToApiRequest(saleData);

    const response = await salesApi.createSale(apiData);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data returned from API");
    }

    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error("Error creating fuel sale:", error);
    throw error;
  }
}

/**
 * Update an existing fuel sale
 */
export async function updateFuelSale(
  id: string,
  saleData: Partial<FuelSaleFormData>
): Promise<FuelSale> {
  try {
    // For partial updates, build a partial API request
    const apiData: Partial<ReturnType<typeof adaptFeatureTypeToApiRequest>> =
      {};

    if (saleData.filling_system_id !== undefined)
      apiData.filling_system_id = saleData.filling_system_id;
    if (saleData.fuel_type_id !== undefined)
      apiData.fuel_type_id = saleData.fuel_type_id;
    if (saleData.quantity !== undefined) apiData.quantity = saleData.quantity;
    if (saleData.price_per_liter !== undefined)
      apiData.price_per_liter = saleData.price_per_liter;
    if (saleData.total_price !== undefined)
      apiData.total_price = saleData.total_price;
    if (saleData.payment_method !== undefined)
      apiData.payment_method = saleData.payment_method;
    if (saleData.employee_id !== undefined)
      apiData.employee_id = saleData.employee_id;
    if (saleData.shift_id !== undefined) apiData.shift_id = saleData.shift_id;

    const response = await salesApi.updateSale(id, apiData);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      throw new Error("No data returned from API");
    }

    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error(`Error updating fuel sale ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a fuel sale
 */
export async function deleteFuelSale(id: string): Promise<boolean> {
  try {
    const response = await salesApi.deleteSale(id);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return true;
  } catch (error) {
    console.error(`Error deleting fuel sale ${id}:`, error);
    throw error;
  }
}

/**
 * Get the latest sale for a filling system
 */
export async function getLatestFuelSale(
  fillingSystemId: string
): Promise<FuelSale | null> {
  try {
    const response = await salesApi.getLatestSale(fillingSystemId);

    if (response.error) {
      throw new Error(response.error.message);
    }

    if (!response.data) {
      return null;
    }

    return adaptApiResponseToFeatureType(response.data);
  } catch (error) {
    console.error(
      `Error fetching latest sale for filling system ${fillingSystemId}:`,
      error
    );
    throw error;
  }
}

/**
 * Get sales count
 */
export async function getFuelSalesCount(): Promise<number> {
  try {
    const response = await salesApi.getSalesCount();

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.data?.count || 0;
  } catch (error) {
    console.error("Error fetching fuel sales count:", error);
    throw error;
  }
}

/**
 * Export sales data
 */
export async function exportFuelSales(
  options: FuelSaleExportOptions
): Promise<string> {
  try {
    // Convert format from 'xlsx' to 'excel' if needed
    const format = options.format === "xlsx" ? "excel" : options.format;

    const apiOptions = {
      startDate: options.date_range?.start || new Date().toISOString(),
      endDate: options.date_range?.end || new Date().toISOString(),
      format: format as "csv" | "pdf" | "excel", // Explicitly cast to expected type
      fields: options.include_fields,
    };

    return await salesApi.exportSales(apiOptions);
  } catch (error) {
    console.error("Error exporting fuel sales:", error);
    throw error;
  }
}

// Export as an object for compatibility with existing code
export const fuelSalesService = {
  getFuelSales,
  getFuelSaleById,
  createFuelSale,
  updateFuelSale,
  deleteFuelSale,
  getLatestFuelSale,
  getFuelSalesCount,
  exportFuelSales,
};
