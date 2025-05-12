import { supabase } from './supabase';

export type FuelType = 'gas' | 'diesel' | 'petrol';

export interface FuelManagementSummary {
  tanks: {
    total: number;
    byType: Record<FuelType, number>;
    totalCapacity: number;
    totalCurrentLevel: number;
    utilizationRate: number;
    totalVolume: number;
    availableVolume: number;
    list: Array<{
      id: string;
      name: string;
      fuel_type: FuelType;
      capacity: number;
      current_level: number;
      utilization_rate: number;
      status?: string;
    }>;
  };
  supplies: {
    total: number;
    totalQuantity: number;
    totalCost: number;
    averagePrice: number;
    byType: Record<FuelType, {
      quantity: number;
      cost: number;
      averagePrice: number;
    }>;
    list: Array<{
      id: string;
      fuel_type: FuelType;
      date: string;
      quantity: number;
      cost: number;
    }>;
  };
  systems: {
    total: number;
    active: number;
    byTank: Record<string, number>;
    byType: Record<string, number>;
    list: Array<{
      id: string;
      tank_id: string;
      tank_name: string;
      status: string;
    }>;
  };
  alerts?: Array<{
    title: string;
    message: string;
    type: 'warning' | 'error' | 'info';
  }>;
  recentActivity: {
    supplies: Array<{
      id: string;
      delivery_date: string;
      provider_id: string;
      tank_id: string;
      quantity_liters: number;
      price_per_liter: number;
      employee_id: string;
      comments: string;
      total_cost: number;
      created_at: string;
      payment_status: string;
      payment_method: string | null;
      supplier?: string;
    }>;
    levelChanges: Array<{
      tank_id: string;
      tank_name: string;
      change_amount: number;
      previous_level: number;
      new_level: number;
      change_type: "add" | "subtract";
      created_at: string;
    }>;
  };
  trends: {
    dailyConsumption: Array<{
      date: string;
      quantity: number;
      cost: number;
    }>;
    tankUtilization: Array<{
      tank_id: string;
      tank_name: string;
      utilization_rate: number;
      trend: "up" | "down" | "stable";
    }>;
  };
  providersCount: number;
}

export interface FuelManagementFilters {
  startDate?: string;
  endDate?: string;
  tankId?: string;
  fuelType?: FuelType;
}

export const fuelManagementService = {
  async getSummary(filters: FuelManagementFilters = {}): Promise<FuelManagementSummary> {
    try {
      const { data, error } = await supabase.functions.invoke('fuel-management', {
        body: { filters }
      });

      if (error) {
        console.error('Error fetching fuel management summary:', error);
        throw new Error(error.message);
      }

      if (!data) {
        throw new Error('No data received from the server');
      }

      // Unwrap the 'data' property if present
      const summary = (data && 'data' in data) ? data.data : data;
      return summary as FuelManagementSummary;
    } catch (error) {
      console.error('Error in fuelManagementService.getSummary:', error);
      throw error;
    }
  }
}; 