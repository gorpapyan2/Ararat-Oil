import { supabase } from "@/services/supabase";
import type {
  FuelSupply,
  FuelSupplyFormData,
  FuelSupplyFilters,
} from "../types/fuel-supplies.types";

export const fuelSuppliesService = {
  async getSupplies(filters?: FuelSupplyFilters) {
    let query = supabase
      .from("fuel_supplies")
      .select("*")
      .order("delivery_date", { ascending: false });

    if (filters) {
      if (filters.dateRange) {
        query = query
          .gte("delivery_date", filters.dateRange.from.toISOString())
          .lte("delivery_date", filters.dateRange.to.toISOString());
      }
      if (filters.providerId) {
        query = query.eq("provider_id", filters.providerId);
      }
      if (filters.tankId) {
        query = query.eq("tank_id", filters.tankId);
      }
      if (filters.paymentStatus) {
        query = query.eq("payment_status", filters.paymentStatus);
      }
      if (filters.searchQuery) {
        query = query.ilike("comments", `%${filters.searchQuery}%`);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as FuelSupply[];
  },

  async createSupply(supply: FuelSupplyFormData) {
    const { data, error } = await supabase
      .from("fuel_supplies")
      .insert({
        ...supply,
        total_cost: supply.quantity_liters * supply.price_per_liter,
      })
      .select()
      .single();

    if (error) throw error;
    return data as FuelSupply;
  },

  async updateSupply(id: string, supply: Partial<FuelSupplyFormData>) {
    const { data, error } = await supabase
      .from("fuel_supplies")
      .update({
        ...supply,
        total_cost:
          supply.quantity_liters && supply.price_per_liter
            ? supply.quantity_liters * supply.price_per_liter
            : undefined,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as FuelSupply;
  },

  async deleteSupply(id: string) {
    const { error } = await supabase
      .from("fuel_supplies")
      .delete()
      .eq("id", id);

    if (error) throw error;
  },
};
