import { supabase } from "@/services/supabase";
import type {
  FuelSale,
  FuelSaleFormData,
  FuelSaleFilters,
} from "../types/fuel-sales.types";

const EDGE_FUNCTION_URL = "/functions/sales";

export const fuelSalesService = {
  async getSales(filters?: FuelSaleFilters) {
    const queryParams = new URLSearchParams();

    if (filters?.shiftId) {
      queryParams.append("shift_id", filters.shiftId);
    }
    if (filters?.startDate) {
      queryParams.append("start_date", filters.startDate);
    }
    if (filters?.endDate) {
      queryParams.append("end_date", filters.endDate);
    }
    if (filters?.employeeId) {
      queryParams.append("employee", filters.employeeId);
    }

    const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_URL, {
      method: "GET",
      body: { query: Object.fromEntries(queryParams) },
    });

    if (error) throw error;
    return data as FuelSale[];
  },

  async createSale(sale: FuelSaleFormData) {
    const { data, error } = await supabase.functions.invoke(EDGE_FUNCTION_URL, {
      method: "POST",
      body: sale,
    });

    if (error) throw error;
    return data as FuelSale;
  },

  async updateSale(id: string, sale: Partial<FuelSaleFormData>) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/${id}`,
      {
        method: "PUT",
        body: sale,
      }
    );

    if (error) throw error;
    return data as FuelSale;
  },

  async deleteSale(id: string) {
    const { error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/${id}`,
      {
        method: "DELETE",
      }
    );

    if (error) throw error;
  },

  async getSaleById(id: string) {
    const { data, error } = await supabase.functions.invoke(
      `${EDGE_FUNCTION_URL}/${id}`,
      {
        method: "GET",
      }
    );

    if (error) throw error;
    return data as FuelSale;
  },
};
