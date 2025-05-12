import { FuelSupply } from "@/types";
import { fuelSuppliesApi } from "@/services/api";

/**
 * Fetch all fuel supply records with related provider, tank, and employee details.
 * @returns {Promise<FuelSupply[]>}
 * @throws {Error} If fetching data fails
 */
export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  try {
    console.log("Fetching fuel supplies from Edge Function...");
    
    const { data, error } = await fuelSuppliesApi.getAll();
    
    if (error) {
      console.error("Error fetching fuel supplies:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("No fuel supplies found");
      return [];
    }
    
    console.log(`Successfully fetched ${data.length} fuel supplies`);
    return data as FuelSupply[];
  } catch (e) {
    console.error("Exception fetching fuel supplies:", e);
    return []; // Return empty array instead of throwing
  }
}

export async function createFuelSupply(
  supply: Omit<FuelSupply, "id" | "created_at">,
): Promise<FuelSupply> {
  try {
    // Use Edge Function to create the fuel supply
    const { data, error } = await fuelSuppliesApi.create(supply);
    
    if (error) {
      throw new Error(`Failed to create fuel supply: ${error}`);
    }
    
    if (!data) {
      throw new Error("No data returned after creating fuel supply");
    }
    
    console.log("Created fuel supply:", data);
    return data as FuelSupply;
  } catch (error) {
    console.error("Error creating fuel supply:", error);
    throw error;
  }
}

export async function updateFuelSupply(
  id: string,
  updates: Partial<Omit<FuelSupply, "id" | "created_at">>,
): Promise<FuelSupply> {
  try {
    // Use Edge Function to update the fuel supply
    const { data, error } = await fuelSuppliesApi.update(id, updates);
    
    if (error) {
      throw new Error(`Failed to update fuel supply: ${error}`);
    }
    
    if (!data) {
      throw new Error("No data returned after updating fuel supply");
    }
    
    console.log("Updated fuel supply:", data);
    return data as FuelSupply;
  } catch (error) {
    console.error("Error updating fuel supply:", error);
    throw error;
  }
}

export async function deleteFuelSupply(id: string): Promise<void> {
  try {
    // Use Edge Function to delete the fuel supply
    const { error } = await fuelSuppliesApi.delete(id);
    
    if (error) {
      throw new Error(`Failed to delete fuel supply: ${error}`);
    }
    
    console.log("Deleted fuel supply with ID:", id);
  } catch (error) {
    console.error("Error deleting fuel supply:", error);
    throw error;
  }
}
