
import { supabase } from "@/integrations/supabase/client";

export interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
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
  return data || [];
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('filling_systems')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
