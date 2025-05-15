import { fillingSystemsApi, FillingSystem } from "@/core/api";

export interface CreateFillingSystemRequest {
  name: string;
  location: string;
  tank_ids: string[];
  status: 'active' | 'inactive' | 'maintenance';
}

export interface UpdateFillingSystemRequest {
  name?: string;
  location?: string;
  tank_ids?: string[];
  status?: 'active' | 'inactive' | 'maintenance';
}

export const fetchFillingSystems = async (): Promise<FillingSystem[]> => {
  try {
    const response = await fillingSystemsApi.getAll();

    if (response.error) {
      console.error("Error fetching filling systems:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch filling systems:", err);
    throw err;
  }
};

export const fetchFillingSystemById = async (id: string): Promise<FillingSystem | null> => {
  try {
    const response = await fillingSystemsApi.getById(id);

    if (response.error) {
      console.error(`Error fetching filling system with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch filling system with ID ${id}:`, err);
    throw err;
  }
};

export const createFillingSystem = async (system: CreateFillingSystemRequest): Promise<FillingSystem> => {
  try {
    const response = await fillingSystemsApi.create(system);

    if (response.error) {
      console.error("Error creating filling system:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error("Failed to create filling system:", err);
    throw err;
  }
};

export const updateFillingSystem = async (id: string, updates: UpdateFillingSystemRequest): Promise<FillingSystem> => {
  try {
    const response = await fillingSystemsApi.update(id, updates);

    if (response.error) {
      console.error(`Error updating filling system with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to update filling system with ID ${id}:`, err);
    throw err;
  }
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  try {
    const response = await fillingSystemsApi.delete(id);

    if (response.error) {
      console.error(`Error deleting filling system with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete filling system with ID ${id}:`, err);
    throw err;
  }
};

export const validateTankIds = async (tankIds: string[]): Promise<boolean> => {
  try {
    const response = await fillingSystemsApi.validateTankIds(tankIds);

    if (response.error) {
      console.error("Error validating tank IDs:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!.valid;
  } catch (err) {
    console.error("Failed to validate tank IDs:", err);
    throw err;
  }
};
