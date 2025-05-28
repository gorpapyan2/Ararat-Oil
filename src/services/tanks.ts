import { tanksApi, Tank } from "@/core/api";
import { TankLevelChange } from "@/types";

export interface CreateTankRequest {
  name: string;
  fuel_type_id: string;
  capacity: number;
  current_level: number;
  status: "active" | "inactive" | "maintenance";
}

export interface UpdateTankRequest {
  name?: string;
  fuel_type_id?: string;
  capacity?: number;
  current_level?: number;
  status?: "active" | "inactive" | "maintenance";
}

export const fetchTanks = async (): Promise<Tank[]> => {
  try {
    const response = await tanksApi.getAll();

    if (response.error) {
      console.error("Error fetching tanks:", response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error("Failed to fetch tanks:", err);
    throw err;
  }
};

export const fetchActiveTanks = async (): Promise<Tank[]> => {
  try {
    const response = await tanksApi.getAll();

    if (response.error) {
      console.error("Error fetching active tanks:", response.error);
      throw new Error(response.error.message);
    }

    return (response.data || []).filter((tank) => tank.status === "active");
  } catch (err) {
    console.error("Failed to fetch active tanks:", err);
    throw err;
  }
};

export const fetchTankById = async (id: string): Promise<Tank | null> => {
  try {
    const response = await tanksApi.getById(id);

    if (response.error) {
      console.error(`Error fetching tank with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch tank with ID ${id}:`, err);
    throw err;
  }
};

export const fetchTankLevelChanges = async (
  tankId: string
): Promise<TankLevelChange[]> => {
  try {
    const response = await tanksApi.getLevelChanges(tankId);

    if (response.error) {
      console.error(
        `Error fetching level changes for tank ${tankId}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error(`Failed to fetch level changes for tank ${tankId}:`, err);
    throw err;
  }
};

export const createTank = async (tank: CreateTankRequest): Promise<Tank> => {
  try {
    const response = await tanksApi.create(tank);

    if (response.error) {
      console.error("Error creating tank:", response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error("Failed to create tank:", err);
    throw err;
  }
};

export const updateTank = async (
  id: string,
  updates: UpdateTankRequest
): Promise<Tank> => {
  try {
    const response = await tanksApi.update(id, updates);

    if (response.error) {
      console.error(`Error updating tank with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to update tank with ID ${id}:`, err);
    throw err;
  }
};

export const deleteTank = async (id: string): Promise<void> => {
  try {
    const response = await tanksApi.delete(id);

    if (response.error) {
      console.error(`Error deleting tank with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete tank with ID ${id}:`, err);
    throw err;
  }
};

export const adjustTankLevel = async (
  id: string,
  changeAmount: number,
  changeType: "add" | "subtract",
  reason?: string
): Promise<Tank> => {
  try {
    const response = await tanksApi.adjustLevel(
      id,
      changeAmount,
      changeType,
      reason
    );

    if (response.error) {
      console.error(
        `Error adjusting level for tank with ID ${id}:`,
        response.error
      );
      throw new Error(response.error.message);
    }

    return response.data!;
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
): Promise<Tank> => {
  const currentTank = await fetchTankById(id);
  if (!currentTank) {
    throw new Error(`Tank with ID ${id} not found`);
  }

  const changeAmount = Math.abs(newLevel - currentTank.current_level);
  const changeType = newLevel > currentTank.current_level ? "add" : "subtract";

  return adjustTankLevel(id, changeAmount, changeType, reason);
};
