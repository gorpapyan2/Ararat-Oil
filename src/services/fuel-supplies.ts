
import { supabase } from "@/integrations/supabase/client";
import { FuelSupply, FuelType } from "@/types";

export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  const { data, error } = await supabase
    .from('fuel_supplies')
    .select(`
      *,
      provider:petrol_providers(id, name),
      tank:fuel_tanks(id, name, fuel_type),
      employee:employees(id, name)
    `)
    .order('delivery_date', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(record => ({
    ...record,
    provider: record.provider,
    tank: {
      ...record.tank,
      fuel_type: record.tank.fuel_type as FuelType // Cast to FuelType enum
    },
    employee: record.employee
  }));
}

export async function createFuelSupply(supply: Omit<FuelSupply, 'id' | 'created_at'>): Promise<FuelSupply> {
  const { data, error } = await supabase
    .from('fuel_supplies')
    .insert({
      delivery_date: supply.delivery_date,
      provider_id: supply.provider_id,
      tank_id: supply.tank_id,
      quantity_liters: supply.quantity_liters,
      price_per_liter: supply.price_per_liter,
      employee_id: supply.employee_id,
      comments: supply.comments,
      total_cost: supply.total_cost
    })
    .select(`
      *,
      provider:petrol_providers(id, name),
      tank:fuel_tanks(id, name, fuel_type),
      employee:employees(id, name)
    `)
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    provider: data.provider,
    tank: {
      ...data.tank,
      fuel_type: data.tank.fuel_type as FuelType // Cast to FuelType enum
    },
    employee: data.employee
  };
}
