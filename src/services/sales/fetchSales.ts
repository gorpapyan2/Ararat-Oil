import { salesApi, Sale } from "@/core/api";

export interface FetchSalesOptions {
  shift_id?: string;
  start_date?: string;
  end_date?: string;
}

export const fetchSales = async (
  options?: FetchSalesOptions
): Promise<Sale[]> => {
  try {
    const response = await salesApi.getSales(options);

    if (response.error) {
      console.error("Error fetching sales:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err: unknown) {
    console.error("Failed to fetch sales:", err);
    throw err instanceof Error ? err : new Error("Failed to fetch sales");
  }
};

export const fetchLatestSale = async (
  fillingSystemId: string
): Promise<Sale | null> => {
  try {
    const response = await salesApi.getLatestSale(fillingSystemId);

    if (response.error) {
      console.error(
        `Error fetching latest sale for filling system ${fillingSystemId}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err: unknown) {
    console.error(
      `Failed to fetch latest sale for filling system ${fillingSystemId}:`,
      err
    );
    throw err instanceof Error ? err : new Error("Failed to fetch latest sale");
  }
};
