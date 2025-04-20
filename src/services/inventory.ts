
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
  // Define the base query
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
      filling_system_id,
      employee_id
    `);
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  
  // Fetch filling systems and employees in separate queries to avoid join errors
  const recordIds = (data || []).map(r => r.id);
  
  if (recordIds.length === 0) {
    return [];
  }
  
  // Get all filling system data
  const { data: fillingSystems } = await supabase
    .from('filling_systems')
    .select(`
      id,
      name,
      tank_id,
      created_at,
      tank:fuel_tanks(
        id,
        name,
        fuel_type,
        capacity,
        current_level,
        created_at
      )
    `);
  
  const fillingSystemsMap = (fillingSystems || []).reduce((acc, fs) => {
    acc[fs.id] = fs;
    return acc;
  }, {} as Record<string, any>);
  
  // Get all employee data
  const { data: employees } = await supabase
    .from('employees')
    .select('*');
  
  const employeesMap = (employees || []).reduce((acc, emp) => {
    acc[emp.id] = emp;
    return acc;
  }, {} as Record<string, any>);
  
  // Transform the data to ensure proper typing
  return (data || []).map(record => {
    // Create a base record with the fields that exist in the database
    const result: DailyInventoryRecord = {
      id: record.id,
      date: record.date,
      opening_stock: record.opening_stock,
      received: record.received || 0,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      sold: 0, // Default value since it's not in the database
      created_at: record.created_at,
      filling_system_id: record.filling_system_id || '',
      employee_id: record.employee_id || ''
    };

    // Add filling system data if available
    const fillingSystem = record.filling_system_id ? fillingSystemsMap[record.filling_system_id] : null;
    if (fillingSystem) {
      result.filling_system = {
        id: fillingSystem.id,
        name: fillingSystem.name,
        tank_id: fillingSystem.tank_id,
        created_at: fillingSystem.created_at
      };
      
      // Add tank data if available
      if (fillingSystem.tank) {
        result.filling_system.tank = {
          id: fillingSystem.tank.id,
          name: fillingSystem.tank.name,
          fuel_type: fillingSystem.tank.fuel_type as FuelType,
          capacity: fillingSystem.tank.capacity,
          current_level: fillingSystem.tank.current_level,
          created_at: fillingSystem.tank.created_at
        };
      }
    }

    // Add employee data if available
    const employee = record.employee_id ? employeesMap[record.employee_id] : null;
    if (employee) {
      result.employee = {
        id: employee.id,
        name: employee.name,
        position: employee.position,
        contact: employee.contact,
        hire_date: employee.hire_date,
        salary: employee.salary,
        status: (employee.status as EmployeeStatus) || 'active',
        created_at: employee.created_at
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
    filling_system_id: record.filling_system_id, 
    employee_id: record.employee_id,
    opening_stock: data.opening_stock,
    received: data.received,
    sold: record.sold || 0,
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
    filling_system_id: fillingSystemId,
    employee_id: data.employee_id || '',
    opening_stock: data.opening_stock,
    received: data.received || 0,
    sold: 0, // Default value since it's not in the database
    closing_stock: data.closing_stock,
    unit_price: data.unit_price,
    created_at: data.created_at
  } as DailyInventoryRecord;
};
