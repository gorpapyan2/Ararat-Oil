
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
