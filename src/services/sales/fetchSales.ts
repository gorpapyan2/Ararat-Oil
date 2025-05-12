import { salesApi } from "@/services/api";
import { Sale } from "@/types";

export interface FetchSalesOptions {
  shift_id?: string;
  start_date?: string;
  end_date?: string;
  employee?: string;
}

export const fetchSales = async (options?: FetchSalesOptions): Promise<Sale[]> => {
  try {
    const { data, error } = await salesApi.getAll(options);

    if (error) {
      console.error("Error fetching sales:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err: any) {
    console.error("Failed to fetch sales:", err);
    throw new Error(err.message || "Failed to fetch sales data");
  }
};

export const fetchLatestSale = async (
  fillingSystemId: string,
): Promise<Sale | null> => {
  try {
    const { data, error } = await salesApi.getLatest(fillingSystemId);

    if (error) {
      console.error(`Error fetching latest sale for filling system ${fillingSystemId}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err: any) {
    console.error(`Failed to fetch latest sale for filling system ${fillingSystemId}:`, err);
    throw new Error(err.message || "Failed to fetch latest sale");
  }
};
