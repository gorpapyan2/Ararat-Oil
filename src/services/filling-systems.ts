import { supabase } from "@/integrations/supabase/client";
import { FuelTank, FuelType } from "@/types";

export interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
  tank?: FuelTank;
  created_at?: string;
}

export const createFillingSystem = async (name: string, tankId: string): Promise<FillingSystem> => {
  const { data, error } = await supabase
    .from('filling_systems')
    .insert([{ name, tank_id: tankId }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

// Helper function to check if tank_ids exist in the fuel_tanks table
export const validateTankIds = async (tankIds: string[]): Promise<Record<string, boolean>> => {
  if (!tankIds.length) return {};
  
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('id')
    .in('id', tankIds);
    
  if (error) {
    console.error('Error validating tank IDs:', error);
    return {};
  }
  
  const validIds = new Set((data || []).map(tank => tank.id));
  const result: Record<string, boolean> = {};
  
  tankIds.forEach(id => {
    result[id] = validIds.has(id);
  });
  
  return result;
};

export const fetchFillingSystems = async (): Promise<FillingSystem[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required');
    }

    // Use foreign table syntax instead of nested select
    const { data, error } = await supabase
      .from('filling_systems')
      .select(`
        id,
        name,
        tank_id,
        created_at,
        tank:fuel_tanks(id, name, capacity, current_level, fuel_type, created_at)
      `)
      .order('name');
      
    if (error) {
      console.error('Error fetching filling systems:', error);
      throw error;
    }

    if (!data) {
      return [];
    }
    
    // Debug raw data from Supabase
    console.log('Raw filling systems data:', JSON.stringify(data, null, 2));
    
    // Collect all tank_ids for validation
    const tankIds = data
      .map(item => item.tank_id)
      .filter(id => id != null && id !== '');
      
    // Validate if tank_ids actually exist
    const validTankIds = await validateTankIds(tankIds);
    console.log('Tank ID validation results:', validTankIds);
    
    // Transform the data to ensure proper typing of nested tank objects
    return data.map(item => {
      // Debug each item's tank data
      console.log(`Processing system "${item.name}" (ID: ${item.id}), tank_id: ${item.tank_id}`);
      console.log('Tank data:', item.tank);
      
      // Handle tank data - Supabase can return either an array or object depending on the query
      let tankData = null;
      
      if (item.tank) {
        // If it's an array, take the first item
        if (Array.isArray(item.tank) && item.tank.length > 0) {
          tankData = item.tank[0];
        } 
        // If it's a direct object (non-array), use it directly
        else if (typeof item.tank === 'object') {
          tankData = item.tank;
        }
      }
      
      if (!tankData) {
        console.log(`WARNING: No tank data found for system "${item.name}" with tank_id: ${item.tank_id}`);
        
        // Additional check: Verify if the tank_id exists but wasn't joined properly
        if (item.tank_id) {
          const tankExists = validTankIds[item.tank_id];
          console.log(`System has tank_id (${item.tank_id}) - tank exists in database: ${tankExists ? 'YES' : 'NO'}`);
        }
      }
      
      return {
        id: item.id,
        name: item.name,
        tank_id: item.tank_id,
        created_at: item.created_at,
        tank: tankData ? {
          id: tankData.id,
          name: tankData.name,
          capacity: tankData.capacity || 0,
          current_level: typeof tankData.current_level === 'number' ? tankData.current_level : 0,
          fuel_type: tankData.fuel_type as FuelType,
          created_at: tankData.created_at
        } : undefined
      };
    });
  } catch (err: any) {
    console.error('Failed to fetch filling systems:', err);
    throw new Error(err.message || 'Failed to fetch filling systems data');
  }
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('filling_systems')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
