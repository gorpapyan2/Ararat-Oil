import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  methodNotAllowed,
  unauthorized,
  notFound,
  parseRequestBody
} from '../_shared/api.ts';
import { FuelTank, TankLevelChange } from '../_shared/types.ts';

// Handle tanks operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/tanks', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getTanks();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getTankById(id);
      } else if (path.match(/^\/[a-zA-Z0-9-]+\/level-changes$/)) {
        const id = path.split('/')[1];
        return await getTankLevelChanges(id);
      }
    } else if (req.method === 'POST') {
      if (path === '' || path === '/') {
        const data = await parseRequestBody<Omit<FuelTank, 'id' | 'created_at'>>(req);
        return await createTank(data);
      } else if (path.match(/^\/[a-zA-Z0-9-]+\/adjust-level$/)) {
        const id = path.split('/')[1];
        const data = await parseRequestBody<{ change_amount: number; change_type: 'add' | 'subtract'; reason?: string }>(req);
        return await adjustTankLevel(id, data.change_amount, data.change_type, data.reason);
      }
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FuelTank, 'id' | 'created_at'>>>(req);
      return await updateTank(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteTank(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get all tanks
 */
async function getTanks(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_tanks")
      .select(`
        *,
        fuel_type:fuel_types!fuel_type_id(id, name, code)
      `)
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a tank by ID
 */
async function getTankById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_tanks")
      .select(`
        *,
        fuel_type:fuel_types!fuel_type_id(id, name, code)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Tank');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get level changes for a tank
 */
async function getTankLevelChanges(tankId: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if tank exists
    const { data: tank, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("id")
      .eq("id", tankId)
      .single();
      
    if (tankError) {
      if (tankError.code === 'PGRST116') {
        return notFound('Tank');
      }
      throw tankError;
    }
    
    const { data, error } = await supabase
      .from("tank_level_changes")
      .select("*")
      .eq("tank_id", tankId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new tank
 */
async function createTank(
  tank: Omit<FuelTank, 'id' | 'created_at'>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate fuel type exists
    if (tank.fuel_type_id) {
      const { data: fuelType, error: fuelTypeError } = await supabase
        .from("fuel_types")
        .select("id")
        .eq("id", tank.fuel_type_id)
        .single();
        
      if (fuelTypeError) {
        if (fuelTypeError.code === 'PGRST116') {
          return errorResponse({
            message: `Fuel type with ID ${tank.fuel_type_id} not found`
          }, 400);
        }
        throw fuelTypeError;
      }
    }
    
    // Validate capacity and current level
    if (tank.capacity <= 0) {
      return errorResponse({
        message: "Tank capacity must be greater than zero"
      }, 400);
    }
    
    if (tank.current_level < 0) {
      return errorResponse({
        message: "Tank current level cannot be negative"
      }, 400);
    }
    
    if (tank.current_level > tank.capacity) {
      return errorResponse({
        message: "Tank current level cannot exceed capacity"
      }, 400);
    }
    
    const { data, error } = await supabase
      .from("fuel_tanks")
      .insert(tank)
      .select(`
        *,
        fuel_type:fuel_types!fuel_type_id(id, name, code)
      `)
      .single();

    if (error) throw error;
    
    // Record initial tank level if greater than zero
    if (tank.current_level > 0) {
      const levelChange: Omit<TankLevelChange, 'id' | 'created_at'> = {
        tank_id: data.id,
        change_amount: tank.current_level,
        previous_level: 0,
        new_level: tank.current_level,
        change_type: "add"
      };
      
      const { error: levelError } = await supabase
        .from("tank_level_changes")
        .insert(levelChange);
        
      if (levelError) {
        console.error("Failed to record initial tank level change:", levelError);
        // Don't fail the whole operation
      }
    }

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing tank
 */
async function updateTank(
  id: string,
  updates: Partial<Omit<FuelTank, 'id' | 'created_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the tank exists
    const { data: existingTank, error: checkError } = await supabase
      .from("fuel_tanks")
      .select("*")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Tank');
      }
      throw checkError;
    }
    
    // If fuel type is being updated, validate it exists
    if (updates.fuel_type_id) {
      const { data: fuelType, error: fuelTypeError } = await supabase
        .from("fuel_types")
        .select("id")
        .eq("id", updates.fuel_type_id)
        .single();
        
      if (fuelTypeError) {
        if (fuelTypeError.code === 'PGRST116') {
          return errorResponse({
            message: `Fuel type with ID ${updates.fuel_type_id} not found`
          }, 400);
        }
        throw fuelTypeError;
      }
    }
    
    // Validate capacity
    if (updates.capacity !== undefined) {
      if (updates.capacity <= 0) {
        return errorResponse({
          message: "Tank capacity must be greater than zero"
        }, 400);
      }
      
      // If capacity is being reduced, check that current level doesn't exceed new capacity
      const currentLevel = updates.current_level !== undefined 
        ? updates.current_level 
        : existingTank.current_level;
        
      if (currentLevel > updates.capacity) {
        return errorResponse({
          message: `Cannot reduce capacity below current level (${currentLevel})`
        }, 400);
      }
    }
    
    // Validate current level
    if (updates.current_level !== undefined) {
      if (updates.current_level < 0) {
        return errorResponse({
          message: "Tank current level cannot be negative"
        }, 400);
      }
      
      const capacity = updates.capacity !== undefined
        ? updates.capacity
        : existingTank.capacity;
        
      if (updates.current_level > capacity) {
        return errorResponse({
          message: `Tank current level (${updates.current_level}) cannot exceed capacity (${capacity})`
        }, 400);
      }
      
      // Record level change if current_level is being updated
      if (updates.current_level !== existingTank.current_level) {
        const change_amount = Math.abs(updates.current_level - existingTank.current_level);
        const change_type = updates.current_level > existingTank.current_level ? "add" : "subtract";
        
        const levelChange: Omit<TankLevelChange, 'id' | 'created_at'> = {
          tank_id: id,
          change_amount,
          previous_level: existingTank.current_level,
          new_level: updates.current_level,
          change_type
        };
        
        const { error: levelError } = await supabase
          .from("tank_level_changes")
          .insert(levelChange);
          
        if (levelError) {
          console.error("Failed to record tank level change:", levelError);
          // Don't fail the whole operation
        }
      }
    }

    // Update the tank
    const { data, error } = await supabase
      .from("fuel_tanks")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        fuel_type:fuel_types!fuel_type_id(id, name, code)
      `)
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete a tank
 */
async function deleteTank(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if there are related filling systems
    const { count: fillingSystemCount, error: fillingError } = await supabase
      .from("filling_systems")
      .select("*", { count: "exact", head: true })
      .eq("tank_id", id);

    if (fillingError) throw fillingError;
    
    if (fillingSystemCount && fillingSystemCount > 0) {
      return errorResponse({
        message: `Cannot delete this tank as it is connected to ${fillingSystemCount} filling systems. Remove those connections first.`
      }, 409); // Conflict status code
    }
    
    // Check if there are related fuel supplies
    const { count: supplyCount, error: supplyError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true })
      .eq("tank_id", id);
      
    if (supplyError) throw supplyError;
    
    if (supplyCount && supplyCount > 0) {
      return errorResponse({
        message: `Cannot delete this tank as it has ${supplyCount} fuel supply records.`
      }, 409); // Conflict status code
    }
    
    // Delete tank level changes first
    const { error: levelChangeError } = await supabase
      .from("tank_level_changes")
      .delete()
      .eq("tank_id", id);
      
    if (levelChangeError) throw levelChangeError;

    // Delete the tank
    const { error } = await supabase
      .from("fuel_tanks")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Adjust tank level
 */
async function adjustTankLevel(
  tankId: string, 
  changeAmount: number, 
  changeType: 'add' | 'subtract',
  reason?: string
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if tank exists and get current level
    const { data: tank, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("*")
      .eq("id", tankId)
      .single();
      
    if (tankError) {
      if (tankError.code === 'PGRST116') {
        return notFound('Tank');
      }
      throw tankError;
    }
    
    // Validate change amount
    if (changeAmount <= 0) {
      return errorResponse({
        message: "Change amount must be greater than zero"
      }, 400);
    }
    
    // Calculate new level
    let newLevel: number;
    if (changeType === 'add') {
      newLevel = tank.current_level + changeAmount;
      
      // Check if new level exceeds capacity
      if (newLevel > tank.capacity) {
        return errorResponse({
          message: `Adding ${changeAmount} would exceed tank capacity of ${tank.capacity}. Current level: ${tank.current_level}`
        }, 400);
      }
    } else {
      newLevel = tank.current_level - changeAmount;
      
      // Check if new level would be negative
      if (newLevel < 0) {
        return errorResponse({
          message: `Cannot remove ${changeAmount} as it would result in negative tank level. Current level: ${tank.current_level}`
        }, 400);
      }
    }
    
    // Record the tank level change
    const levelChange: Omit<TankLevelChange, 'id' | 'created_at'> = {
      tank_id: tankId,
      change_amount: changeAmount,
      previous_level: tank.current_level,
      new_level: newLevel,
      change_type: changeType
    };
    
    const { error: levelChangeError } = await supabase
      .from("tank_level_changes")
      .insert(levelChange);
      
    if (levelChangeError) throw levelChangeError;
    
    // Update the tank's current level
    const { data, error: updateError } = await supabase
      .from("fuel_tanks")
      .update({ current_level: newLevel })
      .eq("id", tankId)
      .select()
      .single();
      
    if (updateError) throw updateError;
    
    return successResponse({
      ...data,
      adjustment: {
        change_amount: changeAmount,
        change_type: changeType,
        previous_level: tank.current_level,
        new_level: newLevel,
        reason: reason || null
      }
    });
  } catch (error) {
    return errorResponse(error);
  }
} 