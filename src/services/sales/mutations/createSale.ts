import { salesApi } from "@/services/api";
import { Sale } from "@/types";

export interface CreateSaleRequest {
  quantity?: number;
  unit_price: number;
  meter_start: number;
  meter_end: number;
  filling_system_id: string;
  shift_id: string;
  comments?: string;
}

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  try {
    const { data: sale, error } = await salesApi.create(data);

    if (error) {
      console.error("Error creating sale:", error);
      throw new Error(error);
    }

    return sale;
  } catch (err: any) {
    console.error("Failed to create sale:", err);
    throw new Error(err.message || "Failed to create sale");
  }
};
