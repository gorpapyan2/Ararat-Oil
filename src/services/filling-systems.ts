
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

export const fetchFillingSystems = async (): Promise<FillingSystem[]> => {
  const { data, error } = await supabase
    .from('filling_systems')
    .select(`
      *,
      tank:fuel_tanks(*)
    `)
    .order('name');
    
  if (error) throw error;
  
  // Transform the data to ensure proper typing of nested tank objects
  return (data || []).map(item => ({
    ...item,
    tank: item.tank ? {
      ...item.tank,
      fuel_type: item.tank.fuel_type as FuelType // Cast string to FuelType
    } : undefined
  }));
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('filling_systems')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
