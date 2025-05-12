import { createClient } from 'npm:@supabase/supabase-js@2.39.3';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

// Types for better type safety
interface Sale {
  id: string;
  amount: number;
  fuel_type: string;
  created_at: string;
  // Add other sale fields as needed
}

interface Expense {
  id: string;
  amount: number;
  category: string;
  created_at: string;
  // Add other expense fields as needed
}

interface FuelSupply {
  id: string;
  amount: number;
  fuel_type: string;
  created_at: string;
  // Add other supply fields as needed
}

interface DashboardMetrics {
  salesCount: number;
  expensesCount: number;
  suppliesCount: number;
}

interface DashboardData {
  recentSales: Sale[];
  recentExpenses: Expense[];
  recentSupplies: FuelSupply[];
  metrics: DashboardMetrics;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

console.info('Dashboard Edge Function started');

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Fetch all data in parallel for better performance
    const [
      { data: recentSales, error: salesError },
      { data: recentExpenses, error: expensesError },
      { data: recentSupplies, error: suppliesError },
      { count: salesCount, error: salesCountError },
      { count: expensesCount, error: expensesCountError },
      { count: suppliesCount, error: suppliesCountError }
    ] = await Promise.all([
      supabaseClient
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseClient
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseClient
        .from('fuel_supplies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5),
      supabaseClient
        .from('sales')
        .select('*', { count: 'exact', head: true }),
      supabaseClient
        .from('expenses')
        .select('*', { count: 'exact', head: true }),
      supabaseClient
        .from('fuel_supplies')
        .select('*', { count: 'exact', head: true })
    ]);

    // Check for any errors
    const errors = [salesError, expensesError, suppliesError, salesCountError, expensesCountError, suppliesCountError]
      .filter(error => error !== null);
    
    if (errors.length > 0) {
      throw new Error(`Failed to fetch dashboard data: ${errors.map(e => e.message).join(', ')}`);
    }

    const dashboardData: DashboardData = {
      recentSales: recentSales || [],
      recentExpenses: recentExpenses || [],
      recentSupplies: recentSupplies || [],
      metrics: {
        salesCount: salesCount || 0,
        expensesCount: expensesCount || 0,
        suppliesCount: suppliesCount || 0,
      }
    };

    return new Response(
      JSON.stringify({ data: dashboardData }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Dashboard function error:', error);
    
    // Determine appropriate status code
    const status = error.message.includes('Failed to fetch') ? 500 : 400;
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
}); 