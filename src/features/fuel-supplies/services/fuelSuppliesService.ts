import { fuelSuppliesApi } from "@/core/api";
import type {
  FuelSupply,
  FuelSupplyCreate,
  FuelSupplyUpdate,
} from "@/core/api";

export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  try {
    const response = await fuelSuppliesApi.getFuelSupplies();
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error?.message || 'Failed to fetch fuel supplies');
  } catch (error) {
    console.error('Error fetching fuel supplies:', error);
    return [];
  }
}

export async function createFuelSupply(supply: FuelSupplyCreate): Promise<FuelSupply> {
  try {
    const response = await fuelSuppliesApi.createFuelSupply(supply);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error?.message || 'Failed to create fuel supply');
  } catch (error) {
    console.error('Error creating fuel supply:', error);
    throw error;
  }
}

export async function updateFuelSupply(id: string, updates: FuelSupplyUpdate): Promise<FuelSupply> {
  try {
    const response = await fuelSuppliesApi.updateFuelSupply(id, updates);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.error?.message || 'Failed to update fuel supply');
  } catch (error) {
    console.error('Error updating fuel supply:', error);
    throw error;
  }
}

export async function deleteFuelSupply(id: string): Promise<void> {
  try {
    const response = await fuelSuppliesApi.deleteFuelSupply(id);
    if (response.error) {
      throw new Error(response.error.message || 'Failed to delete fuel supply');
    }
  } catch (error) {
    console.error('Error deleting fuel supply:', error);
    throw error;
  }
}
