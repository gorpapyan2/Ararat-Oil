import { supabase } from "@/services/supabase";
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
  try {
    console.log("Fetching fuel supplies...");
    
    // First check if the fuel_supplies table exists and has data
    const { count, error: countError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error checking fuel_supplies count:", countError);
      return [];
    }
    
    console.log(`The fuel_supplies table has ${count} records`);
    
    // If no records, return empty array early
    if (!count || count === 0) {
      console.log("No fuel supplies found in database");
      return [];
    }
    
    // Now proceed with the full query including relations
    // Use the correct foreign key references with the bang (!) operator
    const { data, error } = await supabase
      .from("fuel_supplies")
      .select(`
        *,
        provider:petrol_providers!provider_id(id, name, contact),
        tank:fuel_tanks!tank_id(id, name, fuel_type, capacity, current_level),
        employee:employees!employee_id(id, name, position, contact, salary, hire_date, status)
      `)
      .order("delivery_date", { ascending: false });

    if (error) {
      console.error("Error fetching fuel supplies:", error.message ?? error);
      // Try a more basic query without relations to see if that works
      const { data: basicData, error: basicError } = await supabase
        .from("fuel_supplies")
        .select("*")
        .order("delivery_date", { ascending: false });
        
      if (basicError) {
        console.error("Even basic query failed:", basicError);
        return [];
      }
      
      console.log(`Basic query returned ${basicData?.length || 0} records without relations`);
      
      // Transform basic data to match expected types
      return (basicData || []).map(record => {
        // Handle payment_method type conversion
        let paymentMethod: PaymentMethod | undefined = undefined;
        if (record.payment_method) {
          if (
            ["cash", "card", "bank_transfer", "mobile_payment"].includes(
              record.payment_method,
            )
          ) {
            paymentMethod = record.payment_method as PaymentMethod;
          }
        }

        // Use type assertion to handle payment_status
        const paymentStatus =
          ((record as any).payment_status as PaymentStatus) || "pending";
          
        // Ensure numeric values are actual numbers
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
            
        return {
          ...record,
          provider: undefined,
          tank: undefined,
          employee: undefined,
          payment_status: paymentStatus,
          payment_method: paymentMethod,
          quantity_liters,
          price_per_liter,
          total_cost,
        };
      });
    }

    if (!data || data.length === 0) {
      console.log("No fuel supplies found in database");
      return [];
    }

    console.log(`Successfully fetched ${data.length} fuel supplies`);
    
    // Log the first record to see its structure
    if (data.length > 0) {
      console.log("First record structure:", Object.keys(data[0]));
      console.log("Sample relations:", {
        provider: data[0].provider,
        tank: data[0].tank,
        employee: data[0].employee
      });
    }
    
    // Transform the data to match our expected types
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
  } catch (e) {
    console.error("Exception fetching fuel supplies:", e);
    return []; // Return empty array instead of throwing
  }
}

export async function createFuelSupply(
  supply: Omit<FuelSupply, "id" | "created_at">,
): Promise<FuelSupply> {
  try {
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Creating fuel supply. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for fuel supply creation");
      
      // Create a mock fuel supply with a generated ID
      const mockId = `offline-${Date.now()}`;
      const mockCreatedAt = new Date().toISOString();
      
      const mockFuelSupply: FuelSupply = {
        id: mockId,
        created_at: mockCreatedAt,
        ...supply,
        // Add mock references that would normally come from the database
        provider: { id: supply.provider_id, name: "Offline Provider", contact: "" },
        tank: { 
          id: supply.tank_id, 
          name: "Offline Tank", 
          fuel_type: "petrol", 
          capacity: 10000, 
          current_level: 5000 
        },
        employee: { id: supply.employee_id, name: "Offline Employee" }
      };

      console.log("Created mock fuel supply:", mockFuelSupply);
      return mockFuelSupply;
    }

    // Online mode - continue with database operations
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
        payment_status: supply.payment_status || "pending",
        payment_method: supply.payment_method,
      })
      .select(
        `
        *,
        provider:petrol_providers(id, name, contact),
        tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
        employee:employees(id, name)
        `
      )
      .single();

    if (error) throw new Error(`Failed to create supply: ${error.message}`);
    if (!data) throw new Error("No data returned after creating supply");

    // Update the tank level
    const { error: updateError } = await supabase
      .from("fuel_tanks")
      .update({ current_level: newLevel })
      .eq("id", supply.tank_id);

    if (updateError)
      throw new Error(
        `Failed to update tank level: ${updateError.message ?? updateError}`,
      );

    // Create a financial transaction record if payment is not pending
    if (supply.payment_status && supply.payment_status !== "pending") {
      try {
        await createTransaction({
          date: supply.delivery_date,
          amount: Number(supply.total_cost),
          type: "expense",
          category: "fuel_supply",
          payment_method: supply.payment_method || "cash",
          description: `Fuel supply from ${data.provider?.name || 'provider'} - ${supply.quantity_liters} liters`,
          reference_id: data.id,
          reference_type: "fuel_supply",
        });
        console.log("Transaction recorded for fuel supply");
      } catch (transactionError) {
        console.error(
          "Failed to create transaction for fuel supply:",
          transactionError,
        );
        // Don't fail the entire operation if only the transaction creation failed
      }
    }

    console.log("Fuel supply created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating fuel supply:", error);
    throw error;
  }
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
