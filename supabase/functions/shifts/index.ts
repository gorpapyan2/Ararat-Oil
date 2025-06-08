// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2.39.3'

console.log("Shifts function loaded!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

interface ShiftData {
  opening_cash: number;
  employee_ids?: string[];
  sales_total?: number;
  closing_cash?: number;
  payment_methods?: Array<{
    payment_method: string;
    amount: number;
    reference?: string;
  }>;
}

interface ShiftEmployee {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_position: string;
  employee_status: string;
  created_at: string;
}

interface ShiftWithEmployees {
  id: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  opening_cash: number;
  closing_cash?: number;
  sales_total: number;
  status: string;
  employee_id?: string;
  employees?: ShiftEmployee[];
  created_at: string;
  updated_at: string;
}

// Database operations
async function getShifts(supabase: any): Promise<ShiftWithEmployees[]> {
  try {
    // First try to get shifts with employees using the new table structure
    let shifts, shiftsError;
    
    try {
      // Try new structure with shift_employees table
      const response = await supabase
        .from('shifts')
        .select(`
          *,
          shift_employees!left(
            id,
            employee_id,
            created_at,
            employees(
              id,
              name,
              position,
              status
            )
          )
        `)
        .order('start_time', { ascending: false })
        .limit(50);
      
      shifts = response.data;
      shiftsError = response.error;
  } catch (error) {
      console.log('shift_employees table not available, falling back to basic query');
      // Fallback to basic shifts query
      const response = await supabase
        .from('shifts')
        .select('*')
        .order('start_time', { ascending: false })
        .limit(50);
      
      shifts = response.data;
      shiftsError = response.error;
    }

    if (shiftsError) {
      console.error('Database error:', shiftsError);
      throw shiftsError;
    }

    // Transform the data to match our expected format
    const transformedShifts = shifts?.map((shift: any) => {
      let employees: ShiftEmployee[] = [];
      
      // If we have shift_employees data, use it
      if (shift.shift_employees && Array.isArray(shift.shift_employees)) {
        employees = shift.shift_employees
          .filter((se: any) => se.employees) // Only include entries with valid employee data
          .map((se: any) => ({
            id: se.id,
            employee_id: se.employee_id,
            employee_name: se.employees?.name || 'Unknown',
            employee_position: se.employees?.position || 'Unknown',
            employee_status: se.employees?.status || 'active',
            created_at: se.created_at
          }));
      }
      
      // Fallback: if no employees from new structure but has employee_id, create a basic employee entry
      if (employees.length === 0 && shift.employee_id) {
        employees = [{
          id: `${shift.id}-${shift.employee_id}`,
          employee_id: shift.employee_id,
          employee_name: `Employee ${shift.employee_id.slice(-4)}`,
          employee_position: 'Unknown',
          employee_status: 'active',
          created_at: shift.created_at
        }];
      }

      return {
      ...shift,
        is_active: shift.status === 'OPEN',
        employees,
        employee_name: employees.length > 0 ? employees.map(e => e.employee_name).join(', ') : 'No employees'
      };
    }) || [];

    console.log('Successfully fetched shifts:', transformedShifts.length);
    console.log('Sample shift data:', transformedShifts[0]);
    return transformedShifts;
  } catch (error) {
    console.error('Error in getShifts:', error);
    throw error;
  }
}

async function startShift(shiftData: ShiftData, supabase: any) {
  console.log('Starting shift with data:', shiftData);
  
  const { opening_cash, employee_ids } = shiftData;
  
  // Validate input
  if (!opening_cash || opening_cash < 0) {
    throw new Error('Opening cash amount is required and must be positive');
  }

  // Validate that at least one employee is provided
  if (!employee_ids || employee_ids.length === 0) {
    throw new Error('At least one employee must be assigned to the shift');
  }

  // Validate that employee IDs are valid UUIDs
  for (const employeeId of employee_ids) {
    if (!employeeId || typeof employeeId !== 'string') {
      throw new Error('Invalid employee ID provided');
    }
  }

  // Create new shift first
  const { data: shift, error: shiftError } = await supabase
    .from('shifts')
    .insert({
      opening_cash,
      sales_total: 0,
      status: 'OPEN',
      employee_id: employee_ids[0] // Set first employee as primary - this is now guaranteed to exist
    })
    .select()
      .single();

  if (shiftError) {
    console.error('Error creating shift:', shiftError);
    throw shiftError;
  }

  // Try to add employees to shift_employees table if it exists
  let employees: ShiftEmployee[] = [];
  try {
    // Check if any of the employees already have an open shift
    for (const employeeId of employee_ids) {
      // Try using the function if it exists, otherwise use a direct query
      let hasOpenShift = false;
      try {
        const { data: openShifts } = await supabase
          .rpc('employee_has_open_shift', { employee_id_param: employeeId });
        hasOpenShift = openShifts;
  } catch (error) {
        // Fallback to direct query
        const { data: openShifts } = await supabase
          .from('shifts')
          .select('id')
          .eq('employee_id', employeeId)
          .eq('status', 'OPEN');
        hasOpenShift = openShifts && openShifts.length > 0;
      }

      if (hasOpenShift) {
        // Get employee name for better error message
        const { data: employee } = await supabase
          .from('employees')
          .select('name')
          .eq('id', employeeId)
          .single();
        
        // Clean up the shift we just created
        await supabase.from('shifts').delete().eq('id', shift.id);
        throw new Error(`Employee ${employee?.name || employeeId} already has an open shift`);
      }
    }

    // Add employees to shift_employees table
    const shiftEmployeesData = employee_ids.map(employeeId => ({
      shift_id: shift.id,
      employee_id: employeeId
    }));

    const { error: employeesError } = await supabase
      .from('shift_employees')
      .insert(shiftEmployeesData);

    if (employeesError) {
      console.error('Error adding employees to shift (table might not exist):', employeesError);
      // Don't throw error, just continue without shift_employees table
    }

    // Try to fetch the complete shift data with employees
    try {
      const { data: completeShift } = await supabase
        .rpc('get_shift_employees', { shift_id_param: shift.id });

      employees = completeShift?.map((emp: any) => ({
        id: `${shift.id}-${emp.employee_id}`,
        employee_id: emp.employee_id,
        employee_name: emp.employee_name,
        employee_position: emp.employee_position,
        employee_status: emp.employee_status,
        created_at: new Date().toISOString()
      })) || [];
    } catch (error) {
      console.log('get_shift_employees function not available, using fallback');
      // Fallback: create basic employee entries
      for (const employeeId of employee_ids) {
        const { data: employee } = await supabase
          .from('employees')
          .select('name, position, status')
          .eq('id', employeeId)
      .single();

        if (employee) {
          employees.push({
            id: `${shift.id}-${employeeId}`,
            employee_id: employeeId,
            employee_name: employee.name || 'Unknown',
            employee_position: employee.position || 'Unknown',
            employee_status: employee.status || 'active',
            created_at: new Date().toISOString()
          });
        }
      }
    }
  } catch (error) {
    console.error('Error handling employees:', error);
    // Continue without failing the entire operation
  }

  return { 
    message: 'Shift started successfully', 
    shift: {
      ...shift,
      is_active: true,
      employees
    }
  };
}

async function closeShift(shiftId: string, shiftData: ShiftData, supabase: any) {
  console.log('Closing shift with ID:', shiftId, 'and data:', shiftData);
  
  // Validate closing cash
  if (shiftData.closing_cash === undefined || shiftData.closing_cash < 0) {
    throw new Error('Closing cash amount is required and must be non-negative');
  }
  
  // Get current sales total for this shift
  let salesTotal = 0;
  try {
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('total_sales')
      .eq('shift_id', shiftId);
    
    if (!salesError && sales) {
      salesTotal = sales.reduce((total: number, sale: any) => total + (sale.total_sales || 0), 0);
    }
  } catch (error) {
    console.log('Could not fetch sales data, using provided sales_total or 0');
    salesTotal = shiftData.sales_total || 0;
  }

  // Update the shift
  const { data: shift, error: shiftError } = await supabase
    .from('shifts')
      .update({
        end_time: new Date().toISOString(),
      closing_cash: shiftData.closing_cash,
      sales_total: salesTotal,
      status: 'CLOSED'
      })
    .eq('id', shiftId)
    .eq('status', 'OPEN')
      .select()
      .single();

  if (shiftError) {
    console.error('Error closing shift:', shiftError);
    throw shiftError;
  }

  if (!shift) {
    throw new Error('Shift not found or already closed');
  }

  // Add payment methods if provided
  if (shiftData.payment_methods && shiftData.payment_methods.length > 0) {
    const paymentMethodsData = shiftData.payment_methods.map(pm => ({
      shift_id: shiftId,
      payment_method: pm.payment_method,
      amount: pm.amount,
      reference: pm.reference
    }));

    const { error: pmError } = await supabase
      .from('shift_payment_methods')
      .insert(paymentMethodsData);

    if (pmError) {
      console.error('Error inserting payment methods:', pmError);
    }
  }

  return { message: 'Shift closed successfully', shift };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const url = new URL(req.url);
    const pathname = url.pathname;
    
    // Remove the base function path to get the route
    const route = pathname.replace('/functions/v1/shifts', '').replace(/^\/+|\/+$/g, '');
    
    console.log('Request method:', req.method);
    console.log('Full pathname:', pathname);
    console.log('Extracted route:', route);

    let data;
    
    if (req.method === 'GET' && (route === '' || route === '/' || route === 'shifts')) {
      // GET /shifts - get all shifts
      console.log('Handling GET /shifts');
      data = await getShifts(supabase);
    } else if (req.method === 'POST' && (route === '' || route === '/' || route === 'shifts')) {
      // POST /shifts - start new shift
      console.log('Handling POST /shifts');
      const body = await req.json();
      data = await startShift(body, supabase);
    } else if (req.method === 'POST' && route.includes('/close')) {
      // POST /shifts/:id/close - close shift
      const pathParts = route.split('/');
      const shiftId = pathParts[0];
      console.log('Handling POST /shifts/:id/close with ID:', shiftId);
      console.log('Route parts:', pathParts);
      
      // Additional validation to ensure we have a valid UUID
      if (!shiftId || shiftId === 'shifts' || !shiftId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        throw new Error(`Invalid shift ID: ${shiftId}`);
      }
      
      const body = await req.json();
      data = await closeShift(shiftId, body, supabase);
    } else {
      console.log('No matching route found');
      return new Response(JSON.stringify({ error: 'Not found', route, method: req.method }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}) 