
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
    fuel_type: (item.filling_system?.tank?.fuel_type as FuelType) || 'Petrol',
    quantity: item.total_sold_liters || 0,
    price_per_unit: item.price_per_unit,
    total_sales: item.total_sales,
    payment_status: 'Pending',
    filling_system_name: item.filling_system?.name || 'Unknown',
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
    fuel_type: (data.filling_system?.tank?.fuel_type as FuelType) || 'Petrol',
    quantity: data.total_sold_liters || 0,
    price_per_unit: data.price_per_unit,
    total_sales: data.total_sales,
    payment_status: 'Pending',
    filling_system_name: data.filling_system?.name || 'Unknown',
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

  const { data: fillingSystemData, error: fillingSystemError } = await supabase
    .from('filling_systems')
    .select(`
      id,
      name,
      tank:fuel_tanks (
        id,
        fuel_type,
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
    fuel_type: (fillingSystemData.tank.fuel_type as FuelType) || 'Petrol',
    quantity: sale.total_sold_liters || 0,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: 'Pending',
    filling_system_name: fillingSystemData.name || 'Unknown',
    created_at: sale.created_at,
    meter_start: sale.meter_start || 0,
    meter_end: sale.meter_end || 0,
    filling_system_id: sale.filling_system_id || '',
    employee_id: sale.employee_id || ''
  };
};

export const updateSale = async (
  data: {
    id: string;
    unit_price: number;
    meter_start: number;
    meter_end: number;
    filling_system_id: string;
    employee_id: string;
  }
): Promise<Sale> => {
  const total_sold_liters = data.meter_end - data.meter_start;
  const total_sales = total_sold_liters * data.unit_price;

  const { data: existingSale, error: fetchError } = await supabase
    .from('sales')
    .select('*')
    .eq('id', data.id)
    .single();

  if (fetchError) throw fetchError;

  const previousSoldLiters = existingSale.total_sold_liters;
  const litersDifference = total_sold_liters - previousSoldLiters;

  const { data: fillingSystemData, error: fillingSystemError } = await supabase
    .from('filling_systems')
    .select(`
      id,
      name,
      tank:fuel_tanks (
        id,
        fuel_type,
        current_level
      )
    `)
    .eq('id', data.filling_system_id)
    .single();

  if (fillingSystemError) throw fillingSystemError;
  if (!fillingSystemData?.tank) throw new Error('No tank found for this filling system');

  const tankId = fillingSystemData.tank.id;
  const currentLevel = fillingSystemData.tank.current_level;
  const newLevel = currentLevel - litersDifference;

  if (newLevel < 0) {
    throw new Error('Insufficient fuel in tank');
  }

  const { data: updatedSale, error } = await supabase
    .from('sales')
    .update({
      price_per_unit: data.unit_price,
      total_sales: total_sales,
      total_sold_liters: total_sold_liters,
      meter_start: data.meter_start,
      meter_end: data.meter_end,
      filling_system_id: data.filling_system_id,
      employee_id: data.employee_id
    })
    .eq('id', data.id)
    .select()
    .single();

  if (error) throw error;

  if (litersDifference !== 0) {
    const { error: tankUpdateError } = await supabase
      .from('fuel_tanks')
      .update({
        current_level: newLevel
      })
      .eq('id', tankId);

    if (tankUpdateError) throw tankUpdateError;

    const { error: levelChangeError } = await supabase
      .from('tank_level_changes')
      .insert({
        tank_id: tankId,
        change_amount: Math.abs(litersDifference),
        previous_level: currentLevel,
        new_level: newLevel,
        change_type: litersDifference > 0 ? 'subtract' : 'add'
      });

    if (levelChangeError) throw levelChangeError;
  }
  
  return {
    id: updatedSale.id,
    date: updatedSale.date,
    fuel_type: (fillingSystemData.tank.fuel_type as FuelType) || 'Petrol',
    quantity: updatedSale.total_sold_liters || 0,
    price_per_unit: updatedSale.price_per_unit,
    total_sales: updatedSale.total_sales,
    payment_status: 'Pending',
    filling_system_name: fillingSystemData.name || 'Unknown',
    created_at: updatedSale.created_at,
    meter_start: updatedSale.meter_start || 0,
    meter_end: updatedSale.meter_end || 0,
    filling_system_id: updatedSale.filling_system_id || '',
    employee_id: updatedSale.employee_id || ''
  };
};

export const deleteSale = async (id: string): Promise<void> => {
  // First get the sale details to determine how much fuel was sold
  const { data: saleData, error: saleError } = await supabase
    .from('sales')
    .select(`
      id,
      total_sold_liters,
      filling_system_id,
      filling_system:filling_systems(
        tank_id
      )
    `)
    .eq('id', id)
    .single();
    
  if (saleError) throw saleError;
  
  if (!saleData || !saleData.filling_system || !saleData.filling_system.tank_id) {
    throw new Error('Sale data or related tank information not found');
  }
  
  const tankId = saleData.filling_system.tank_id;
  const soldLiters = saleData.total_sold_liters || 0;
  
  // Get current tank level
  const { data: tankData, error: tankError } = await supabase
    .from('fuel_tanks')
    .select('current_level')
    .eq('id', tankId)
    .single();
    
  if (tankError) throw tankError;
  
  const currentLevel = tankData.current_level;
  const newLevel = currentLevel + soldLiters;
  
  // Start a transaction to delete the sale and update the tank level
  const { error: deleteError } = await supabase.rpc('delete_sale_and_restore_tank', {
    p_sale_id: id,
    p_tank_id: tankId,
    p_previous_level: currentLevel,
    p_new_level: newLevel,
    p_change_amount: soldLiters
  });
  
  if (deleteError) {
    console.error("Error in delete transaction:", deleteError);
    
    // If the RPC fails, attempt to delete just the sale as a fallback
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
  }
};
