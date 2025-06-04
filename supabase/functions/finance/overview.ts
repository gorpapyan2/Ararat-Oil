import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Database } from '../_shared/database.types.ts'

interface FinanceOverview {
  total_sales: number
  total_expenses: number
  net_profit: number
  recent_transactions: RecentTransaction[]
  top_expenses: TopExpense[]
}

interface RecentTransaction {
  id: string
  amount: number
  description: string
  date: string
  type: 'income' | 'expense'
}

interface TopExpense {
  id: string
  amount: number
  category: string
  description: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Create a Supabase client with the auth header from the request
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', details: userError || 'No user found' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get sales data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString();

    // Fetch recent transactions
    const { data: transactions, error: transactionsError } = await supabaseClient
      .from('transactions')
      .select('*')
      .gte('created_at', thirtyDaysAgoStr)
      .order('created_at', { ascending: false })
      .limit(5);

    if (transactionsError) {
      throw transactionsError;
    }

    // Fetch recent expenses
    const { data: expenses, error: expensesError } = await supabaseClient
      .from('expenses')
      .select('*')
      .gte('created_at', thirtyDaysAgoStr)
      .order('amount', { ascending: false })
      .limit(5);

    if (expensesError) {
      throw expensesError;
    }

    // Calculate totals
    const total_sales = transactions
      ? transactions.reduce((sum, tx) => sum + (tx.type === 'income' ? tx.amount : 0), 0)
      : 0;

    const total_expenses = expenses
      ? expenses.reduce((sum, exp) => sum + exp.amount, 0)
      : 0;

    // Format recent transactions
    const recent_transactions: RecentTransaction[] = (transactions || []).map(tx => ({
      id: tx.id,
      amount: tx.amount,
      description: tx.description,
      date: tx.created_at,
      type: tx.type as 'income' | 'expense'
    }));

    // Format top expenses
    const top_expenses: TopExpense[] = (expenses || []).map(exp => ({
      id: exp.id,
      amount: exp.amount,
      category: exp.category,
      description: exp.description
    }));

    // Create the overview object
    const overview: FinanceOverview = {
      total_sales,
      total_expenses,
      net_profit: total_sales - total_expenses,
      recent_transactions,
      top_expenses
    };

    // Return the overview data
    return new Response(
      JSON.stringify(overview),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in finance/overview:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
})

// Helper function to handle CORS requests
function handleCors(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  return null;
}
