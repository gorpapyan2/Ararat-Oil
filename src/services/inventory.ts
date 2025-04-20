
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
      tank:fuel_tanks(*),
      employee:employees(*)
    `)
    .order('date', { ascending: false });
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return (data || []).map(record => ({
    ...record,
    tank: record.tank ? {
      ...record.tank,
      fuel_type: record.tank.fuel_type as FuelType,
      current_level: typeof record.tank.current_level === 'number' ? record.tank.current_level : 0
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

export const fetchLatestInventoryRecord = async (tankId: string): Promise<DailyInventoryRecord | null> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .select('*')
    .eq('tank_id', tankId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return data;
};

export const fetchLatestInventoryRecordByTankId = async (tankId: string): Promise<DailyInventoryRecord | null> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .select('*')
    .eq('tank_id', tankId)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return data;
};

export const fetchLatestInventoryRecordByFillingSystemId = async (fillingSystemId: string): Promise<DailyInventoryRecord | null> => {
  // First get the tank ID associated with this filling system
  const { data: fillingSystem, error: fillingSystemError } = await supabase
    .from('filling_systems')
    .select('tank_id')
    .eq('id', fillingSystemId)
    .single();
    
  if (fillingSystemError) throw fillingSystemError;
  
  if (!fillingSystem?.tank_id) return null;
  
  // Then fetch the latest inventory record for this tank
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .select('*')
    .eq('tank_id', fillingSystem.tank_id)
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  return data;
};
