import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inlined CORS headers from _shared/cors.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Inlined interface definitions
interface FuelTank {
  id: string
  name: string
  fuel_type_id: string
  fuel_type?: {
    id: string
    name: string
  }
  capacity: number
  current_level: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface TankLevelChange {
  id: string
  tank_id: string
  previous_level: number
  new_level: number
  change_amount: number
  change_type: 'add' | 'subtract'
  reason?: string
  created_at: string
  created_by: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
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
      case 'tanks': {
        if (!user) throw new Error('Unauthorized')

        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('fuel_tanks')
            .select('*, fuel_type:fuel_types(id, name)')
            .order('name')

          if (error) throw error

          return new Response(JSON.stringify({ tanks: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'POST') {
          const tank = await req.json()
          const { data, error } = await supabaseClient
            .from('fuel_tanks')
            .insert(tank)
            .select('*, fuel_type:fuel_types(id, name)')
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ tank: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          })
        }

        throw new Error('Method not allowed')
      }

      case 'tank': {
        if (!user) throw new Error('Unauthorized')

        const tankId = url.searchParams.get('id')
        if (!tankId) throw new Error('Tank ID is required')

        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('fuel_tanks')
            .select('*, fuel_type:fuel_types(id, name)')
            .eq('id', tankId)
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ tank: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'PUT') {
          const updates = await req.json()
          const { data, error } = await supabaseClient
            .from('fuel_tanks')
            .update(updates)
            .eq('id', tankId)
            .select('*, fuel_type:fuel_types(id, name)')
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ tank: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'DELETE') {
          const { error } = await supabaseClient
            .from('fuel_tanks')
            .delete()
            .eq('id', tankId)

          if (error) throw error

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        throw new Error('Method not allowed')
      }

      case 'level-changes': {
        if (!user) throw new Error('Unauthorized')

        const tankId = url.searchParams.get('tankId')
        if (!tankId) throw new Error('Tank ID is required')

        if (req.method === 'GET') {
          const { data, error } = await supabaseClient
            .from('tank_level_changes')
            .select('*')
            .eq('tank_id', tankId)
            .order('created_at', { ascending: false })

          if (error) throw error

          return new Response(JSON.stringify({ levelChanges: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'POST') {
          const { change_amount, change_type, reason } = await req.json()

          // Get current tank level
          const { data: tank, error: tankError } = await supabaseClient
            .from('fuel_tanks')
            .select('current_level')
            .eq('id', tankId)
            .single()

          if (tankError) throw tankError

          const previous_level = tank.current_level
          const new_level = change_type === 'add'
            ? previous_level + change_amount
            : previous_level - change_amount

          // Update tank level
          const { error: updateError } = await supabaseClient
            .from('fuel_tanks')
            .update({ current_level: new_level })
            .eq('id', tankId)

          if (updateError) throw updateError

          // Record level change
          const { data: levelChange, error: changeError } = await supabaseClient
            .from('tank_level_changes')
            .insert({
              tank_id: tankId,
              previous_level,
              new_level,
              change_amount,
              change_type,
              reason,
              created_by: user.id,
            })
            .select()
            .single()

          if (changeError) throw changeError

          return new Response(JSON.stringify({ levelChange }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          })
        }

        throw new Error('Method not allowed')
      }

      case 'summary': {
        if (!user) throw new Error('Unauthorized')

        if (req.method === 'GET') {
          const { data: tanks, error } = await supabaseClient
            .from('fuel_tanks')
            .select('*')

          if (error) throw error

          const totalTanks = tanks.length
          const activeTanks = tanks.filter(t => t.is_active).length
          const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0)
          const totalCurrentLevel = tanks.reduce((sum, t) => sum + t.current_level, 0)
          const lowLevelTanks = tanks.filter(t => t.current_level < t.capacity * 0.2).length
          const criticalLevelTanks = tanks.filter(t => t.current_level < t.capacity * 0.1).length

          return new Response(
            JSON.stringify({
              summary: {
                totalTanks,
                activeTanks,
                totalCapacity,
                totalCurrentLevel,
                lowLevelTanks,
                criticalLevelTanks,
              },
            }),
            {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            }
          )
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
