
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
  // Define the join query
  let query = supabase
    .from('daily_inventory_records')
    .select(`
      id, 
      date, 
      opening_stock, 
      received, 
      closing_stock, 
      unit_price, 
      created_at,
      filling_system:filling_systems!daily_inventory_records_filling_system_id_fkey (
        id,
        name,
        tank_id,
        created_at,
        tank:fuel_tanks!filling_systems_tank_id_fkey (
          id,
          name,
          fuel_type,
          capacity,
          current_level,
          created_at
        )
      ),
      employee:employees!daily_inventory_records_employee_id_fkey (
        id,
        name,
        position,
        contact,
        hire_date,
        salary,
        status,
        created_at
      )
    `);
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  
  // Transform the data to ensure proper typing
  return (data || []).map(record => {
    // Create a base record with the fields that exist in the database
    const result: DailyInventoryRecord = {
      id: record.id,
      date: record.date,
      opening_stock: record.opening_stock,
      received: record.received,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      sold: 0, // Default value since it's not in the database
      created_at: record.created_at,
      filling_system_id: '', // We'll set this from the relationship
      employee_id: '' // We'll set this from the relationship
    };

    // Add filling system data if available
    if (record.filling_system) {
      result.filling_system_id = record.filling_system.id;
      result.filling_system = {
        id: record.filling_system.id,
        name: record.filling_system.name,
        tank_id: record.filling_system.tank_id,
        created_at: record.filling_system.created_at
      };
      
      // Add tank data if available
      if (record.filling_system.tank) {
        result.filling_system.tank = {
          id: record.filling_system.tank.id,
          name: record.filling_system.tank.name,
          fuel_type: record.filling_system.tank.fuel_type as FuelType,
          capacity: record.filling_system.tank.capacity,
          current_level: record.filling_system.tank.current_level,
          created_at: record.filling_system.tank.created_at
        };
      }
    }

    // Add employee data if available
    if (record.employee) {
      result.employee_id = record.employee.id;
      result.employee = {
        id: record.employee.id,
        name: record.employee.name,
        position: record.employee.position,
        contact: record.employee.contact,
        hire_date: record.employee.hire_date,
        salary: record.employee.salary,
        status: (record.employee.status as EmployeeStatus) || 'active',
        created_at: record.employee.created_at
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
      closing_stock: record.closing_stock,
      unit_price: record.unit_price
    }])
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    id: data.id,
    date: data.date,
    filling_system_id: record.filling_system_id, // Use from input since it may not be in response
    employee_id: record.employee_id, // Use from input since it may not be in response
    opening_stock: data.opening_stock,
    received: data.received,
    sold: record.sold || 0, // Use from input, provide default
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
    filling_system_id: fillingSystemId, // Use the parameter since it may not be in response
    employee_id: '', // Default empty string since it might not be in response
    opening_stock: data.opening_stock,
    received: data.received,
    sold: 0, // Default value since it's not in the database
    closing_stock: data.closing_stock,
    unit_price: data.unit_price,
    created_at: data.created_at
  } as DailyInventoryRecord;
};
