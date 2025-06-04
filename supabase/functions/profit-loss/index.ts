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

// Shared types for profit loss
interface ProfitLossSummary {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at: string;
  updated_at: string;
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
type PeriodType = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ProfitLossData {
  period: string;
  period_type: PeriodType;
  date_range: {
    start: string;
    end: string;
  };
  total_sales: number;
  total_expenses: number;
  total_fuel_cost: number;
  total_costs: number;
  profit: number;
  profit_margin: number;
  details?: {
    sales: SaleDetail[];
    expenses: ExpenseDetail[];
    fuel_supplies: FuelSupplyDetail[];
  };
}

interface SaleDetail {
  id: string;
  date: string;
  fuel_type: string;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  payment_status: string;
}

interface ExpenseDetail {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  payment_status: string;
}

interface FuelSupplyDetail {
  id: string;
  date: string;
  fuel_type: string;
  quantity: number;
  cost_per_unit: number;
  total_cost: number;
  payment_status: string;
}

interface ProfitLossRequest {
  period_type: PeriodType;
  start_date?: string;
  end_date?: string;
  notes?: string;
}

console.info('Profit-Loss Edge Function started');

// Handle profit-loss operations
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

  if (mainRoute !== 'profit-loss') {
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Example: /profit-loss/summary
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
      const params = getUrlParams(req);
      const periodType = params.get('period') as PeriodType || 'month';
      const startDate = params.get('start_date');
      const endDate = params.get('end_date');
      const includeDetails = params.get('include_details') === 'true';
      
      // For custom period, both start and end dates are required
      if (periodType === 'custom' && (!startDate || !endDate)) {
        return errorResponse({
          message: "Start date and end date are required for custom period"
        }, 400);
      }
      
      if (pathParts.length === 1) {
        return await calculateProfitLoss(periodType, startDate, endDate, includeDetails);
      } else if (pathParts[1] === 'summary') {
        return await getProfitLossSummary(periodType, startDate, endDate);
      } else if (pathParts.length === 2 && pathParts[1].match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = pathParts[1].split('/')[1];
        return await getProfitLossById(id);
      }
    } else if (req.method === 'POST' && (pathParts.length === 1 || pathParts[1] === '')) {
      // For generating and saving a new profit-loss record
      const data = await parseRequestBody<ProfitLossRequest>(req);
      
      return await generateAndSaveProfitLoss(data.period_type, data.start_date, data.end_date, data.notes);
    }
  } catch (error) {
    console.error('Profit-Loss function error:', error);
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Calculate date range based on period type
 */
function calculateDateRange(periodType: PeriodType, startDate?: string | null, endDate?: string | null): DateRange {
  const now = new Date();
  let start: Date;
  const end = new Date(now);
  
  // Set to end of current day
  end.setHours(23, 59, 59, 999);
  
  if (periodType === 'custom' && startDate && endDate) {
    return {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59.999Z').toISOString()
    };
  }
  
  switch (periodType) {
    case 'day':
      // Start of current day
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      // Start of current week (Sunday)
      start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);
      break;
    case 'month':
      // Start of current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'quarter': {
      // Start of current quarter
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
    }
    case 'year':
      // Start of current year
      start = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      // Default to current month
      start = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
}

/**
 * Format period string based on period type and date range
 */
function formatPeriodString(periodType: PeriodType, startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  switch (periodType) {
    case 'day':
      return start.toISOString().split('T')[0];
    case 'week':
      return `Week of ${start.toISOString().split('T')[0]}`;
    case 'month':
      return `${start.toLocaleString('default', { month: 'long' })} ${start.getFullYear()}`;
    case 'quarter': {
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;
    }
    case 'year':
      return `${start.getFullYear()}`;
    case 'custom':
      return `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`;
    default:
      return `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`;
  }
}

/**
 * Calculate profit and loss for a period
 */
async function calculateProfitLoss(
  periodType: PeriodType,
  startDate?: string | null,
  endDate?: string | null,
  includeDetails: boolean = false
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(periodType, startDate, endDate);
    
    // Fetch all data in parallel for better performance
    const [
      { data: salesData, error: salesError },
      { data: expensesData, error: expensesError },
      { data: fuelSupplyData, error: fuelSupplyError }
    ] = await Promise.all([
      supabase.rpc('get_sales_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      }),
      supabase.rpc('get_expenses_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      }),
      supabase.rpc('get_fuel_supply_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      })
    ]);
    
    // Check for any errors
    const errors = [salesError, expensesError, fuelSupplyError]
      .filter(error => error !== null);
    
    if (errors.length > 0) {
      throw new Error(`Failed to fetch profit-loss data: ${errors.map(e => e.message).join(', ')}`);
    }
    
    // Calculate profit/loss
    const totalSales = salesData?.total_amount || 0;
    const totalExpenses = expensesData?.total_amount || 0;
    const totalFuelCost = fuelSupplyData?.total_cost || 0;
    const totalCosts = totalExpenses + totalFuelCost;
    const profit = totalSales - totalCosts;
    
    // Format period string for display
    const periodString = formatPeriodString(periodType, start, end);
    
    // Prepare the response
    const result: ProfitLossData = {
      period: periodString,
      period_type: periodType,
      date_range: {
        start: start.split('T')[0],
        end: end.split('T')[0]
      },
      total_sales: totalSales,
      total_expenses: totalExpenses,
      total_fuel_cost: totalFuelCost,
      total_costs: totalCosts,
      profit: profit,
      profit_margin: totalSales > 0 ? (profit / totalSales) * 100 : 0
    };
    
    // If details are requested, include them
    if (includeDetails) {
      // Fetch all details in parallel
      const [
        { data: salesDetails, error: salesDetailsError },
        { data: expensesDetails, error: expensesDetailsError },
        { data: fuelSupplyDetails, error: fuelSupplyDetailsError }
      ] = await Promise.all([
        supabase
          .from("sales")
          .select(`
            id,
            date,
            fuel_type,
            quantity,
            price_per_unit,
            total_sales,
            payment_status
          `)
          .gte("date", start.split('T')[0])
          .lte("date", end.split('T')[0])
          .order("date", { ascending: false }),
        supabase
          .from("expenses")
          .select(`
            id,
            date,
            amount,
            category,
            description,
            payment_status
          `)
          .gte("date", start.split('T')[0])
          .lte("date", end.split('T')[0])
          .order("date", { ascending: false }),
        supabase
          .from("fuel_supplies")
          .select(`
            id,
            date,
            fuel_type,
            quantity,
            cost_per_unit,
            total_cost,
            payment_status
          `)
          .gte("date", start.split('T')[0])
          .lte("date", end.split('T')[0])
          .order("date", { ascending: false })
      ]);
      
      // Check for any errors
      const detailErrors = [salesDetailsError, expensesDetailsError, fuelSupplyDetailsError]
        .filter(error => error !== null);
      
      if (detailErrors.length > 0) {
        throw new Error(`Failed to fetch details: ${detailErrors.map(e => e.message).join(', ')}`);
      }
      
      result.details = {
        sales: salesDetails || [],
        expenses: expensesDetails || [],
        fuel_supplies: fuelSupplyDetails || []
      };
    }
    
    return successResponse(result);
  } catch (error) {
    console.error('Error calculating profit-loss:', error);
    return errorResponse(error);
  }
}

/**
 * Get profit-loss summary records
 */
async function getProfitLossSummary(
  periodType: PeriodType,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(periodType, startDate, endDate);
    
    // Query profit_loss_summary table for records in the given period
    let query = supabase
      .from("profit_loss_summary")
      .select("*")
      .order("created_at", { ascending: false });
      
    // If dates are provided, filter by them
    if (start && end) {
      query = query
        .gte("created_at", start)
        .lte("created_at", end);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return successResponse(data || []);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a specific profit-loss record by ID
 */
async function getProfitLossById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from("profit_loss_summary")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        return notFound('Profit-loss record');
      }
      throw error;
    }
    
    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate a profit-loss report and save it to the database
 */
async function generateAndSaveProfitLoss(
  periodType: PeriodType,
  startDate?: string | null,
  endDate?: string | null,
  notes?: string
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(periodType, startDate, endDate);
    
    // Get total sales for the period
    const { data: salesData, error: salesError } = await supabase
      .rpc('get_sales_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (salesError) throw salesError;
    
    // Get total expenses for the period
    const { data: expensesData, error: expensesError } = await supabase
      .rpc('get_expenses_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (expensesError) throw expensesError;
    
    // Calculate profit/loss
    const totalSales = salesData?.total_amount || 0;
    const totalExpenses = expensesData?.total_amount || 0;
    const profit = totalSales - totalExpenses;
    
    // Format period string for display
    const periodString = formatPeriodString(periodType, start, end);
    
    // Create the profit-loss record
    const profitLossRecord: Omit<ProfitLossSummary, 'id' | 'created_at'> = {
      period: periodString,
      total_sales: totalSales,
      total_expenses: totalExpenses,
      profit: profit,
      updated_at: new Date().toISOString()
    };
    
    // Save to the database
    const { data, error } = await supabase
      .from("profit_loss_summary")
      .insert(profitLossRecord)
      .select()
      .single();
      
    if (error) throw error;
    
    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
