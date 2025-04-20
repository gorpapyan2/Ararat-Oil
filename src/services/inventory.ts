
import { supabase } from "@/integrations/supabase/client";
import { InventoryItem, FuelType, DailyInventoryRecord, EmployeeStatus } from "@/types";

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType
  }));
};

export const fetchDailyInventoryRecords = async (date?: string): Promise<DailyInventoryRecord[]> => {
  let query = supabase
    .from('daily_inventory_records')
    .select(`
      *,
      filling_system:filling_systems(
        id,
        name,
        tank:fuel_tanks(*)
      ),
      employee:employees(*)
    `)
    .order('date', { ascending: false });
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  // Transform the data to ensure proper typing
  return (data || []).map(record => ({
    ...record,
    filling_system: record.filling_system ? {
      ...record.filling_system,
      tank: record.filling_system.tank ? {
        ...record.filling_system.tank,
        fuel_type: record.filling_system.tank.fuel_type as FuelType
      } : undefined
    } : undefined,
    employee: record.employee ? {
      ...record.employee,
      status: record.employee.status as EmployeeStatus
    } : undefined
  }));
};

export const createDailyInventoryRecord = async (record: Omit<DailyInventoryRecord, 'id' | 'created_at'>): Promise<DailyInventoryRecord> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .insert([record])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const fetchLatestInventoryRecordByFillingSystemId = async (fillingSystemId: string): Promise<DailyInventoryRecord | null> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .select('*')
    .eq('filling_system_id', fillingSystemId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return data;
};
