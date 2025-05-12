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
import { FuelTypeModel } from '../_shared/types.ts';

// Handle fuel types operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/fuel-types', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getFuelTypes();
      } else if (path === '/active') {
        return await getActiveFuelTypes();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getFuelTypeById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>(req);
      return await createFuelType(data);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>>(req);
      return await updateFuelType(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteFuelType(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get all fuel types
 */
async function getFuelTypes(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get only active fuel types
 */
async function getActiveFuelTypes(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a fuel type by ID
 */
async function getFuelTypeById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Fuel type');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new fuel type
 */
async function createFuelType(
  fuelType: Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if a fuel type with the same code already exists
    const { data: existing, error: checkError } = await supabase
      .from("fuel_types")
      .select("id")
      .eq("code", fuelType.code)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    if (existing) {
      return errorResponse({
        message: `A fuel type with code "${fuelType.code}" already exists`
      }, 409); // Conflict status code
    }
    
    const { data, error } = await supabase
      .from("fuel_types")
      .insert({
        ...fuelType,
        is_active: fuelType.is_active !== undefined ? fuelType.is_active : true
      })
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing fuel type
 */
async function updateFuelType(
  id: string,
  updates: Partial<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the fuel type exists
    const { data: existingFuelType, error: checkError } = await supabase
      .from("fuel_types")
      .select("id, code")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Fuel type');
      }
      throw checkError;
    }
    
    // If code is being updated, check for duplicates
    if (updates.code && updates.code !== existingFuelType.code) {
      const { data: duplicate, error: dupeError } = await supabase
        .from("fuel_types")
        .select("id")
        .eq("code", updates.code)
        .neq("id", id)
        .maybeSingle();
        
      if (dupeError) throw dupeError;
      
      if (duplicate) {
        return errorResponse({
          message: `A fuel type with code "${updates.code}" already exists`
        }, 409); // Conflict status code
      }
    }
    
    // Set updated_at timestamp
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update the fuel type
    const { data, error } = await supabase
      .from("fuel_types")
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
 * Delete a fuel type
 */
async function deleteFuelType(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if there are related tanks
    const { count: tankCount, error: tankError } = await supabase
      .from("fuel_tanks")
      .select("*", { count: "exact", head: true })
      .eq("fuel_type_id", id);

    if (tankError) throw tankError;
    
    if (tankCount && tankCount > 0) {
      return errorResponse({
        message: `Cannot delete this fuel type as it is used by ${tankCount} tanks. Consider marking it as inactive instead.`
      }, 409); // Conflict status code
    }
    
    // Check if there are related sales records
    const { count: salesCount, error: salesError } = await supabase
      .from("sales")
      .select("*", { count: "exact", head: true })
      .eq("fuel_type", id);
      
    if (salesError) throw salesError;
    
    if (salesCount && salesCount > 0) {
      return errorResponse({
        message: `Cannot delete this fuel type as it is referenced in ${salesCount} sales records. Consider marking it as inactive instead.`
      }, 409); // Conflict status code
    }

    // Delete the fuel type
    const { error } = await supabase
      .from("fuel_types")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
} 