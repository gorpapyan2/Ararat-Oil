import { supabase } from "@/integrations/supabase/client";
import { FuelTank, FuelType, TankLevelChange } from "@/types";

export const fetchFuelTanks = async (): Promise<FuelTank[]> => {
  console.log('Fetching all fuel tanks...');
  
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) {
    console.error('Error fetching fuel tanks:', error);
    throw error;
  }
  
  console.log(`Successfully fetched ${data?.length || 0} fuel tanks`);
  if (data && data.length > 0) {
    console.log('First tank sample:', JSON.stringify(data[0], null, 2));
  } else {
    console.warn('No fuel tanks found in the database!');
  }
  
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType,
    current_level: typeof item.current_level === 'number' ? item.current_level : 0
  }));
};

export const createFuelTank = async (tank: Omit<FuelTank, 'id' | 'created_at'>): Promise<FuelTank> => {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .insert([tank])
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    fuel_type: data.fuel_type as FuelType,
    current_level: typeof data.current_level === 'number' ? data.current_level : 0
  };
};

export interface TankLevelUpdateParams {
  tankId: string;
  changeAmount: number;
  previousLevel: number;
  newLevel: number;
  changeType: 'add' | 'subtract';
}

export const updateTankLevel = async (params: TankLevelUpdateParams): Promise<FuelTank> => {
  const { tankId, changeAmount, previousLevel, newLevel, changeType } = params;
  
  const { data: tankData, error: tankError } = await supabase
    .from('fuel_tanks')
    .update({ current_level: newLevel })
    .eq('id', tankId)
    .select()
    .single();
    
  if (tankError) throw tankError;
  
  const { error: changeError } = await supabase
    .rpc('record_tank_level_change', {
      p_tank_id: tankId,
      p_change_amount: Math.abs(changeAmount),
      p_previous_level: previousLevel,
      p_new_level: newLevel,
      p_change_type: changeType
    });
    
  if (changeError) {
    console.error("Error recording tank level change:", changeError);
  }
  
  return {
    ...tankData,
    fuel_type: tankData.fuel_type as FuelType,
    current_level: typeof tankData.current_level === 'number' ? tankData.current_level : 0
  };
};

export const fetchTankLevelChanges = async (tankId: string): Promise<TankLevelChange[]> => {
  const { data, error } = await supabase
    .from('tank_level_changes')
    .select('*')
    .eq('tank_id', tankId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    tank_id: item.tank_id,
    change_amount: item.change_amount,
    previous_level: item.previous_level,
    new_level: item.new_level,
    change_type: item.change_type as 'add' | 'subtract',
    created_at: item.created_at
  }));
};
