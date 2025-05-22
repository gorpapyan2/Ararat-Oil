import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

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

interface Shift {
  id: string;
  employee_id: string;
  start_time: string;
  end_time?: string;
  opening_cash: number;
  closing_cash?: number;
  sales_total: number;
  status: "OPEN" | "CLOSED";
  created_at?: string;
  updated_at?: string;
}

interface ShiftPaymentMethod {
  id: string;
  shift_id: string;
  payment_method: PaymentMethod;
  amount: number;
  reference?: string;
  created_at?: string;
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
function handleCors(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}

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

// Handle shifts operations
serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/shifts', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        return await getShifts();
      } else if (path === '/active') {
        return await getActiveShift(user.id);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getShiftById(id);
      } else if (path.match(/^\/[a-zA-Z0-9-]+\/payment-methods$/)) {
        const id = path.split('/')[1];
        return await getShiftPaymentMethods(id);
      }
    } else if (req.method === 'POST') {
      if (path === '' || path === '/') {
        const data = await parseRequestBody<{ openingCash: number; employeeIds?: string[] }>(req);
        return await startShift(data.openingCash, data.employeeIds, user.id);
      } else if (path.match(/^\/[a-zA-Z0-9-]+\/close$/)) {
        const id = path.split('/')[1];
        const data = await parseRequestBody<{ closingCash: number; paymentMethods?: ShiftPaymentMethod[] }>(req);
        return await closeShift(id, data.closingCash, data.paymentMethods);
      } else if (path.match(/^\/[a-zA-Z0-9-]+\/payment-methods$/)) {
        const id = path.split('/')[1];
        const data = await parseRequestBody<Omit<ShiftPaymentMethod, 'id' | 'created_at' | 'shift_id'>[]>(req);
        return await addShiftPaymentMethods(id, data);
      }
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+\/payment-methods$/)) {
      const id = path.split('/')[1];
      return await deleteShiftPaymentMethods(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Get all shifts
 */
async function getShifts(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("shifts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a shift by ID
 */
async function getShiftById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("shifts")
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Shift');
      }
      throw error;
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get currently active shift for a user
 */
async function getActiveShift(employeeId: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("shifts")
      .select(`
        *,
        employee:employees!employee_id(id, name)
      `)
      .eq("employee_id", employeeId)
      .eq("status", "OPEN")
      .order("start_time", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    // If there's no active shift, return null
    if (!data) {
      return successResponse(null);
    }

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Start a new shift
 */
async function startShift(
  openingCash: number, 
  employeeIds: string[] = [],
  userId: string
): Promise<Response> {
  const supabase = createServiceClient();

  try {
    // First check if there are any active shifts in the system
    const { data: existingShifts, error: shiftCheckError } = await supabase
      .from("shifts")
      .select("id, employee_id")
      .eq("status", "OPEN");

    if (shiftCheckError) throw shiftCheckError;

    if (existingShifts && existingShifts.length > 0) {
      // There's at least one active shift
      const userShift = existingShifts.find(shift => shift.employee_id === userId);
      
      if (userShift) {
        throw new Error("You already have an active shift open. Please close it before starting a new one.");
      } else {
        throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
      }
    }

    // Check if user exists in employees table
    const { data: existingEmployee, error: employeeCheckError } = await supabase
      .from("employees")
      .select("id")
      .eq("id", userId)
      .maybeSingle();

    // If user doesn't exist in employees table, create a new employee record
    if (employeeCheckError || !existingEmployee) {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) throw profileError;

      // Create an employee record for this user
      const { error: createError } = await supabase
        .from("employees")
        .insert({
          id: userId,
          name: userProfile?.full_name || "Unknown User",
          position: "Staff",
          contact: userProfile?.email || "",
          salary: 0,
          hire_date: new Date().toISOString().split("T")[0],
          status: "active",
        });

      if (createError) throw createError;
    }

    // Create the shift
    const { data, error } = await supabase
      .from("shifts")
      .insert({
        employee_id: userId,
        opening_cash: openingCash,
        status: "OPEN",
        start_time: new Date().toISOString(),
        sales_total: 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Store associated employees in shift_employees table if needed
    if (employeeIds.length > 0) {
      const allEmployeeIds = [...new Set([userId, ...employeeIds])]; // Remove duplicates
      
      // Store additional employees in metadata or a related table if needed
      // This could be implemented based on how your system handles multiple employees per shift
    }

    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Close a shift
 */
async function closeShift(
  shiftId: string,
  closingCash: number,
  paymentMethods?: ShiftPaymentMethod[]
): Promise<Response> {
  const supabase = createServiceClient();

  try {
    // First update the shift status
    const { data: updatedShift, error: updateError } = await supabase
      .from("shifts")
      .update({
        status: "CLOSED",
        end_time: new Date().toISOString(),
        closing_cash: closingCash,
      })
      .eq("id", shiftId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Then add payment methods if provided
    if (paymentMethods && paymentMethods.length > 0) {
      const paymentData = paymentMethods.map((method) => ({
        shift_id: shiftId,
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || "",
      }));

      // Insert payment methods
      const { error: paymentError } = await supabase
        .from("shift_payment_methods")
        .insert(paymentData);

      if (paymentError) throw paymentError;
    }

    return successResponse(updatedShift);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get payment methods for a shift
 */
async function getShiftPaymentMethods(shiftId: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("shift_payment_methods")
      .select("*")
      .eq("shift_id", shiftId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Add payment methods to a shift
 */
async function addShiftPaymentMethods(
  shiftId: string,
  methods: Omit<ShiftPaymentMethod, 'id' | 'created_at' | 'shift_id'>[]
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if shift exists
    const { data: shift, error: shiftError } = await supabase
      .from("shifts")
      .select("id")
      .eq("id", shiftId)
      .single();

    if (shiftError) {
      if (shiftError.code === 'PGRST116') {
        return notFound('Shift');
      }
      throw shiftError;
    }

    // Prepare data for insertion
    const paymentData = methods.map((method) => ({
      shift_id: shiftId,
      payment_method: method.payment_method,
      amount: method.amount,
      reference: method.reference || "",
    }));

    // Insert payment methods
    const { data, error } = await supabase
      .from("shift_payment_methods")
      .insert(paymentData)
      .select();

    if (error) throw error;

    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete all payment methods for a shift
 */
async function deleteShiftPaymentMethods(shiftId: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Check if shift exists
    const { data: shift, error: shiftError } = await supabase
      .from("shifts")
      .select("id")
      .eq("id", shiftId)
      .single();

    if (shiftError) {
      if (shiftError.code === 'PGRST116') {
        return notFound('Shift');
      }
      throw shiftError;
    }

    // Delete payment methods
    const { error } = await supabase
      .from("shift_payment_methods")
      .delete()
      .eq("shift_id", shiftId);

    if (error) throw error;

    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
