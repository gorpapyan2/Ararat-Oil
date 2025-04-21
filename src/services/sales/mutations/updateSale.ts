
import { supabase } from "@/integrations/supabase/client";
import { Sale, FuelType } from "@/types";

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
