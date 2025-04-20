
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
  }));
};

export const createSale = async (
  data: {
    fuel_type: FuelType;
    quantity: number;
    unit_price: number;
  }
): Promise<Sale> => {
  const total_sales = data.quantity * data.unit_price;

  const { data: sale, error } = await supabase
    .from('sales')
    .insert([{
      date: new Date().toISOString().split('T')[0],
      fuel_type: data.fuel_type,
      quantity: data.quantity,
      price_per_unit: data.unit_price,
      total_sales,
      payment_status: 'Pending'
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
    created_at: sale.created_at
  };
};
