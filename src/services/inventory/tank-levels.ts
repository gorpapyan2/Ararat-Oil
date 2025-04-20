
import { supabase } from "@/integrations/supabase/client";
import { FuelTank, FillingSystem } from "@/types";

// Replaces the previous function to get inventory data by filling system ID
// Now returns the associated tank data directly since daily_inventory_records no longer exists
export const fetchTankByFillingSystemId = async (fillingSystemId: string): Promise<FuelTank | null> => {
  const { data, error } = await supabase
    .from('filling_systems')
    .select(`
      id,
      name,
      tank:fuel_tanks(*)
    `)
    .eq('id', fillingSystemId)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching tank by filling system ID:", error);
    throw error;
  }
  
  if (!data || !data.tank || !data.tank[0]) {
    console.log("No tank found for filling system ID:", fillingSystemId);
    return null;
  }
  
  return data.tank[0] as FuelTank;
};
