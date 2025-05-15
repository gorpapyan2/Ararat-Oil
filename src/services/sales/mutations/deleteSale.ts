import { salesApi } from "@/core/api";

export const deleteSale = async (id: string): Promise<void> => {
  try {
    const response = await salesApi.delete(id);

    if (response.error) {
      console.error(`Error deleting sale with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err: any) {
    console.error(`Failed to delete sale with ID ${id}:`, err);
    throw new Error(err.message || "Failed to delete sale");
  }
};
