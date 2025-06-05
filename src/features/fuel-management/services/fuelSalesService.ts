import { supabase } from "@/core/api";
import type {
  FuelSale,
  FuelSaleFormData,
  FuelSaleFilters,
} from "../types/fuel-sales.types";

const EDGE_FUNCTION_URL = "/functions/sales";

export const fuelSalesService = {
  async getSales(filters?: FuelSaleFilters) {
    const queryParams = new URLSearchParams();

    if (filters?.shift_id) {
      queryParams.append("shift_id", filters.shift_id);
    }
    if (filters?.date_range?.start) {
      queryParams.append("start_date", filters.date_range.start);
    }
    if (filters?.date_range?.end) {
      queryParams.append("end_date", filters.date_range.end);
    }
    if (filters?.employee_id) {
      queryParams.append("employee", filters.employee_id);
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
