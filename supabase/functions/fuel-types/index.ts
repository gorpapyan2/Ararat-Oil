import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Simple CORS helper
function getCorsHeaders(origin: string | null): Record<string, string> {
  let allowOrigin = '*';
  
  if (origin && origin.startsWith('http://localhost:')) {
    allowOrigin = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
  };
}

// ---- START INLINED CODE FROM SHARED MODULES ----

// Types
type FuelTypeCode = "diesel" | "gas" | "petrol_regular" | "petrol_premium";

interface FuelTypeModel {
  id: string;
  code: FuelTypeCode | string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Database utilities
const createServiceClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase URL or service role key environment variables');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
};

const createAnonClient = () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') as string;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or anon key environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

const handleError = (error: unknown): { error: string; details?: unknown } => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      error: String(error.message),
      details: error
    };
  }
  
  return {
    error: 'An unknown error occurred',
    details: error
  };
};

const getUserFromRequest = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  const supabase = createAnonClient();
  
  const { data, error } = await supabase.auth.getUser(token);
  
  if (error || !data.user) {
    return null;
  }
  
  return data.user;
};

// API utilities
function createJsonResponse<T>(data: ApiResponse<T>, status = 200, corsHeaders: Record<string, string>): Response {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    }
  );
}

function successResponse<T>(data: T, status = 200, corsHeaders: Record<string, string>): Response {
  return createJsonResponse({ data }, status, corsHeaders);
}

function errorResponse(error: unknown, status = 400, corsHeaders: Record<string, string>): Response {
  const errorData = handleError(error);
  return createJsonResponse(errorData, status, corsHeaders);
}

async function parseRequestBody<T>(request: Request): Promise<T> {
  try {
    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Content-Type must be application/json');
    }
    
    return await request.json() as T;
  } catch (error) {
    throw new Error(`Failed to parse request body: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function methodNotAllowed(corsHeaders: Record<string, string>): Response {
  return errorResponse({ message: 'Method not allowed' }, 405, corsHeaders);
}

function unauthorized(corsHeaders: Record<string, string>): Response {
  return errorResponse({ message: 'Unauthorized' }, 401, corsHeaders);
}

function notFound(resource = 'Resource', corsHeaders: Record<string, string>): Response {
  return errorResponse({ message: `${resource} not found` }, 404, corsHeaders);
}

// ---- END INLINED CODE FROM SHARED MODULES ----

// Handle fuel types operations
serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { status: 204, headers: corsHeaders });
  }

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/fuel-types', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized(corsHeaders);
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getFuelTypes(corsHeaders);
      } else if (path === '/active') {
        return await getActiveFuelTypes(corsHeaders);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getFuelTypeById(id, corsHeaders);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>(req);
      return await createFuelType(data, corsHeaders);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>>(req);
      return await updateFuelType(id, data, corsHeaders);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteFuelType(id, corsHeaders);
    }
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }

  return methodNotAllowed(corsHeaders);
});

/**
 * Get all fuel types
 */
async function getFuelTypes(corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data, 200, corsHeaders);
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}

/**
 * Get only active fuel types
 */
async function getActiveFuelTypes(corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error) throw error;

    return successResponse(data, 200, corsHeaders);
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}

/**
 * Get a fuel type by ID
 */
async function getFuelTypeById(id: string, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("fuel_types")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Fuel type', corsHeaders);
      }
      throw error;
    }

    return successResponse(data, 200, corsHeaders);
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}

/**
 * Create a new fuel type
 */
async function createFuelType(
  fuelType: Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>,
  corsHeaders: Record<string, string>
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
      }, 409, corsHeaders); // Conflict status code
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

    return successResponse(data, 201, corsHeaders);
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}

/**
 * Update an existing fuel type
 */
async function updateFuelType(
  id: string,
  updates: Partial<Omit<FuelTypeModel, 'id' | 'created_at' | 'updated_at'>>,
  corsHeaders: Record<string, string>
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
        return notFound('Fuel type', corsHeaders);
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
        }, 409, corsHeaders); // Conflict status code
      }
    }
    
    const { data, error } = await supabase
      .from("fuel_types")
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return successResponse(data, 200, corsHeaders);
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}

/**
 * Delete a fuel type
 */
async function deleteFuelType(id: string, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the fuel type exists
    const { data: existingFuelType, error: checkError } = await supabase
      .from("fuel_types")
      .select("id")
      .eq("id", id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return notFound('Fuel type', corsHeaders);
      }
      throw checkError;
    }
    
    // Check if the fuel type is referenced in tanks
    const { count: refsInTanks, error: countError } = await supabase
      .from("tanks")
      .select("id", { count: 'exact', head: true })
      .eq("fuel_type", id);
      
    if (countError) throw countError;
    
    if (refsInTanks && refsInTanks > 0) {
      return errorResponse({
        message: `Cannot delete fuel type that is used by ${refsInTanks} tanks`
      }, 409, corsHeaders); // Conflict status code
    }
    
    // Delete the fuel type
    const { error } = await supabase
      .from("fuel_types")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return new Response(null, { 
      status: 204,
      headers: corsHeaders
    });
  } catch (error) {
    return errorResponse(error, 400, corsHeaders);
  }
}
