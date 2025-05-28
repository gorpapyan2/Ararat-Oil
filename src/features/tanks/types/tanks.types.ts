export interface FuelTank {
  id: string;
  name: string;
  fuel_type_id: string;
  fuel_type?: {
    id: string;
    name: string;
  };
  capacity: number;
  current_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

export interface TankLevelChange {
  id: string;
  tank_id: string;
  previous_level: number;
  new_level: number;
  change_amount: number;
  change_type: "add" | "subtract";
  reason?: string;
  created_at: string;
  created_by: string;
}

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

export interface TankLevelAdjustment {
  change_amount: number;
  change_type: "add" | "subtract";
  reason?: string;
}

export interface TankSummary {
  totalTanks: number;
  activeTanks: number;
  totalCapacity: number;
  totalCurrentLevel: number;
  lowLevelTanks: number;
  criticalLevelTanks: number;
}

export interface FuelType {
  id: string;
  name: string;
  code?: string;
  description?: string;
}
