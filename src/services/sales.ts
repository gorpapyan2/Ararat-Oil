
import { supabase } from "@/integrations/supabase/client";
import { Sale, PaymentStatus, FuelType } from "@/types";

export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType,
    payment_status: item.payment_status as PaymentStatus,
    // Ensure all required properties are present
    meter_start: item.meter_start ?? 0,
    meter_end: item.meter_end ?? 0,
    filling_system_id: item.filling_system_id ?? '',
    employee_id: item.employee_id ?? ''
  }));
};

export const createSale = async (
  data: {
    filling_system_id: string;
    meter_start: number;
    meter_end: number;
    unit_price: number;
    employee_id: string;
  }
): Promise<Sale> => {
  // Calculate quantity from meter readings
  const quantity = data.meter_end - data.meter_start;
  const total_sales = quantity * data.unit_price;

  const { data: sale, error } = await supabase
    .from('sales')
    .insert([{
      date: new Date().toISOString().split('T')[0],
      fuel_type: 'Petrol', // TODO: Get from filling system
      quantity,
      price_per_unit: data.unit_price,
      total_sales,
      payment_status: 'Pending',
      meter_start: data.meter_start,
      meter_end: data.meter_end,
      filling_system_id: data.filling_system_id,
      employee_id: data.employee_id
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: sale.id,
    date: sale.date,
    fuel_type: sale.fuel_type as FuelType,
    quantity: sale.quantity,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: sale.payment_status as PaymentStatus,
    meter_start: sale.meter_start,
    meter_end: sale.meter_end,
    filling_system_id: sale.filling_system_id,
    employee_id: sale.employee_id,
    created_at: sale.created_at
  };
};

export const fetchLatestSale = async (filling_system_id: string): Promise<Sale | null> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('filling_system_id', filling_system_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!data) return null;

  return {
    id: data.id,
    date: data.date,
    fuel_type: data.fuel_type as FuelType,
    quantity: data.quantity,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: data.payment_status as PaymentStatus,
    meter_start: data.meter_start ?? 0,
    meter_end: data.meter_end ?? 0,
    filling_system_id: data.filling_system_id ?? filling_system_id,
    employee_id: data.employee_id ?? '',
    created_at: data.created_at
  };
};
