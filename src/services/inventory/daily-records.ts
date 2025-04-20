
import { supabase } from "@/integrations/supabase/client";
import { DailyInventoryRecord, FuelType, EmployeeStatus } from "@/types";

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
  
  // Fetch last refill dates for each tank
  const { data: lastRefillDates, error: refillError } = await supabase
    .from('last_refill_dates')
    .select('*');
  
  if (refillError) {
    console.error("Error fetching last refill dates:", refillError);
  }
  
  const refillDatesMap = (lastRefillDates || []).reduce((acc, item) => {
    if (item.tank_id) {
      acc[item.tank_id] = item.last_refill_date;
    }
    return acc;
  }, {} as Record<string, string | null>);
  
  return (data || []).map(record => {
    // Add opening_stock with default value if it doesn't exist in the record
    const opening_stock = (record as any).opening_stock || 0;
    
    return {
      id: record.id,
      date: record.date,
      opening_stock: opening_stock,
      received: record.received || 0,
      sold: 0,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      total_price: record.total_price || 0,
      provider_id: record.provider_id,
      tank_id: record.tank_id,
      filling_system_id: record.filling_system_id || '',
      employee_id: record.employee_id || '',
      created_at: record.created_at,
      last_refill_date: record.tank_id ? refillDatesMap[record.tank_id] || null : null,
      filling_system: record.filling_system ? {
        ...record.filling_system,
        tank: record.filling_system.tank ? {
          ...record.filling_system.tank,
          // Ensure fuel_type is cast to the FuelType type
          fuel_type: record.filling_system.tank.fuel_type as FuelType
        } : undefined
      } : undefined,
      provider: record.provider,
      employee: record.employee ? {
        ...record.employee,
        // Ensure employee status is cast to EmployeeStatus enum
        status: record.employee.status as EmployeeStatus
      } : undefined
    };
  });
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
      // Add opening_stock as part of the insert
      opening_stock: record.opening_stock || 0,
      received: record.received,
      closing_stock: record.closing_stock,
      unit_price: record.unit_price,
      total_price: record.total_price
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
    // Add opening_stock with default value
    opening_stock: (data as any).opening_stock || 0,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || '',
    sold: 0, // Provide default sold value
    filling_system: data.filling_system ? {
      ...data.filling_system,
      tank: data.filling_system.tank ? {
        ...data.filling_system.tank,
        fuel_type: data.filling_system.tank.fuel_type as FuelType
      } : undefined
    } : undefined,
    employee: data.employee ? {
      ...data.employee,
      status: data.employee.status as EmployeeStatus
    } : undefined
  } as DailyInventoryRecord;
};
