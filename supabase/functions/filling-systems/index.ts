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
import { FillingSystem } from '../_shared/types.ts';

// Handle filling systems operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/filling-systems', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getFillingSystems();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getFillingSystemById(id);
      } else if (path === '/validate-tank-ids') {
        // Use URL parameters for this
        const tankIds = url.searchParams.get('tankIds')?.split(',');
        if (!tankIds) {
          return errorResponse({ message: "No tank IDs provided" }, 400);
        }
        return await validateTankIds(tankIds);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<FillingSystem, 'id' | 'created_at'>>(req);
      return await createFillingSystem(data);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FillingSystem, 'id' | 'created_at'>>>(req);
      return await updateFillingSystem(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteFillingSystem(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get all filling systems
 */
async function getFillingSystems(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("filling_systems")
      .select(`
        *,
        tank:fuel_tanks!tank_id(
          id, 
          name, 
          fuel_type, 
          capacity, 
          current_level,
          fuel_type:fuel_types!fuel_type_id(id, name, code)
        )
      `)
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a filling system by ID
 */
async function getFillingSystemById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("filling_systems")
      .select(`
        *,
        tank:fuel_tanks!tank_id(
          id, 
          name, 
          fuel_type, 
          capacity, 
          current_level,
          fuel_type:fuel_types!fuel_type_id(id, name, code)
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Filling system');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new filling system
 */
async function createFillingSystem(
  fillingSystem: Omit<FillingSystem, 'id' | 'created_at'>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate tank exists
    const { data: tank, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("id")
      .eq("id", fillingSystem.tank_id)
      .single();
      
    if (tankError) {
      if (tankError.code === 'PGRST116') {
        return errorResponse({
          message: `Tank with ID ${fillingSystem.tank_id} not found`
        }, 400);
      }
      throw tankError;
    }
    
    const { data, error } = await supabase
      .from("filling_systems")
      .insert(fillingSystem)
      .select(`
        *,
        tank:fuel_tanks!tank_id(
          id, 
          name, 
          fuel_type, 
          capacity, 
          current_level,
          fuel_type:fuel_types!fuel_type_id(id, name, code)
        )
      `)
      .single();

    if (error) throw error;

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing filling system
 */
async function updateFillingSystem(
  id: string,
  updates: Partial<Omit<FillingSystem, 'id' | 'created_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the filling system exists
    const { data: existingSystem, error: checkError } = await supabase
      .from("filling_systems")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Filling system');
      }
      throw checkError;
    }
    
    // If tank_id is being updated, validate the tank exists
    if (updates.tank_id) {
      const { data: tank, error: tankError } = await supabase
        .from("fuel_tanks")
        .select("id")
        .eq("id", updates.tank_id)
        .single();
        
      if (tankError) {
        if (tankError.code === 'PGRST116') {
          return errorResponse({
            message: `Tank with ID ${updates.tank_id} not found`
          }, 400);
        }
        throw tankError;
      }
    }

    // Update the filling system
    const { data, error } = await supabase
      .from("filling_systems")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        tank:fuel_tanks!tank_id(
          id, 
          name, 
          fuel_type, 
          capacity, 
          current_level,
          fuel_type:fuel_types!fuel_type_id(id, name, code)
        )
      `)
      .single();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete a filling system
 */
async function deleteFillingSystem(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if there are related sales
    const { count, error: salesError } = await supabase
      .from("sales")
      .select("*", { count: "exact", head: true })
      .eq("filling_system_id", id);

    if (salesError) throw salesError;
    
    if (count && count > 0) {
      return errorResponse({
        message: `Cannot delete this filling system as it has ${count} related sales records.`
      }, 409); // Conflict status code
    }

    // Delete the filling system
    const { error } = await supabase
      .from("filling_systems")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Validate that a list of tank IDs exist
 */
async function validateTankIds(tankIds: string[]): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check each tank ID
    const invalidTankIds: string[] = [];
    const validTankIds: string[] = [];
    
    for (const tankId of tankIds) {
      const { data, error } = await supabase
        .from("fuel_tanks")
        .select("id")
        .eq("id", tankId)
        .single();
      
      if (error || !data) {
        invalidTankIds.push(tankId);
      } else {
        validTankIds.push(tankId);
      }
    }
    
    return successResponse({
      valid: invalidTankIds.length === 0,
      validTankIds,
      invalidTankIds
    });
  } catch (error) {
    return errorResponse(error);
  }
} 