import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Database } from '../_shared/database.types.ts'

interface PetrolProvider {
  id: string
  name: string
  contact_person: string
  phone: string
  email: string
  address: string
  tax_id: string
  bank_account: string
  notes: string
  created_at: string
  updated_at: string
}

interface PetrolProviderFilters {
  searchQuery?: string
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
      case 'providers': {
        if (!user) throw new Error('Unauthorized')

        if (req.method === 'GET') {
          const filters: PetrolProviderFilters = {}
          const searchParams = new URLSearchParams(url.search)
          const searchQuery = searchParams.get('searchQuery')
          if (searchQuery) filters.searchQuery = searchQuery

          let query = supabaseClient
            .from('petrol_providers')
            .select('*')
            .order('name')

          if (filters.searchQuery) {
            query = query.or(
              `name.ilike.%${filters.searchQuery}%,contact_person.ilike.%${filters.searchQuery}%`
            )
          }

          const { data, error } = await query

          if (error) throw error

          return new Response(JSON.stringify({ providers: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'POST') {
          const provider = await req.json()
          const { data, error } = await supabaseClient
            .from('petrol_providers')
            .insert(provider)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ provider: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          })
        }

        if (req.method === 'PUT') {
          const { id, ...updates } = await req.json()
          const { data, error } = await supabaseClient
            .from('petrol_providers')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

          if (error) throw error

          return new Response(JSON.stringify({ provider: data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'DELETE') {
          const { id } = await req.json()
          const { error } = await supabaseClient
            .from('petrol_providers')
            .delete()
            .eq('id', id)

          if (error) throw error

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        throw new Error('Method not allowed')
      }

      case 'summary': {
        if (!user) throw new Error('Unauthorized')

        if (req.method === 'GET') {
          const { data: providers, error } = await supabaseClient
            .from('petrol_providers')
            .select('*')

          if (error) throw error

          const totalProviders = providers.length
          const activeProviders = providers.filter(p => p.notes?.includes('active')).length
          const recentProviders = providers.filter(
            p => new Date(p.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          ).length

          return new Response(
            JSON.stringify({
              summary: {
                totalProviders,
                activeProviders,
                recentProviders,
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