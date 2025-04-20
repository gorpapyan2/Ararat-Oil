
import { supabase } from "@/integrations/supabase/client";
import { DailyInventoryRecord } from "@/types";

export const fetchLatestInventoryRecordByFillingSystemId = async (fillingSystemId: string): Promise<DailyInventoryRecord | null> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .select(`
      *,
      filling_system:filling_systems(
        id,
        name,
        tank:fuel_tanks(*)
      ),
      provider:petrol_providers(*),
      employee:employees(*)
    `)
    .eq('filling_system_id', fillingSystemId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || '',
  } as DailyInventoryRecord;
};
