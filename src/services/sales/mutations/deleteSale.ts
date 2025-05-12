import { salesApi } from "@/services/api";

export const deleteSale = async (id: string): Promise<void> => {
  try {
    const { error } = await salesApi.delete(id);

    if (error) {
      console.error(`Error deleting sale with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err: any) {
    console.error(`Failed to delete sale with ID ${id}:`, err);
    throw new Error(err.message || "Failed to delete sale");
  }
};
