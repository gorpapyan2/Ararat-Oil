import { salesApi } from "@/core/api";

export const deleteSale = async (id: string): Promise<void> => {
  try {
    const response = await salesApi.deleteSale(id);

    if (response.error) {
      console.error(`Error deleting sale with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err: unknown) {
    console.error("Error deleting sale:", err);
    throw err instanceof Error ? err : new Error("Failed to delete sale");
  }
};
