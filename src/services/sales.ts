
import { supabase } from "@/integrations/supabase/client";
import { Sale, PaymentStatus, FuelType } from "@/types";

export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      filling_systems(
        name,
        fuel_tanks(
          fuel_type
        )
      )
    `)
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    fuel_type: item.filling_systems?.fuel_tanks?.fuel_type as FuelType || 'Petrol',
    quantity: item.total_sold_liters || 0,
    price_per_unit: item.price_per_unit,
    total_sales: item.total_sales,
    payment_status: 'Pending', // Hardcoded since it's not in the database
    filling_system_name: item.filling_systems?.name || 'Unknown',
    created_at: item.created_at,
    meter_start: item.meter_start || 0,
    meter_end: item.meter_end || 0,
    filling_system_id: item.filling_system_id || '',
    employee_id: item.employee_id || ''
  }));
};

export const fetchLatestSale = async (fillingSystemId: string): Promise<Sale | null> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      filling_systems(
        name,
        fuel_tanks(
          fuel_type
        )
      )
    `)
    .eq('filling_system_id', fillingSystemId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    id: data.id,
    date: data.date,
    fuel_type: data.filling_systems?.fuel_tanks?.fuel_type as FuelType || 'Petrol',
    quantity: data.total_sold_liters || 0,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: 'Pending',
    filling_system_name: data.filling_systems?.name || 'Unknown',
    created_at: data.created_at,
    meter_start: data.meter_start || 0,
    meter_end: data.meter_end || 0,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || ''
  };
};

export const createSale = async (
  data: {
    quantity?: number;
    unit_price: number;
    meter_start: number;
    meter_end: number;
    filling_system_id: string;
    employee_id: string;
  }
): Promise<Sale> => {
  const total_sold_liters = data.meter_end - data.meter_start;
  const total_sales = total_sold_liters * data.unit_price;

  // First, get the filling system's tank information
  const { data: fillingSystemData, error: fillingSystemError } = await supabase
    .from('filling_systems')
    .select(`
      id,
      tank:fuel_tanks (
        id,
        current_level
      )
    `)
    .eq('id', data.filling_system_id)
    .single();

  if (fillingSystemError) throw fillingSystemError;
  if (!fillingSystemData?.tank) throw new Error('No tank found for this filling system');

  const tankId = fillingSystemData.tank.id;
  const currentLevel = fillingSystemData.tank.current_level;
  const newLevel = currentLevel - total_sold_liters;

  if (newLevel < 0) {
    throw new Error('Insufficient fuel in tank');
  }

  // Start a transaction to update both sales and tank level
  const { data: sale, error } = await supabase.rpc('create_sale_and_update_tank', {
    p_date: new Date().toISOString().split('T')[0],
    p_price_per_unit: data.unit_price,
    p_total_sales: total_sales,
    p_total_sold_liters: total_sold_liters,
    p_meter_start: data.meter_start,
    p_meter_end: data.meter_end,
    p_filling_system_id: data.filling_system_id,
    p_employee_id: data.employee_id,
    p_tank_id: tankId,
    p_previous_level: currentLevel,
    p_new_level: newLevel,
    p_change_amount: total_sold_liters
  });

  if (error) throw error;
  
  return {
    id: sale.id,
    date: sale.date,
    fuel_type: 'Petrol', // Default since we don't have it in the response
    quantity: sale.total_sold_liters || 0,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: 'Pending',
    created_at: sale.created_at,
    meter_start: sale.meter_start || 0,
    meter_end: sale.meter_end || 0,
    filling_system_id: sale.filling_system_id || '',
    employee_id: sale.employee_id || ''
  };
};
