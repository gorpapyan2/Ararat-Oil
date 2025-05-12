import { tanksApi } from "@/services/api";
import { FuelTank, TankLevelChange } from "@/types";

export interface CreateTankRequest {
  name: string;
  fuel_type_id: string;
  capacity: number;
  current_level: number;
  is_active: boolean;
}

export interface UpdateTankRequest {
  name?: string;
  fuel_type_id?: string;
  capacity?: number;
  current_level?: number;
  is_active?: boolean;
}

export const fetchTanks = async (): Promise<FuelTank[]> => {
  try {
    const { data, error } = await tanksApi.getAll();

    if (error) {
      console.error("Error fetching tanks:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch tanks:", err);
    throw err;
  }
};

export const fetchActiveTanks = async (): Promise<FuelTank[]> => {
  try {
    const { data, error } = await tanksApi.getAll();

    if (error) {
      console.error("Error fetching active tanks:", error);
      throw new Error(error);
    }

    return (data || []).filter(tank => tank.is_active);
  } catch (err) {
    console.error("Failed to fetch active tanks:", err);
    throw err;
  }
};

export const fetchTankById = async (id: string): Promise<FuelTank | null> => {
  try {
    const { data, error } = await tanksApi.getById(id);

    if (error) {
      console.error(`Error fetching tank with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch tank with ID ${id}:`, err);
    throw err;
  }
};

export const fetchTankLevelChanges = async (tankId: string): Promise<TankLevelChange[]> => {
  try {
    const { data, error } = await tanksApi.getLevelChanges(tankId);

    if (error) {
      console.error(`Error fetching level changes for tank ${tankId}:`, error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error(`Failed to fetch level changes for tank ${tankId}:`, err);
    throw err;
  }
};

export const createTank = async (tank: CreateTankRequest): Promise<FuelTank> => {
  try {
    const { data, error } = await tanksApi.create(tank);

    if (error) {
      console.error("Error creating tank:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create tank:", err);
    throw err;
  }
};

export const updateTank = async (id: string, updates: UpdateTankRequest): Promise<FuelTank> => {
  try {
    const { data, error } = await tanksApi.update(id, updates);

    if (error) {
      console.error(`Error updating tank with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update tank with ID ${id}:`, err);
    throw err;
  }
};

export const deleteTank = async (id: string): Promise<void> => {
  try {
    const { error } = await tanksApi.delete(id);

    if (error) {
      console.error(`Error deleting tank with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete tank with ID ${id}:`, err);
    throw err;
  }
};

export const adjustTankLevel = async (
  id: string, 
  changeAmount: number, 
  changeType: 'add' | 'subtract',
  reason?: string
): Promise<FuelTank> => {
  try {
    const { data, error } = await tanksApi.adjustLevel(id, changeAmount, changeType, reason);

    if (error) {
      console.error(`Error adjusting level for tank with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to adjust level for tank with ID ${id}:`, err);
    throw err;
  }
};

export const fetchFuelTanks = fetchTanks;

export const createFuelTank = createTank;

export const updateTankLevel = async (
  id: string,
  newLevel: number,
  reason?: string
): Promise<FuelTank> => {
  const currentTank = await fetchTankById(id);
  if (!currentTank) {
    throw new Error(`Tank with ID ${id} not found`);
  }

  const changeAmount = Math.abs(newLevel - currentTank.current_level);
  const changeType = newLevel > currentTank.current_level ? 'add' : 'subtract';

  return adjustTankLevel(id, changeAmount, changeType, reason);
};
