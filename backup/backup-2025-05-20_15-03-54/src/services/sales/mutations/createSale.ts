import { salesApi, Sale } from "@/core/api";

export interface CreateSaleRequest {
  filling_system_id: string;
  fuel_type_id: string;
  quantity: number;
  price_per_liter: number;
  total_price: number;
  payment_method: string;
  employee_id: string;
  shift_id?: string;
  comments?: string;
}

export const createSale = async (data: CreateSaleRequest): Promise<Sale> => {
  try {
    const response = await salesApi.createSale(data);

    if (response.error) {
      console.error("Error creating sale:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err: any) {
    console.error("Failed to create sale:", err);
    throw new Error(err.message || "Failed to create sale");
  }
};
