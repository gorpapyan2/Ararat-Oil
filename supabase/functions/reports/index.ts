import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import { 
  handleCors, 
  successResponse, 
  errorResponse, 
  methodNotAllowed,
  unauthorized,
  parseRequestBody,
  getUrlParams
} from '../_shared/api.ts';

// Define report types
type ReportType = 'sales' | 'expenses' | 'inventory' | 'fuel_supply' | 'fuel_consumption';
type TimeFrame = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

// Handle reports operations
Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Get URL path
  const url = new URL(req.url);
  const path = url.pathname.replace('/reports', '');

  // Authentication check
  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized();
  }

  try {
    // Route handling
    if (req.method === 'GET') {
      const params = getUrlParams(req);
      const reportType = params.get('type') as ReportType;
      const timeFrame = params.get('timeframe') as TimeFrame;
      const startDate = params.get('start_date');
      const endDate = params.get('end_date');
      
      if (!reportType) {
        return errorResponse({
          message: "Report type is required"
        }, 400);
      }
      
      if (!timeFrame) {
        return errorResponse({
          message: "Time frame is required"
        }, 400);
      }
      
      // For custom timeframe, both start and end dates are required
      if (timeFrame === 'custom' && (!startDate || !endDate)) {
        return errorResponse({
          message: "Start date and end date are required for custom time frame"
        }, 400);
      }
      
      switch (reportType) {
        case 'sales':
          return await generateSalesReport(timeFrame, startDate, endDate);
        case 'expenses':
          return await generateExpensesReport(timeFrame, startDate, endDate);
        case 'inventory':
          return await generateInventoryReport();
        case 'fuel_supply':
          return await generateFuelSupplyReport(timeFrame, startDate, endDate);
        case 'fuel_consumption':
          return await generateFuelConsumptionReport(timeFrame, startDate, endDate);
        default:
          return errorResponse({
            message: `Unsupported report type: ${reportType}`
          }, 400);
      }
    } else if (req.method === 'POST' && path === '/custom') {
      // For custom reports with more complex criteria
      const data = await parseRequestBody<{
        type: ReportType;
        timeframe: TimeFrame;
        start_date?: string;
        end_date?: string;
        filters?: Record<string, any>;
        groupBy?: string[];
      }>(req);
      
      return await generateCustomReport(data);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * Calculate date range based on timeframe
 */
function calculateDateRange(timeframe: TimeFrame, startDate?: string | null, endDate?: string | null): { startDate: string; endDate: string } {
  const now = new Date();
  let start: Date;
  let end = new Date(now);
  
  // Set to end of current day
  end.setHours(23, 59, 59, 999);
  
  if (timeframe === 'custom' && startDate && endDate) {
    return {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate + 'T23:59:59.999Z').toISOString()
    };
  }
  
  switch (timeframe) {
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
      // Default to last 30 days
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
  }
  
  return {
    startDate: start.toISOString(),
    endDate: end.toISOString()
  };
}

/**
 * Generate a sales report
 */
async function generateSalesReport(
  timeframe: TimeFrame,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(timeframe, startDate, endDate);
    
    // Get sales data
    const { data: sales, error: salesError } = await supabase
      .from("sales")
      .select(`
        id,
        date,
        fuel_type,
        quantity,
        price_per_unit,
        total_sales,
        payment_status,
        filling_system_name,
        filling_system:filling_systems(id, name, tank_id, tank:fuel_tanks(id, name))
      `)
      .gte("date", start.split('T')[0])
      .lte("date", end.split('T')[0])
      .order("date", { ascending: false });
      
    if (salesError) throw salesError;
    
    // Get total sales amount for the period
    const { data: totals, error: totalsError } = await supabase
      .rpc('get_sales_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (totalsError) throw totalsError;
    
    // Get sales by fuel type
    const { data: salesByFuelType, error: fuelTypeError } = await supabase
      .rpc('get_sales_by_fuel_type', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (fuelTypeError) throw fuelTypeError;
    
    // Get sales by filling system
    const { data: salesByFillingSystem, error: fillingSystemError } = await supabase
      .rpc('get_sales_by_filling_system', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (fillingSystemError) throw fillingSystemError;
    
    // Get daily sales data for charts
    const { data: dailySales, error: dailyError } = await supabase
      .rpc('get_daily_sales', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (dailyError) throw dailyError;
    
    return successResponse({
      timeframe,
      period: {
        start: start.split('T')[0],
        end: end.split('T')[0]
      },
      total_sales: totals?.total_amount || 0,
      total_quantity: totals?.total_quantity || 0,
      sales_by_fuel_type: salesByFuelType || [],
      sales_by_filling_system: salesByFillingSystem || [],
      daily_sales: dailySales || [],
      sales_details: sales || []
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate an expenses report
 */
async function generateExpensesReport(
  timeframe: TimeFrame,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(timeframe, startDate, endDate);
    
    // Get expenses data
    const { data: expenses, error: expensesError } = await supabase
      .from("expenses")
      .select("*")
      .gte("date", start.split('T')[0])
      .lte("date", end.split('T')[0])
      .order("date", { ascending: false });
      
    if (expensesError) throw expensesError;
    
    // Get total expenses amount for the period
    const { data: totals, error: totalsError } = await supabase
      .rpc('get_expenses_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (totalsError) throw totalsError;
    
    // Get expenses by category
    const { data: expensesByCategory, error: categoryError } = await supabase
      .rpc('get_expenses_by_category', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (categoryError) throw categoryError;
    
    // Get daily expenses data for charts
    const { data: dailyExpenses, error: dailyError } = await supabase
      .rpc('get_daily_expenses', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (dailyError) throw dailyError;
    
    return successResponse({
      timeframe,
      period: {
        start: start.split('T')[0],
        end: end.split('T')[0]
      },
      total_expenses: totals?.total_amount || 0,
      expenses_by_category: expensesByCategory || [],
      daily_expenses: dailyExpenses || [],
      expenses_details: expenses || []
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate an inventory report for tanks and fuel levels
 */
async function generateInventoryReport(): Promise<Response> {
  try {
    const supabase = createServiceClient();
    
    // Get tanks data with current levels
    const { data: tanks, error: tanksError } = await supabase
      .from("fuel_tanks")
      .select(`
        *,
        fuel_type:fuel_types!fuel_type_id(id, name, code),
        filling_systems:filling_systems(id, name)
      `)
      .order("name", { ascending: true });
      
    if (tanksError) throw tanksError;
    
    // Calculate summary data
    let totalCapacity = 0;
    let totalCurrentLevel = 0;
    const fuelTypeSummary: Record<string, {capacity: number; current_level: number; percentage: number}> = {};
    
    tanks?.forEach(tank => {
      totalCapacity += tank.capacity;
      totalCurrentLevel += tank.current_level;
      
      const fuelTypeName = tank.fuel_type?.name || 'Unknown';
      if (!fuelTypeSummary[fuelTypeName]) {
        fuelTypeSummary[fuelTypeName] = {
          capacity: 0,
          current_level: 0,
          percentage: 0
        };
      }
      
      fuelTypeSummary[fuelTypeName].capacity += tank.capacity;
      fuelTypeSummary[fuelTypeName].current_level += tank.current_level;
    });
    
    // Calculate percentages
    Object.keys(fuelTypeSummary).forEach(key => {
      fuelTypeSummary[key].percentage = fuelTypeSummary[key].capacity > 0 
        ? (fuelTypeSummary[key].current_level / fuelTypeSummary[key].capacity) * 100 
        : 0;
    });
    
    // Get recent tank level changes
    const { data: recentChanges, error: changesError } = await supabase
      .from("tank_level_changes")
      .select(`
        *,
        tank:fuel_tanks(id, name, fuel_type:fuel_types!fuel_type_id(name))
      `)
      .order("created_at", { ascending: false })
      .limit(20);
      
    if (changesError) throw changesError;
    
    return successResponse({
      total_capacity: totalCapacity,
      total_current_level: totalCurrentLevel,
      total_percentage: totalCapacity > 0 ? (totalCurrentLevel / totalCapacity) * 100 : 0,
      by_fuel_type: fuelTypeSummary,
      tanks: tanks?.map(tank => ({
        ...tank,
        percentage: tank.capacity > 0 ? (tank.current_level / tank.capacity) * 100 : 0
      })) || [],
      recent_changes: recentChanges || []
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate a fuel supply report
 */
async function generateFuelSupplyReport(
  timeframe: TimeFrame,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(timeframe, startDate, endDate);
    
    // Get fuel supplies data
    const { data: supplies, error: suppliesError } = await supabase
      .from("fuel_supplies")
      .select(`
        *,
        provider:petrol_providers(id, name),
        tank:fuel_tanks(id, name, fuel_type:fuel_types!fuel_type_id(id, name, code)),
        employee:employees(id, name)
      `)
      .gte("delivery_date", start.split('T')[0])
      .lte("delivery_date", end.split('T')[0])
      .order("delivery_date", { ascending: false });
      
    if (suppliesError) throw suppliesError;
    
    // Get total supplies data for the period
    const { data: totals, error: totalsError } = await supabase
      .rpc('get_fuel_supply_totals', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (totalsError) throw totalsError;
    
    // Get supplies by provider
    const { data: byProvider, error: providerError } = await supabase
      .rpc('get_fuel_supply_by_provider', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (providerError) throw providerError;
    
    // Get supplies by tank/fuel type
    const { data: byTank, error: tankError } = await supabase
      .rpc('get_fuel_supply_by_tank', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (tankError) throw tankError;
    
    return successResponse({
      timeframe,
      period: {
        start: start.split('T')[0],
        end: end.split('T')[0]
      },
      total_supplies: {
        quantity: totals?.total_quantity || 0,
        cost: totals?.total_cost || 0,
        average_price: totals?.average_price || 0
      },
      by_provider: byProvider || [],
      by_tank: byTank || [],
      supplies_details: supplies || []
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate a fuel consumption report
 */
async function generateFuelConsumptionReport(
  timeframe: TimeFrame,
  startDate?: string | null,
  endDate?: string | null
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { startDate: start, endDate: end } = calculateDateRange(timeframe, startDate, endDate);
    
    // Get sales data for fuel consumption
    const { data: sales, error: salesError } = await supabase
      .from("sales")
      .select(`
        id,
        date,
        fuel_type,
        quantity,
        filling_system_id,
        filling_system:filling_systems(id, name, tank_id, tank:fuel_tanks(id, name))
      `)
      .gte("date", start.split('T')[0])
      .lte("date", end.split('T')[0]);
      
    if (salesError) throw salesError;
    
    // Get consumption by fuel type
    const { data: byFuelType, error: fuelTypeError } = await supabase
      .rpc('get_consumption_by_fuel_type', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (fuelTypeError) throw fuelTypeError;
    
    // Get consumption by tank
    const { data: byTank, error: tankError } = await supabase
      .rpc('get_consumption_by_tank', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (tankError) throw tankError;
    
    // Get consumption by filling system
    const { data: byFillingSystem, error: fillingSystemError } = await supabase
      .rpc('get_consumption_by_filling_system', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (fillingSystemError) throw fillingSystemError;
    
    // Get daily consumption for charts
    const { data: dailyConsumption, error: dailyError } = await supabase
      .rpc('get_daily_consumption', {
        start_date: start.split('T')[0],
        end_date: end.split('T')[0]
      });
      
    if (dailyError) throw dailyError;
    
    // Calculate total consumption
    let totalConsumption = 0;
    (byFuelType || []).forEach((item: any) => {
      totalConsumption += item.quantity || 0;
    });
    
    return successResponse({
      timeframe,
      period: {
        start: start.split('T')[0],
        end: end.split('T')[0]
      },
      total_consumption: totalConsumption,
      by_fuel_type: byFuelType || [],
      by_tank: byTank || [],
      by_filling_system: byFillingSystem || [],
      daily_consumption: dailyConsumption || []
    });
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Generate a custom report with complex criteria
 */
async function generateCustomReport(params: {
  type: ReportType;
  timeframe: TimeFrame;
  start_date?: string;
  end_date?: string;
  filters?: Record<string, any>;
  groupBy?: string[];
}): Promise<Response> {
  try {
    const { type, timeframe, start_date, end_date, filters, groupBy } = params;
    
    // Calculate date range
    const { startDate, endDate } = calculateDateRange(timeframe, start_date, end_date);
    
    // Based on the type, call the appropriate report function
    switch (type) {
      case 'sales':
        return await generateSalesReport(timeframe, startDate, endDate);
      case 'expenses':
        return await generateExpensesReport(timeframe, startDate, endDate);
      case 'inventory':
        return await generateInventoryReport();
      case 'fuel_supply':
        return await generateFuelSupplyReport(timeframe, startDate, endDate);
      case 'fuel_consumption':
        return await generateFuelConsumptionReport(timeframe, startDate, endDate);
      default:
        return errorResponse({
          message: `Unsupported report type: ${type}`
        }, 400);
    }
  } catch (error) {
    return errorResponse(error);
  }
} 