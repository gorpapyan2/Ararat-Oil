import { fillingSystemsApi } from "@/services/api";
import { FillingSystem } from "@/types";

export interface CreateFillingSystemRequest {
  name: string;
  tank_id: string;
}

export interface UpdateFillingSystemRequest {
  name?: string;
  tank_id?: string;
}

export const fetchFillingSystems = async (): Promise<FillingSystem[]> => {
  try {
    const { data, error } = await fillingSystemsApi.getAll();

    if (error) {
      console.error("Error fetching filling systems:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch filling systems:", err);
    throw err;
  }
};

export const fetchFillingSystemById = async (id: string): Promise<FillingSystem | null> => {
  try {
    const { data, error } = await fillingSystemsApi.getById(id);

    if (error) {
      console.error(`Error fetching filling system with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch filling system with ID ${id}:`, err);
    throw err;
  }
};

export const createFillingSystem = async (system: CreateFillingSystemRequest): Promise<FillingSystem> => {
  try {
    const { data, error } = await fillingSystemsApi.create(system);

    if (error) {
      console.error("Error creating filling system:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create filling system:", err);
    throw err;
  }
};

export const updateFillingSystem = async (id: string, updates: UpdateFillingSystemRequest): Promise<FillingSystem> => {
  try {
    const { data, error } = await fillingSystemsApi.update(id, updates);

    if (error) {
      console.error(`Error updating filling system with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update filling system with ID ${id}:`, err);
    throw err;
  }
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  try {
    const { error } = await fillingSystemsApi.delete(id);

    if (error) {
      console.error(`Error deleting filling system with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete filling system with ID ${id}:`, err);
    throw err;
  }
};

export const validateTankIds = async (tankIds: string[]): Promise<boolean> => {
  try {
    const { data, error } = await fillingSystemsApi.validateTankIds(tankIds);

    if (error) {
      console.error("Error validating tank IDs:", error);
      throw new Error(error);
    }

    return data.valid;
  } catch (err) {
    console.error("Failed to validate tank IDs:", err);
    throw err;
  }
};

export type { FillingSystem };
