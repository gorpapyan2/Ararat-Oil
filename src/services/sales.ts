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
    payment_status: item.payment_status as PaymentStatus
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
      payment_status: 'Pending'
    }])
    .select()
    .single();

  if (error) throw error;
  
  return {
    ...sale,
    fuel_type: sale.fuel_type as FuelType,
    payment_status: sale.payment_status as PaymentStatus
  };
};
