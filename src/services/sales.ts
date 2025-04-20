
import { supabase } from "@/integrations/supabase/client";
import { Sale, PaymentStatus, FuelType } from "@/types";

export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    fuel_type: (item as any).fuel_type as FuelType || 'Petrol', // Cast to any to avoid TS errors
    quantity: item.meter_end - item.meter_start,
    price_per_unit: item.price_per_unit,
    total_sales: item.total_sales,
    payment_status: (item as any).payment_status as PaymentStatus || 'Pending', // Cast to any to avoid TS errors
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
    .select('*')
    .eq('filling_system_id', fillingSystemId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    id: data.id,
    date: data.date,
    fuel_type: (data as any).fuel_type as FuelType || 'Petrol', // Cast to any to avoid TS errors
    quantity: data.meter_end - data.meter_start,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: (data as any).payment_status as PaymentStatus || 'Pending', // Cast to any to avoid TS errors
    created_at: data.created_at,
    meter_start: data.meter_start,
    meter_end: data.meter_end,
    filling_system_id: data.filling_system_id,
    employee_id: data.employee_id
  };
};

export const createSale = async (
  data: {
    fuel_type: FuelType;
    quantity?: number;
    unit_price: number;
    meter_start: number;
    meter_end: number;
    filling_system_id: string;
    employee_id: string;
  }
): Promise<Sale> => {
  const quantity = data.quantity || (data.meter_end - data.meter_start);
  const total_sales = quantity * data.unit_price;

  const { data: sale, error } = await supabase
    .from('sales')
    .insert([{
      date: new Date().toISOString().split('T')[0],
      fuel_type: data.fuel_type,
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
    fuel_type: (sale as any).fuel_type as FuelType || data.fuel_type, // Cast to any to avoid TS errors
    quantity: sale.meter_end - sale.meter_start,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: (sale as any).payment_status as PaymentStatus || 'Pending', // Cast to any to avoid TS errors
    created_at: sale.created_at,
    meter_start: sale.meter_start,
    meter_end: sale.meter_end,
    filling_system_id: sale.filling_system_id,
    employee_id: sale.employee_id
  };
};
