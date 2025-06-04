import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { getCorsHeaders, handleCors } from '../_shared/cors.ts';

// ---- START INLINED CODE FROM SHARED MODULES ----

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Shared types
type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
type PaymentMethod = "cash" | "card" | "bank_transfer" | "mobile_payment";
type FuelType = "diesel" | "gas" | "petrol_regular" | "petrol_premium";

interface Sale {
  id: string;
  date: string;
  fuel_type: FuelType;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  payment_status: PaymentStatus;
  filling_system_name: string;
  created_at?: string;
  meter_start: number;
  meter_end: number;
  filling_system_id: string;
  employee_id: string;
  shift_id?: string;
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
function createJsonResponse<T>(data: { data?: T; error?: string }, status = 200): Response {
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

function successResponse<T>(data: T, status = 200): Response {
  return createJsonResponse({ data }, status);
}

function errorResponse(error: unknown, status = 400): Response {
  const errorData = handleError(error);
  return createJsonResponse(errorData, status);
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

function getUrlParams(request: Request): URLSearchParams {
  const url = new URL(request.url);
  return url.searchParams;
}

function methodNotAllowed(): Response {
  return errorResponse({ message: 'Method not allowed' }, 405);
}

function unauthorized(): Response {
  return errorResponse({ message: 'Unauthorized' }, 401);
}

function notFound(resource = 'Resource'): Response {
  return errorResponse({ message: `${resource} not found` }, 404);
}

// ---- END INLINED CODE FROM SHARED MODULES ----

// Types for better type safety
interface SaleWithRelations extends Sale {
  filling_system: {
    id: string;
    name: string;
    tank_id: string;
  };
  employee: {
    id: string;
    name: string;
  };
}

interface SaleFilters {
  shiftId?: string;
  startDate?: string;
  endDate?: string;
  employee?: string;
}

interface SaleValidation {
  isValid: boolean;
  message?: string;
  status?: number;
}

console.info('Sales Edge Function started');

// Handle sales operations
serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Robust path parsing
  const url = new URL(req.url);
  const pathParts = url.pathname.replace(/^\/functions\/v1\//, '').split('/');
  const mainRoute = pathParts[0];
  const subRoute = pathParts[1] || '';

  if (mainRoute !== 'sales') {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Example: /sales/summary
  if (subRoute === 'summary') {
    if (req.method === 'GET') {
      // Replace with actual logic
      return new Response(JSON.stringify({ summary: {} }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        const params = getUrlParams(req);
        const filters: SaleFilters = {
          shiftId: params.get('shift_id') || undefined,
          startDate: params.get('start_date') || undefined,
          endDate: params.get('end_date') || undefined,
          employee: params.get('employee') || undefined
        };
        
        return await getSales(filters);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getSaleById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<Sale, 'id' | 'created_at'>>(req);
      return await createSale(data, user.id);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<Sale, 'id' | 'created_at'>>>(req);
      return await updateSale(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteSale(id);
    }
  } catch (error) {
    console.error('Sales function error:', error);
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Validate sale data
 */
function validateSale(sale: Partial<Sale>): SaleValidation {
  if (!sale.date) {
    return { isValid: false, message: "Sale date is required", status: 400 };
  }
  
  if (!sale.fuel_type) {
    return { isValid: false, message: "Fuel type is required", status: 400 };
  }
  
  if (!sale.quantity || sale.quantity <= 0) {
    return { isValid: false, message: "Quantity must be a positive number", status: 400 };
  }
  
  if (!sale.price_per_unit || sale.price_per_unit <= 0) {
    return { isValid: false, message: "Price per unit must be a positive number", status: 400 };
  }
  
  if (!sale.filling_system_id) {
    return { isValid: false, message: "Filling system is required", status: 400 };
  }
  
  if (!sale.meter_start || !sale.meter_end || sale.meter_start >= sale.meter_end) {
    return { 
      isValid: false, 
      message: "Meter start and end values must be provided, and end must be greater than start", 
      status: 400 
    };
  }
  
  return { isValid: true };
}

/**
 * Get sales with optional filtering
 */
async function getSales(filters: SaleFilters): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Start with base query
    let query = supabase
      .from("sales")
      .select(`
        *,
        filling_system:filling_systems(id, name, tank_id),
        employee:employees!employee_id(id, name)
      `)
      .order("date", { ascending: false });
    
    // Apply filters if provided
    if (filters.shiftId) {
      query = query.eq("shift_id", filters.shiftId);
    }
    
    if (filters.startDate) {
      query = query.gte("date", filters.startDate);
    }
    
    if (filters.endDate) {
      query = query.lte("date", filters.endDate);
    }
    
    if (filters.employee) {
      query = query.eq("employee_id", filters.employee);
    }
    
    // Execute the query
    const { data, error } = await query;

    if (error) throw error;

    return successResponse(data as SaleWithRelations[]);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return errorResponse(error);
  }
}

/**
 * Get a sale by ID
 */
async function getSaleById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("sales")
      .select(`
        *,
        filling_system:filling_systems(id, name, tank_id),
        employee:employees!employee_id(id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Sale');
      }
      throw error;
    }

    return successResponse(data as SaleWithRelations);
  } catch (error) {
    console.error(`Error fetching sale ${id}:`, error);
    return errorResponse(error);
  }
}

/**
 * Create a new sale
 */
async function createSale(
  sale: Omit<Sale, 'id' | 'created_at'>,
  userId: string
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate the sale data
    const validation = validateSale(sale);
    if (!validation.isValid) {
      return errorResponse({ message: validation.message }, validation.status);
    }
    
    // Verify the filling system exists
    const { data: fillingSystem, error: fillingSystemError } = await supabase
      .from("filling_systems")
      .select("id, name, tank_id")
      .eq("id", sale.filling_system_id)
      .single();
      
    if (fillingSystemError) {
      if (fillingSystemError.code === 'PGRST116') {
        return errorResponse({
          message: `Filling system with ID ${sale.filling_system_id} not found`
        }, 400);
      }
      throw fillingSystemError;
    }
    
    // Set filling_system_name if not provided
    if (!sale.filling_system_name) {
      sale.filling_system_name = fillingSystem.name;
    }
    
    // Calculate total_sales if not provided
    if (!sale.total_sales) {
      sale.total_sales = Number((sale.quantity * sale.price_per_unit).toFixed(2));
    }
    
    // Set employee_id to current user if not provided
    if (!sale.employee_id) {
      sale.employee_id = userId;
    }
    
    // If a shift_id is provided, verify it exists and is open
    if (sale.shift_id) {
      const { data: shift, error: shiftError } = await supabase
        .from("shifts")
        .select("id, status")
        .eq("id", sale.shift_id)
        .single();
        
      if (shiftError) {
        if (shiftError.code === 'PGRST116') {
          return errorResponse({
            message: `Shift with ID ${sale.shift_id} not found`
          }, 400);
        }
        throw shiftError;
      }
      
      if (shift.status !== "OPEN") {
        return errorResponse({
          message: "Cannot add sales to a closed shift"
        }, 400);
      }
    }
    
    // Create the sale
    const { data, error } = await supabase
      .from("sales")
      .insert(sale)
      .select(`
        *,
        filling_system:filling_systems(id, name, tank_id),
        employee:employees!employee_id(id, name)
      `)
      .single();
      
    if (error) throw error;
    
    return successResponse(data as SaleWithRelations, 201);
  } catch (error) {
    console.error('Error creating sale:', error);
    return errorResponse(error);
  }
}

/**
 * Update an existing sale
 */
async function updateSale(
  id: string,
  updates: Partial<Omit<Sale, 'id' | 'created_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Validate the updates
    const validation = validateSale(updates);
    if (!validation.isValid) {
      return errorResponse({ message: validation.message }, validation.status);
    }
    
    // Check if the sale exists
    const { data: existingSale, error: existingError } = await supabase
      .from("sales")
      .select("id, shift_id")
      .eq("id", id)
      .single();
      
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        return notFound('Sale');
      }
      throw existingError;
    }
    
    // If updating shift_id, verify the new shift exists and is open
    if (updates.shift_id && updates.shift_id !== existingSale.shift_id) {
      const { data: shift, error: shiftError } = await supabase
        .from("shifts")
        .select("id, status")
        .eq("id", updates.shift_id)
        .single();
        
      if (shiftError) {
        if (shiftError.code === 'PGRST116') {
          return errorResponse({
            message: `Shift with ID ${updates.shift_id} not found`
          }, 400);
        }
        throw shiftError;
      }
      
      if (shift.status !== "OPEN") {
        return errorResponse({
          message: "Cannot move sale to a closed shift"
        }, 400);
      }
    }
    
    // If updating filling_system_id, verify it exists
    if (updates.filling_system_id) {
      const { data: fillingSystem, error: fillingSystemError } = await supabase
        .from("filling_systems")
        .select("id, name")
        .eq("id", updates.filling_system_id)
        .single();
        
      if (fillingSystemError) {
        if (fillingSystemError.code === 'PGRST116') {
          return errorResponse({
            message: `Filling system with ID ${updates.filling_system_id} not found`
          }, 400);
        }
        throw fillingSystemError;
      }
      
      // Set filling_system_name if not provided
      if (!updates.filling_system_name) {
        updates.filling_system_name = fillingSystem.name;
      }
    }
    
    // Calculate total_sales if quantity or price_per_unit is updated
    if (updates.quantity || updates.price_per_unit) {
      const quantity = updates.quantity || existingSale.quantity;
      const pricePerUnit = updates.price_per_unit || existingSale.price_per_unit;
      updates.total_sales = Number((quantity * pricePerUnit).toFixed(2));
    }
    
    // Update the sale
    const { data, error } = await supabase
      .from("sales")
      .update(updates)
      .eq("id", id)
      .select(`
        *,
        filling_system:filling_systems(id, name, tank_id),
        employee:employees!employee_id(id, name)
      `)
      .single();
      
    if (error) throw error;
    
    return successResponse(data as SaleWithRelations);
  } catch (error) {
    console.error(`Error updating sale ${id}:`, error);
    return errorResponse(error);
  }
}

/**
 * Delete a sale
 */
async function deleteSale(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if the sale exists
    const { data: existingSale, error: existingError } = await supabase
      .from("sales")
      .select("id, shift_id")
      .eq("id", id)
      .single();
      
    if (existingError) {
      if (existingError.code === 'PGRST116') {
        return notFound('Sale');
      }
      throw existingError;
    }
    
    // If the sale is part of a shift, verify the shift is open
    if (existingSale.shift_id) {
      const { data: shift, error: shiftError } = await supabase
        .from("shifts")
        .select("id, status")
        .eq("id", existingSale.shift_id)
        .single();
        
      if (shiftError) throw shiftError;
      
      if (shift.status !== "OPEN") {
        return errorResponse({
          message: "Cannot delete sale from a closed shift"
        }, 400);
      }
    }
    
    // Delete the sale
    const { error } = await supabase
      .from("sales")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    
    return successResponse(null, 204);
  } catch (error) {
    console.error(`Error deleting sale ${id}:`, error);
    return errorResponse(error);
  }
}
