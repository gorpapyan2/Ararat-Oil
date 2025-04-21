import { supabase } from "@/integrations/supabase/client";
import { FuelSupply, FuelType, EmployeeStatus } from "@/types";
import { createTransaction } from "@/services/transactions";

/**
 * Fetch all fuel supply records with related provider, tank, and employee details.
 * @returns {Promise<FuelSupply[]>}
 * @throws {Error} If fetching data fails
 */
export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  const { data, error } = await supabase
    .from<FuelSupply>("fuel_supplies")
    .select(`
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `)
    .order("delivery_date", { ascending: false });

  if (error) {
    // TODO: Replace with production logger
    console.error("Error fetching fuel supplies:", error.message ?? error);
    throw new Error(`Failed to fetch fuel supplies: ${error.message ?? error}`);
  }

  return (data ?? []).map((record) => ({
    ...record,
    provider: record.provider ?? undefined,
    tank: record.tank
      ? { ...record.tank, fuel_type: record.tank.fuel_type as FuelType }
      : undefined,
    employee: record.employee
      ? { ...record.employee, status: record.employee.status as EmployeeStatus }
      : undefined,
  }));
}


export async function createFuelSupply(supply: Omit<FuelSupply, 'id' | 'created_at'>): Promise<FuelSupply> {
  // Get current tank level
  const { data: tankData, error: tankError } = await supabase
    .from('fuel_tanks')
    .select('current_level')
    .eq('id', supply.tank_id)
    .single();
  if (tankError) throw new Error(`Failed to fetch tank: ${tankError.message ?? tankError}`);
  const previousLevel = tankData.current_level;
  const newLevel = previousLevel + supply.quantity_liters;

  // Insert fuel supply
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
      total_cost: supply.total_cost,
      payment_status: supply.payment_status,
      payment_method: supply.payment_method
    })
    .select(`
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `)
    .single();
  if (error) throw new Error(`Failed to create fuel supply: ${error.message ?? error}`);

  // Update tank level
  const { error: updateTankError } = await supabase
    .from('fuel_tanks')
    .update({ current_level: newLevel })
    .eq('id', supply.tank_id);
  if (updateTankError) throw new Error(`Failed to update tank level: ${updateTankError.message ?? updateTankError}`);

  // Record tank level change
  const { error: updateError } = await supabase
    .rpc('record_tank_level_change', {
      p_tank_id: supply.tank_id,
      p_change_amount: supply.quantity_liters,
      p_previous_level: previousLevel,
      p_new_level: newLevel,
      p_change_type: 'add'
    });
    
  if (updateError) throw updateError;

  // Create a corresponding transaction for this fuel supply
  await createTransaction({
    amount: supply.total_cost,
    payment_method: supply.payment_method,
    payment_status: supply.payment_status,
    employee_id: supply.employee_id,
    description: supply.comments || '',
    entity_type: 'fuel_supply',
    entity_id: data.id
  });

  return {
    ...data,
    provider: data.provider ?? undefined,
    tank: data.tank
      ? { ...data.tank, fuel_type: data.tank.fuel_type as FuelType }
      : undefined,
    employee: data.employee
      ? { ...data.employee, status: data.employee.status as EmployeeStatus }
      : undefined,
  };
}


export async function updateFuelSupply(id: string, updates: Partial<Omit<FuelSupply, 'id' | 'created_at'>>): Promise<FuelSupply> {
  const { data, error } = await supabase
    .from('fuel_supplies')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `)
    .single();
  if (error) throw new Error(`Failed to update fuel supply: ${error.message ?? error}`);
  return {
    ...data,
    provider: data.provider ?? undefined,
    tank: data.tank
      ? { ...data.tank, fuel_type: data.tank.fuel_type as FuelType }
      : undefined,
    employee: data.employee
      ? { ...data.employee, status: data.employee.status as EmployeeStatus }
      : undefined,
  };
}

/**
 * Delete a fuel supply record.
 * @param id - ID of the fuel supply to delete
 * @returns {Promise<void>}
 * @throws {Error} If deleting fuel supply fails
 */
export async function deleteFuelSupply(id: string): Promise<void> {
  const { error } = await supabase
    .from('fuel_supplies')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete fuel supply: ${error.message ?? error}`);
  }
}
