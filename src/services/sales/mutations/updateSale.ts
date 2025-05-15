import { salesApi } from "@/services/api";
import { Sale } from "@/types";

export interface UpdateSaleRequest {
  price_per_unit?: number;
  payment_status?: string;
  meter_start?: number;
  meter_end?: number;
  shift_id?: string;
  comments?: string;
}

export const updateSale = async (
  id: string,
  updates: UpdateSaleRequest
): Promise<Sale> => {
  try {
    const { data, error } = await salesApi.update(id, updates);

    if (error) {
      console.error(`Error updating sale with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err: any) {
    console.error(`Failed to update sale with ID ${id}:`, err);
    throw new Error(err.message || "Failed to update sale");
  }
};
