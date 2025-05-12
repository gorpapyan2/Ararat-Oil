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
import { PetrolProvider } from '../_shared/types.ts';

// Handle petrol provider operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/petrol-providers', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getPetrolProviders();
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getPetrolProviderById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<PetrolProvider, 'id' | 'created_at' | 'updated_at'>>(req);
      return await createPetrolProvider(data);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<PetrolProvider, 'id' | 'created_at' | 'updated_at'>>>(req);
      return await updatePetrolProvider(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deletePetrolProvider(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get all petrol providers
 */
async function getPetrolProviders(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("petrol_providers")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a petrol provider by ID
 */
async function getPetrolProviderById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("petrol_providers")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Petrol provider');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new petrol provider
 */
async function createPetrolProvider(
  provider: Omit<PetrolProvider, 'id' | 'created_at' | 'updated_at'>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("petrol_providers")
      .insert({
        ...provider,
        is_active: provider.is_active !== undefined ? provider.is_active : true
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
 * Update an existing petrol provider
 */
async function updatePetrolProvider(
  id: string,
  updates: Partial<Omit<PetrolProvider, 'id' | 'created_at' | 'updated_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the provider exists
    const { data: existingProvider, error: checkError } = await supabase
      .from("petrol_providers")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Petrol provider');
      }
      throw checkError;
    }
    
    // Set updated_at timestamp
    const updatedFields = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Update the petrol provider
    const { data, error } = await supabase
      .from("petrol_providers")
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
 * Delete a petrol provider
 */
async function deletePetrolProvider(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if there are related fuel supplies
    const { count, error: checkError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true })
      .eq("provider_id", id);

    if (checkError) throw checkError;
    
    if (count && count > 0) {
      return errorResponse({
        message: `Cannot delete this provider as it has ${count} related fuel supply records. Consider marking it as inactive instead.`
      }, 409); // Conflict status code
    }

    // Delete the petrol provider
    const { error } = await supabase
      .from("petrol_providers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
} 