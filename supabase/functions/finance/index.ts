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

      case 'overview': {
        if (!user) throw new Error('Unauthorized')

        if (req.method === 'GET') {
          // Get total sales from the last 30 days
          const thirtyDaysAgo = new Date()
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          
          const [salesResult, expensesResult] = await Promise.all([
            // Get sales data
            supabaseClient
              .from('sales')
              .select('total_price, created_at, fuel_type_id, quantity, price_per_liter')
              .gte('created_at', thirtyDaysAgo.toISOString())
              .order('created_at', { ascending: false }),
            
            // Get expenses data
            supabaseClient
              .from('expenses')
              .select('amount, created_at, category, description')
              .gte('created_at', thirtyDaysAgo.toISOString())
              .order('created_at', { ascending: false })
          ])

          if (salesResult.error) throw salesResult.error
          if (expensesResult.error) throw expensesResult.error

          const sales = salesResult.data || []
          const expenses = expensesResult.data || []

          // Calculate totals
          const total_sales = sales.reduce((sum, sale) => sum + (sale.total_price || 0), 0)
          const total_expenses = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0)
          const net_profit = total_sales - total_expenses

          // Get recent transactions (top 5)
          const recent_transactions = [
            ...sales.slice(0, 3).map(sale => ({
              id: `sale_${sale.created_at}`,
              type: 'income' as const,
              amount: sale.total_price || 0,
              description: `Fuel sale - ${sale.quantity || 0}L`,
              date: sale.created_at
            })),
            ...expenses.slice(0, 2).map(expense => ({
              id: `expense_${expense.created_at}`,
              type: 'expense' as const,
              amount: expense.amount || 0,
              description: expense.description || expense.category || 'Expense',
              date: expense.created_at
            }))
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)

          // Get top expense categories
          const expenseCategories: Record<string, number> = {}
          expenses.forEach(expense => {
            const category = expense.category || 'Other'
            expenseCategories[category] = (expenseCategories[category] || 0) + (expense.amount || 0)
          })

          const top_expenses = Object.entries(expenseCategories)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)

          const overview = {
            total_sales,
            total_expenses,
            net_profit,
            recent_transactions,
            top_expenses
          }

          return new Response(JSON.stringify({ data: overview }), {
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