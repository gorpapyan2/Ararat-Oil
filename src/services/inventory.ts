
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
  
  return (data || []).map(record => {
    // Create a properly typed record with all required fields
    const typedRecord: DailyInventoryRecord = {
      ...record,
      received: record.received || 0,
      filling_system: record.filling_system ? {
        ...record.filling_system,
        tank: record.filling_system.tank ? {
          ...record.filling_system.tank,
          fuel_type: record.filling_system.tank.fuel_type as FuelType,
          current_level: typeof record.filling_system.tank.current_level === 'number' ? record.filling_system.tank.current_level : 0
        } : undefined
      } : undefined,
      employee: record.employee ? {
        ...record.employee,
        status: record.employee.status as EmployeeStatus
      } : undefined
    };
    return typedRecord;
  });
};

export const createDailyInventoryRecord = async (record: Omit<DailyInventoryRecord, 'id' | 'created_at'>): Promise<DailyInventoryRecord> => {
  // Make sure record has a received field
  const recordWithReceived = {
    ...record,
    received: record.received || 0
  };
  
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .insert([recordWithReceived])
    .select()
    .single();
    
  if (error) throw error;
  
  // Since 'received' might not be in the database schema and not returned by the query,
  // we need to explicitly add it back to our returned object
  return {
    ...data,
    received: recordWithReceived.received || 0
  };
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
  
  if (!data) return null;
  
  // Ensure the record has the received field
  return {
    ...data,
    received: data.received || 0
  };
};
