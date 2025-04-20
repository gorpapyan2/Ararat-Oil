
import { supabase } from "@/integrations/supabase/client";
import { Sale, PaymentStatus, FuelType } from "@/types";

export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      filling_system:filling_systems(
        name,
        tank:fuel_tanks(
          fuel_type
        )
      )
    `)
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    fuel_type: item.filling_system?.tank?.fuel_type as FuelType || 'Petrol',
    quantity: item.total_sold_liters || 0,
    price_per_unit: item.price_per_unit,
    total_sales: item.total_sales,
    filling_system_name: item.filling_system?.name || 'Unknown',
    created_at: item.created_at,
    meter_start: item.meter_start,
    meter_end: item.meter_end,
    filling_system_id: item.filling_system_id,
    employee_id: item.employee_id
  }));
};

export const fetchLatestSale = async (fillingSystemId: string): Promise<Sale | null> => {
  const { data, error } = await supabase
    .from('sales')
    .select(`
      *,
      filling_system:filling_systems(
        name,
        tank:fuel_tanks(
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
    fuel_type: data.filling_system?.tank?.fuel_type as FuelType || 'Petrol',
    quantity: data.total_sold_liters || 0,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: 'Pending',
    created_at: data.created_at,
    meter_start: data.meter_start,
    meter_end: data.meter_end,
    filling_system_id: data.filling_system_id,
    employee_id: data.employee_id
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

  const { data: sale, error } = await supabase
    .from('sales')
    .insert([{
      date: new Date().toISOString().split('T')[0],
      price_per_unit: data.unit_price,
      total_sales,
      total_sold_liters,
      meter_start: data.meter_start,
      meter_end: data.meter_end,
      filling_system_id: data.filling_system_id,
      employee_id: data.employee_id
    }])
    .select(`
      *,
      filling_system:filling_systems(
        name,
        tank:fuel_tanks(
          fuel_type
        )
      )
    `)
    .single();

  if (error) throw error;
  
  return {
    id: sale.id,
    date: sale.date,
    fuel_type: sale.filling_system?.tank?.fuel_type as FuelType || 'Petrol',
    quantity: sale.total_sold_liters || 0,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: 'Pending',
    created_at: sale.created_at,
    meter_start: sale.meter_start,
    meter_end: sale.meter_end,
    filling_system_id: sale.filling_system_id,
    employee_id: sale.employee_id
  };
};
