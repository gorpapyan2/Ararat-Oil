import { supabase } from "@/integrations/supabase/client";
import {
  FuelSupply,
  FuelType,
  EmployeeStatus,
  PaymentStatus,
  PaymentMethod,
} from "@/types";
import { createTransaction } from "@/services/transactions";

/**
 * Fetch all fuel supply records with related provider, tank, and employee details.
 * @returns {Promise<FuelSupply[]>}
 * @throws {Error} If fetching data fails
 */
export async function fetchFuelSupplies(): Promise<FuelSupply[]> {
  const { data, error } = await supabase
    .from("fuel_supplies")
    .select(
      `
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `,
    )
    .order("delivery_date", { ascending: false });

  if (error) {
    // TODO: Replace with production logger
    console.error("Error fetching fuel supplies:", error.message ?? error);
    throw new Error(`Failed to fetch fuel supplies: ${error.message ?? error}`);
  }

  return (data ?? []).map((record) => {
    // Safely access nested properties with null checks
    const provider = record.provider ?? undefined;
    const tank = record.tank
      ? {
          ...record.tank,
          fuel_type: record.tank.fuel_type as FuelType,
        }
      : undefined;
    const employee = record.employee
      ? {
          ...record.employee,
          status: record.employee.status as EmployeeStatus,
        }
      : undefined;

    // Handle payment_method type conversion - handle "new_value" explicitly
    let paymentMethod: PaymentMethod | undefined = undefined;
    if (record.payment_method) {
      // Filter out "new_value" which isn't part of our PaymentMethod type
      if (
        ["cash", "card", "bank_transfer", "mobile_payment"].includes(
          record.payment_method,
        )
      ) {
        paymentMethod = record.payment_method as PaymentMethod;
      }
    }

    // Use type assertion to handle payment_status that might not be detected by TypeScript
    const paymentStatus =
      ((record as any).payment_status as PaymentStatus) || "pending";

    // Ensure numeric values are actual numbers, not strings
    const quantity_liters =
      typeof record.quantity_liters === "string"
        ? parseFloat(record.quantity_liters)
        : Number(record.quantity_liters) || 0;

    const price_per_liter =
      typeof record.price_per_liter === "string"
        ? parseFloat(record.price_per_liter)
        : Number(record.price_per_liter) || 0;

    const total_cost =
      typeof record.total_cost === "string"
        ? parseFloat(record.total_cost)
        : Number(record.total_cost) || 0;

    // Return the transformed record
    return {
      ...record,
      provider,
      tank,
      employee,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      quantity_liters,
      price_per_liter,
      total_cost,
    };
  });
}

export async function createFuelSupply(
  supply: Omit<FuelSupply, "id" | "created_at">,
): Promise<FuelSupply> {
  // Get current tank level
  const { data: tankData, error: tankError } = await supabase
    .from("fuel_tanks")
    .select("current_level")
    .eq("id", supply.tank_id)
    .single();
  if (tankError)
    throw new Error(`Failed to fetch tank: ${tankError.message ?? tankError}`);
  const previousLevel = tankData.current_level;
  const newLevel = previousLevel + supply.quantity_liters;

  // Get tank capacity
  const { data: tankCapacityData, error: capacityError } = await supabase
    .from("fuel_tanks")
    .select("capacity")
    .eq("id", supply.tank_id)
    .single();
  if (capacityError)
    throw new Error(
      `Failed to fetch tank capacity: ${capacityError.message ?? capacityError}`,
    );

  // Validate new level doesn't exceed capacity
  if (newLevel > tankCapacityData.capacity) {
    throw new Error(
      `Cannot add ${supply.quantity_liters} liters. This would exceed the tank capacity of ${tankCapacityData.capacity} liters. Current level: ${previousLevel} liters.`,
    );
  }

  // Insert fuel supply
  const { data, error } = await supabase
    .from("fuel_supplies")
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
      payment_method: supply.payment_method,
    })
    .select(
      `
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `,
    )
    .single();
  if (error)
    throw new Error(`Failed to create fuel supply: ${error.message ?? error}`);

  // Update tank level
  const { error: updateTankError } = await supabase
    .from("fuel_tanks")
    .update({ current_level: newLevel })
    .eq("id", supply.tank_id);
  if (updateTankError)
    throw new Error(
      `Failed to update tank level: ${updateTankError.message ?? updateTankError}`,
    );

  // Record tank level change
  const { error: updateError } = await supabase.rpc(
    "record_tank_level_change",
    {
      p_tank_id: supply.tank_id,
      p_change_amount: Number(supply.quantity_liters),
      p_previous_level: Number(previousLevel),
      p_new_level: Number(newLevel),
      p_change_type: "add",
    },
  );

  if (updateError) {
    console.error("Error recording tank level change:", updateError);
    throw updateError;
  }

  // Create a corresponding transaction for this fuel supply
  await createTransaction({
    amount: supply.total_cost,
    payment_method: supply.payment_method,
    payment_status: supply.payment_status,
    employee_id: supply.employee_id,
    description: supply.comments || "",
    entity_type: "fuel_supply",
    entity_id: data.id,
  });

  // Safely transform the response to match our expected types
  const provider = data.provider ?? undefined;
  const tank = data.tank
    ? {
        ...data.tank,
        fuel_type: data.tank.fuel_type as FuelType,
      }
    : undefined;
  const employee = data.employee
    ? {
        ...data.employee,
        status: data.employee.status as EmployeeStatus,
      }
    : undefined;

  // Handle payment_method type conversion
  let paymentMethod: PaymentMethod | undefined = undefined;
  if (data.payment_method) {
    if (
      ["cash", "card", "bank_transfer", "mobile_payment"].includes(
        data.payment_method,
      )
    ) {
      paymentMethod = data.payment_method as PaymentMethod;
    }
  }

  // Use type assertion to handle payment_status that might not be detected by TypeScript
  const paymentStatus =
    ((data as any).payment_status as PaymentStatus) || "pending";

  return {
    ...data,
    provider,
    tank,
    employee,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
  };
}

export async function updateFuelSupply(
  id: string,
  updates: Partial<Omit<FuelSupply, "id" | "created_at">>,
): Promise<FuelSupply> {
  const { data, error } = await supabase
    .from("fuel_supplies")
    .update(updates)
    .eq("id", id)
    .select(
      `
      *,
      provider:petrol_providers(id, name, contact),
      tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
      employee:employees(id, name, position, contact, salary, hire_date, status)
    `,
    )
    .single();
  if (error)
    throw new Error(`Failed to update fuel supply: ${error.message ?? error}`);

  // Safely transform the response to match our expected types
  const provider = data.provider ?? undefined;
  const tank = data.tank
    ? {
        ...data.tank,
        fuel_type: data.tank.fuel_type as FuelType,
      }
    : undefined;
  const employee = data.employee
    ? {
        ...data.employee,
        status: data.employee.status as EmployeeStatus,
      }
    : undefined;

  // Handle payment_method type conversion
  let paymentMethod: PaymentMethod | undefined = undefined;
  if (data.payment_method) {
    if (
      ["cash", "card", "bank_transfer", "mobile_payment"].includes(
        data.payment_method,
      )
    ) {
      paymentMethod = data.payment_method as PaymentMethod;
    }
  }

  // Use type assertion to handle payment_status that might not be detected by TypeScript
  const paymentStatus =
    ((data as any).payment_status as PaymentStatus) || "pending";

  return {
    ...data,
    provider,
    tank,
    employee,
    payment_status: paymentStatus,
    payment_method: paymentMethod,
  };
}

/**
 * Delete a fuel supply record.
 * @param id - ID of the fuel supply to delete
 * @returns {Promise<void>}
 * @throws {Error} If deleting fuel supply fails
 */
export async function deleteFuelSupply(id: string): Promise<void> {
  // First, fetch the fuel supply to get quantity and tank_id
  const { data: supplyData, error: fetchError } = await supabase
    .from("fuel_supplies")
    .select("quantity_liters, tank_id")
    .eq("id", id)
    .single();

  if (fetchError) {
    throw new Error(
      `Failed to fetch fuel supply data: ${fetchError.message ?? fetchError}`,
    );
  }

  if (!supplyData) {
    throw new Error("Fuel supply not found");
  }

  // Get current tank level
  const { data: tankData, error: tankError } = await supabase
    .from("fuel_tanks")
    .select("current_level")
    .eq("id", supplyData.tank_id)
    .single();

  if (tankError) {
    throw new Error(
      `Failed to fetch tank data: ${tankError.message ?? tankError}`,
    );
  }

  // Calculate new level (decrement by supply quantity)
  const newLevel = Math.max(
    0,
    tankData.current_level - supplyData.quantity_liters,
  );

  // Update tank level
  const { error: updateError } = await supabase
    .from("fuel_tanks")
    .update({ current_level: newLevel })
    .eq("id", supplyData.tank_id);

  if (updateError) {
    throw new Error(
      `Failed to update tank level: ${updateError.message ?? updateError}`,
    );
  }

  // Record tank level change
  const { error: recordError } = await supabase.rpc(
    "record_tank_level_change",
    {
      p_tank_id: supplyData.tank_id,
      p_change_amount: Number(-supplyData.quantity_liters),
      p_previous_level: Number(tankData.current_level),
      p_new_level: Number(newLevel),
      p_change_type: "subtract",
    },
  );

  if (recordError) {
    console.error("Error recording tank level change:", recordError);
    throw new Error(
      `Failed to record tank level change: ${recordError.message ?? recordError}`,
    );
  }

  // Finally delete the fuel supply
  const { error } = await supabase.from("fuel_supplies").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete fuel supply: ${error.message ?? error}`);
  }
}
