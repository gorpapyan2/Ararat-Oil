
import { supabase } from "@/integrations/supabase/client";
import { DailyInventoryRecord, FuelType } from "@/types";

export const fetchDailyInventoryRecords = async (date?: string): Promise<DailyInventoryRecord[]> => {
  let query = supabase
    .from('daily_inventory_records')
    .select(`
      *,
      filling_system:filling_systems(
        id,
        name,
        tank:fuel_tanks(
          id,
          name,
          fuel_type,
          capacity,
          current_level,
          created_at
        )
      ),
      provider:petrol_providers(
        id,
        name,
        contact
      ),
      employee:employees(*)
    `);
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  
  return (data || []).map(record => ({
    id: record.id,
    date: record.date,
    opening_stock: record.opening_stock,
    received: record.received || 0,
    closing_stock: record.closing_stock,
    unit_price: record.unit_price,
    total_price: record.total_price,
    provider_id: record.provider_id,
    tank_id: record.tank_id,
    filling_system_id: record.filling_system_id || '',
    employee_id: record.employee_id || '',
    created_at: record.created_at,
    filling_system: record.filling_system,
    provider: record.provider,
    employee: record.employee
  }));
};

export const createDailyInventoryRecord = async (record: Omit<DailyInventoryRecord, 'id' | 'created_at'>): Promise<DailyInventoryRecord> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .insert([{
      date: record.date,
      filling_system_id: record.filling_system_id,
      provider_id: record.provider_id,
      tank_id: record.tank_id,
      employee_id: record.employee_id,
      opening_stock: record.opening_stock,
      received: record.received,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      total_price: record.unit_price * record.received
    }])
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
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || '',
  } as DailyInventoryRecord;
};
