import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders, handleCors } from '../_shared/cors.ts'
import { Database } from '../_shared/database.types.ts'

interface Transaction {
  id: string
  amount: number
  description: string
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'mobile_payment'
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  employee_id: string
  created_at: string
  updated_at: string
}

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
  employee_id: string
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}

interface ProfitLoss {
  id: string
  period: string
  total_sales: number
  total_expenses: number
  profit: number
  created_at: string
  updated_at: string
}

serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;
  const origin = req.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the session
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()
    if (userError) throw userError

    // Robust path parsing
    const url = new URL(req.url)
    const pathParts = url.pathname.replace(/^\/functions\/v1\//, '').split('/')
    const mainRoute = pathParts[0]
    const subRoute = pathParts[1] || ''

    if (mainRoute !== 'finance') {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // /finance/transactions
    if (subRoute === 'transactions') {
      if (!user) throw new Error('Unauthorized')
      if (req.method === 'GET') {
        const { data, error } = await supabaseClient
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return new Response(JSON.stringify({ transactions: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      if (req.method === 'POST') {
        const transaction = await req.json()
        const { data, error } = await supabaseClient
          .from('transactions')
          .insert(transaction)
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify({ transaction: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        })
      }
      if (req.method === 'PUT') {
        const { id, ...updates } = await req.json()
        const { data, error } = await supabaseClient
          .from('transactions')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify({ transaction: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // /finance/expenses
    if (subRoute === 'expenses') {
      if (!user) throw new Error('Unauthorized')
      if (req.method === 'GET') {
        const { data, error } = await supabaseClient
          .from('expenses')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        return new Response(JSON.stringify({ expenses: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      if (req.method === 'POST') {
        const expense = await req.json()
        const { data, error } = await supabaseClient
          .from('expenses')
          .insert(expense)
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify({ expense: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        })
      }
      if (req.method === 'PUT') {
        const { id, ...updates } = await req.json()
        const { data, error } = await supabaseClient
          .from('expenses')
          .update(updates)
          .eq('id', id)
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify({ expense: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // /finance/profit-loss
    if (subRoute === 'profit-loss') {
      if (!user) throw new Error('Unauthorized')
      if (req.method === 'GET') {
        const { data, error } = await supabaseClient
          .from('profit_loss_summary')
          .select('*')
          .order('period', { ascending: false })
        if (error) throw error
        return new Response(JSON.stringify({ profitLoss: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
      if (req.method === 'POST') {
        const profitLoss = await req.json()
        const { data, error } = await supabaseClient
          .from('profit_loss_summary')
          .insert(profitLoss)
          .select()
          .single()
        if (error) throw error
        return new Response(JSON.stringify({ profitLoss: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        })
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Not found
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 