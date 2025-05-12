import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  methodNotAllowed,
  unauthorized,
  notFound,
  parseRequestBody,
  getUrlParams
} from '../_shared/api.ts';
import { FuelSupply, Transaction } from '../_shared/types.ts';

// Handle fuel supply operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/fuel-supplies', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getFuelSupplies();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getFuelSupplyById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<FuelSupply, 'id' | 'created_at'>>(req);
      return await createFuelSupply(data, user.id);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FuelSupply, 'id' | 'created_at'>>>(req);
      return await updateFuelSupply(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteFuelSupply(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Fetch all fuel supply records with related provider, tank, and employee details.
 */
async function getFuelSupplies(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
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
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Fetch a single fuel supply by ID
 */
async function getFuelSupplyById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_supplies")
      .select(`
        *,
        provider:petrol_providers!provider_id(id, name, contact),
        tank:fuel_tanks!tank_id(id, name, fuel_type, capacity, current_level),
        employee:employees!employee_id(id, name, position, contact, salary, hire_date, status)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Fuel supply');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new fuel supply
 */
async function createFuelSupply(
  supply: Omit<FuelSupply, 'id' | 'created_at'>, 
  employeeId: string
): Promise<Response> {
  const supabase = createServiceClient();

  try {
    // Start a transaction
    const { data: tankData, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("current_level, capacity")
      .eq("id", supply.tank_id)
      .single();
    
    if (tankError) {
      throw new Error(`Failed to fetch tank: ${tankError.message}`);
    }
    
    const previousLevel = tankData.current_level;
    const newLevel = previousLevel + supply.quantity_liters;
    
    // Check if tank capacity would be exceeded
    if (newLevel > tankData.capacity) {
      throw new Error(`Tank capacity would be exceeded. Current level: ${previousLevel}, Capacity: ${tankData.capacity}, Attempting to add: ${supply.quantity_liters}`);
    }

    // Insert the fuel supply record
    const { data, error } = await supabase
      .from("fuel_supplies")
      .insert({
        ...supply,
        employee_id: employeeId, // Use the authenticated user's ID
        total_cost: supply.price_per_liter * supply.quantity_liters
      })
      .select()
      .single();

    if (error) throw error;

    // Update the tank level
    const { error: updateError } = await supabase
      .from("fuel_tanks")
      .update({ current_level: newLevel })
      .eq("id", supply.tank_id);

    if (updateError) throw updateError;

    // Record the tank level change
    const { error: changeError } = await supabase
      .from("tank_level_changes")
      .insert({
        tank_id: supply.tank_id,
        change_amount: supply.quantity_liters,
        previous_level: previousLevel,
        new_level: newLevel,
        change_type: "add"
      });

    if (changeError) throw changeError;

    // Create transaction record if payment details are provided
    if (supply.payment_method && supply.payment_status) {
      const transaction: Omit<Transaction, 'id' | 'created_at'> = {
        amount: supply.total_cost,
        payment_method: supply.payment_method,
        payment_status: supply.payment_status,
        employee_id: employeeId,
        entity_id: data.id,
        entity_type: "fuel_supply",
        description: `Fuel supply: ${supply.quantity_liters}L @ ${supply.price_per_liter}`
      };

      const { error: transactionError } = await supabase
        .from("transactions")
        .insert(transaction);

      if (transactionError) throw transactionError;
    }

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing fuel supply
 */
async function updateFuelSupply(
  id: string, 
  updates: Partial<Omit<FuelSupply, 'id' | 'created_at'>>
): Promise<Response> {
  const supabase = createServiceClient();

  try {
    // Check if the fuel supply exists
    const { data: existingSupply, error: checkError } = await supabase
      .from("fuel_supplies")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Fuel supply');
      }
      throw checkError;
    }

    // If quantity changes, we need to update the tank level
    if (updates.quantity_liters !== undefined && 
        updates.quantity_liters !== existingSupply.quantity_liters) {
      
      const difference = updates.quantity_liters - existingSupply.quantity_liters;
      
      // Get current tank level
      const { data: tankData, error: tankError } = await supabase
        .from("fuel_tanks")
        .select("current_level, capacity")
        .eq("id", existingSupply.tank_id)
        .single();
      
      if (tankError) throw tankError;
      
      const newLevel = tankData.current_level + difference;
      
      // Check if tank capacity would be exceeded
      if (newLevel > tankData.capacity) {
        throw new Error(`Tank capacity would be exceeded. Current level: ${tankData.current_level}, Capacity: ${tankData.capacity}, Attempting to add: ${difference}`);
      }
      
      // Update tank level
      const { error: updateTankError } = await supabase
        .from("fuel_tanks")
        .update({ current_level: newLevel })
        .eq("id", existingSupply.tank_id);
        
      if (updateTankError) throw updateTankError;
      
      // Record the tank level change
      const { error: changeError } = await supabase
        .from("tank_level_changes")
        .insert({
          tank_id: existingSupply.tank_id,
          change_amount: difference,
          previous_level: tankData.current_level,
          new_level: newLevel,
          change_type: difference > 0 ? "add" : "subtract"
        });
        
      if (changeError) throw changeError;
    }
    
    // Calculate total_cost if necessary
    let updatedFields = { ...updates };
    if (
      (updates.price_per_liter !== undefined || updates.quantity_liters !== undefined) &&
      !updates.total_cost
    ) {
      const price = updates.price_per_liter ?? existingSupply.price_per_liter;
      const quantity = updates.quantity_liters ?? existingSupply.quantity_liters;
      updatedFields.total_cost = price * quantity;
    }

    // Update the fuel supply
    const { data, error } = await supabase
      .from("fuel_supplies")
      .update(updatedFields)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete a fuel supply
 */
async function deleteFuelSupply(id: string): Promise<Response> {
  const supabase = createServiceClient();

  try {
    // Get the fuel supply to be deleted
    const { data: supply, error: getError } = await supabase
      .from("fuel_supplies")
      .select("*")
      .eq("id", id)
      .single();

    if (getError) {
      if (getError.code === 'PGRST116') {
        return notFound('Fuel supply');
      }
      throw getError;
    }

    // Get current tank level
    const { data: tankData, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("current_level")
      .eq("id", supply.tank_id)
      .single();

    if (tankError) throw tankError;

    // Calculate new tank level
    const newLevel = tankData.current_level - supply.quantity_liters;
    if (newLevel < 0) {
      throw new Error("Deleting this supply would result in negative tank level");
    }

    // Update tank level
    const { error: updateError } = await supabase
      .from("fuel_tanks")
      .update({ current_level: newLevel })
      .eq("id", supply.tank_id);

    if (updateError) throw updateError;

    // Record the tank level change
    const { error: changeError } = await supabase
      .from("tank_level_changes")
      .insert({
        tank_id: supply.tank_id,
        change_amount: supply.quantity_liters,
        previous_level: tankData.current_level,
        new_level: newLevel,
        change_type: "subtract"
      });

    if (changeError) throw changeError;

    // Delete related transactions
    const { error: transactionError } = await supabase
      .from("transactions")
      .delete()
      .eq("entity_id", id)
      .eq("entity_type", "fuel_supply");

    if (transactionError) throw transactionError;

    // Delete the fuel supply
    const { error: deleteError } = await supabase
      .from("fuel_supplies")
      .delete()
      .eq("id", id);

    if (deleteError) throw deleteError;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
} 