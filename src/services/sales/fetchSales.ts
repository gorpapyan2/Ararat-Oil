import { supabase } from "@/integrations/supabase/client";
import { Sale, FuelType, PaymentStatus } from "@/types";

export const fetchSales = async (): Promise<Sale[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required');
    }

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

    if (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }

    return (data || []).map(item => ({
      id: item.id,
      date: item.date,
      fuel_type: (item.filling_system?.tank?.fuel_type as FuelType) || 'petrol',
      quantity: item.total_sold_liters || 0,
      price_per_unit: item.price_per_unit,
      total_sales: item.total_sales,
      payment_status: 'pending' as PaymentStatus,
      filling_system_name: item.filling_system?.name || 'Unknown',
      created_at: item.created_at,
      meter_start: item.meter_start || 0,
      meter_end: item.meter_end || 0,
      filling_system_id: item.filling_system_id || '',
      employee_id: item.employee_id || ''
    }));
  } catch (err: any) {
    console.error('Failed to fetch sales:', err);
    throw new Error(err.message || 'Failed to fetch sales data');
  }
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
    fuel_type: (data.filling_system?.tank?.fuel_type as FuelType) || 'petrol',
    quantity: data.total_sold_liters || 0,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: 'pending' as PaymentStatus,
    filling_system_name: data.filling_system?.name || 'Unknown',
    created_at: data.created_at,
    meter_start: data.meter_start || 0,
    meter_end: data.meter_end || 0,
    filling_system_id: data.filling_system_id || '',
    employee_id: data.employee_id || ''
  };
};
