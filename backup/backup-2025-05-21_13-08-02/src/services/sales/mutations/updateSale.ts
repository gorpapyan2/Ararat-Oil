import { salesApi, Sale } from "@/core/api";

export interface UpdateSaleRequest {
  filling_system_id?: string;
  fuel_type_id?: string;
  quantity?: number;
  price_per_liter?: number;
  total_price?: number;
  payment_method?: string;
  employee_id?: string;
  shift_id?: string;
  comments?: string;
}

export const updateSale = async (
  id: string,
  updates: UpdateSaleRequest
): Promise<Sale> => {
  try {
    const response = await salesApi.updateSale(id, updates);

    if (response.error) {
      console.error(`Error updating sale with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err: any) {
    console.error(`Failed to update sale with ID ${id}:`, err);
    throw new Error(err.message || "Failed to update sale");
  }
};
