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
import { ProfitLossSummary } from '../_shared/types.ts';

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
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/profit-loss', '');

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
      
      if (path === '' || path === '/') {
        return await calculateProfitLoss(periodType, startDate, endDate, includeDetails);
      } else if (path === '/summary') {
        return await getProfitLossSummary(periodType, startDate, endDate);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getProfitLossById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
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
    case 'quarter':
      // Start of current quarter
      const quarter = Math.floor(now.getMonth() / 3);
      start = new Date(now.getFullYear(), quarter * 3, 1);
      break;
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
    case 'quarter':
      const quarter = Math.floor(start.getMonth() / 3) + 1;
      return `Q${quarter} ${start.getFullYear()}`;
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