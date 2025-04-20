
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
    `);
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  
  // Transform the data to ensure proper typing
  return (data || []).map(record => ({
    id: record.id,
    filling_system_id: record.filling_system_id || '',
    date: record.date,
    opening_stock: record.opening_stock,
    received: record.received,
    sold: record.sold || 0, // Default value if not present
    closing_stock: record.closing_stock,
    unit_price: record.unit_price,
    employee_id: record.employee_id || '',
    created_at: record.created_at,
    filling_system: record.filling_system ? {
      id: record.filling_system.id,
      name: record.filling_system.name,
      tank_id: record.filling_system.tank?.id,
      tank: record.filling_system.tank ? {
        ...record.filling_system.tank,
        fuel_type: (record.filling_system.tank.fuel_type as FuelType) || 'Petrol'
      } : undefined,
      created_at: record.filling_system.created_at
    } : undefined,
    employee: record.employee ? {
      ...record.employee,
      status: (record.employee.status as EmployeeStatus) || 'active'
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
  
  return {
    ...data,
    filling_system_id: data.filling_system_id || '',
    sold: data.sold || 0,
    employee_id: data.employee_id || ''
  } as DailyInventoryRecord;
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
  
  return {
    ...data,
    filling_system_id: data.filling_system_id || '',
    sold: data.sold || 0,
    employee_id: data.employee_id || ''
  } as DailyInventoryRecord;
};
