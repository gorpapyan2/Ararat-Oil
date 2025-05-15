import { supabase } from '@/lib/supabase';
import type {
  FuelTank,
  TankLevelChange,
  CreateTankRequest,
  UpdateTankRequest,
  TankLevelAdjustment,
  TankSummary,
} from '../types/tanks.types';

const EDGE_FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/tanks`;

export const tanksService = {
  async getTanks() {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/tanks', {
        method: 'GET',
      });

      if (error) throw error;
      return data.tanks as FuelTank[];
    } catch (error) {
      console.error('Error fetching tanks:', error);
      throw error;
    }
  },

  async getTankById(id: string) {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/tank', {
        method: 'GET',
        body: { id },
      });

      if (error) throw error;
      return data.tank as FuelTank;
    } catch (error) {
      console.error(`Error fetching tank with ID ${id}:`, error);
      throw error;
    }
  },

  async createTank(tank: CreateTankRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/tanks', {
        method: 'POST',
        body: tank,
      });

      if (error) throw error;
      return data.tank as FuelTank;
    } catch (error) {
      console.error('Error creating tank:', error);
      throw error;
    }
  },

  async updateTank(id: string, updates: UpdateTankRequest) {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/tank', {
        method: 'PUT',
        body: { id, ...updates },
      });

      if (error) throw error;
      return data.tank as FuelTank;
    } catch (error) {
      console.error(`Error updating tank with ID ${id}:`, error);
      throw error;
    }
  },

  async deleteTank(id: string) {
    try {
      const { error } = await supabase.functions.invoke('tanks/tank', {
        method: 'DELETE',
        body: { id },
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting tank with ID ${id}:`, error);
      throw error;
    }
  },

  async getTankLevelChanges(tankId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/level-changes', {
        method: 'GET',
        body: { tankId },
      });

      if (error) throw error;
      return data.levelChanges as TankLevelChange[];
    } catch (error) {
      console.error(`Error fetching level changes for tank ${tankId}:`, error);
      throw error;
    }
  },

  async adjustTankLevel(tankId: string, adjustment: TankLevelAdjustment) {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/level-changes', {
        method: 'POST',
        body: { tankId, ...adjustment },
      });

      if (error) throw error;
      return data.levelChange as TankLevelChange;
    } catch (error) {
      console.error(`Error adjusting level for tank ${tankId}:`, error);
      throw error;
    }
  },

  async getSummary() {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/summary', {
        method: 'GET',
      });

      if (error) throw error;
      return data.summary as TankSummary;
    } catch (error) {
      console.error('Error fetching tanks summary:', error);
      throw error;
    }
  },

  async getFuelTypes() {
    try {
      const { data, error } = await supabase.functions.invoke('tanks/fuel-types', {
        method: 'GET',
      });

      if (error) throw error;
      return data.fuelTypes as { id: string; name: string }[];
    } catch (error) {
      console.error('Error fetching fuel types:', error);
      throw error;
    }
  },
}; 