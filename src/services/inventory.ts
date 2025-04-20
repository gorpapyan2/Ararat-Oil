
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
      filling_systems!daily_inventory_records_filling_system_id_fkey (
        id,
        name,
        fuel_tanks!filling_systems_tank_id_fkey(*)
      ),
      employees!daily_inventory_records_employee_id_fkey(*)
    `);
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  
  // Transform the data to ensure proper typing
  return (data || []).map(record => {
    // Handle the case where the record might not have all fields
    const result: DailyInventoryRecord = {
      id: record.id,
      filling_system_id: record.filling_system_id || '',
      date: record.date,
      opening_stock: record.opening_stock,
      received: record.received,
      sold: record.sold || 0,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      employee_id: record.employee_id || '',
      created_at: record.created_at
    };

    // Add filling system data if available
    if (record.filling_systems) {
      result.filling_system = {
        id: record.filling_systems.id,
        name: record.filling_systems.name,
        tank_id: record.filling_systems.tank_id,
        created_at: record.filling_systems.created_at
      };
      
      // Add tank data if available
      if (record.filling_systems.fuel_tanks) {
        result.filling_system.tank = {
          ...record.filling_systems.fuel_tanks,
          fuel_type: (record.filling_systems.fuel_tanks.fuel_type as FuelType) || 'Petrol'
        };
      }
    }

    // Add employee data if available
    if (record.employees) {
      result.employee = {
        ...record.employees,
        status: (record.employees.status as EmployeeStatus) || 'active'
      };
    }

    return result;
  });
};

export const createDailyInventoryRecord = async (record: Omit<DailyInventoryRecord, 'id' | 'created_at'>): Promise<DailyInventoryRecord> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .insert([{
      date: record.date,
      filling_system_id: record.filling_system_id,
      employee_id: record.employee_id,
      opening_stock: record.opening_stock,
      received: record.received,
      sold: record.sold || 0,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price
    }])
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    date: data.date,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || '',
    opening_stock: data.opening_stock,
    received: data.received,
    sold: data.sold || 0,
    closing_stock: data.closing_stock,
    unit_price: data.unit_price,
    created_at: data.created_at
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
    id: data.id,
    date: data.date,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || '',
    opening_stock: data.opening_stock,
    received: data.received,
    sold: data.sold || 0,
    closing_stock: data.closing_stock,
    unit_price: data.unit_price,
    created_at: data.created_at
  } as DailyInventoryRecord;
};
