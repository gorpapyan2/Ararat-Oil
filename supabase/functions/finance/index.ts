import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
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
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (path) {
      case 'transactions': {
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

        throw new Error('Method not allowed')
      }

      case 'expenses': {
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

        throw new Error('Method not allowed')
      }

      case 'profit-loss': {
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

        if (req.method === 'PUT') {
          const { id, ...updates } = await req.json()
          const { data, error } = await supabaseClient
            .from('profit_loss_summary')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ profitLoss: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        throw new Error('Method not allowed')
      }

      default:
        throw new Error('Not found')
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
}) 