import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inlined CORS headers from _shared/cors.ts
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// Inlined interface definitions
interface LoginRequest {
  email: string
  password: string
}

interface PasswordResetRequest {
  email: string
}

interface SessionDevice {
  id: string
  user_id: string
  created_at: string
  last_active: string
  user_agent: string
  ip_address: string
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
      case 'login': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed')
        }

        const { email, password } = await req.json() as LoginRequest

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Log the login attempt
        await supabaseClient
          .from('auth_logs')
          .insert({
            user_id: data.user.id,
            action: 'login',
            ip_address: req.headers.get('x-forwarded-for') || 'unknown',
            user_agent: req.headers.get('user-agent') || 'unknown',
          })

        return new Response(
          JSON.stringify({ user: data.user, session: data.session }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'logout': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed')
        }

        const { error } = await supabaseClient.auth.signOut()

        if (error) throw error

        // Log the logout
        if (user) {
          await supabaseClient
            .from('auth_logs')
            .insert({
              user_id: user.id,
              action: 'logout',
              ip_address: req.headers.get('x-forwarded-for') || 'unknown',
              user_agent: req.headers.get('user-agent') || 'unknown',
            })
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      case 'sessions': {
        if (!user) {
          throw new Error('Unauthorized')
        }

        if (req.method === 'GET') {
          // Get all active sessions for the user
          const { data: sessions, error } = await supabaseClient
            .from('sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('last_active', { ascending: false })

          if (error) throw error

          return new Response(JSON.stringify({ sessions }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        if (req.method === 'DELETE') {
          const { sessionId } = await req.json()

          // Delete specific session
          const { error } = await supabaseClient
            .from('sessions')
            .delete()
            .eq('id', sessionId)
            .eq('user_id', user.id)

          if (error) throw error

          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }

        throw new Error('Method not allowed')
      }

      case 'password-reset': {
        if (req.method !== 'POST') {
          throw new Error('Method not allowed')
        }

        const { email } = await req.json() as PasswordResetRequest

        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${url.origin}/reset-password`,
        })

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      case 'update-password': {
        if (!user) {
          throw new Error('Unauthorized')
        }

        if (req.method !== 'POST') {
          throw new Error('Method not allowed')
        }

        const { password } = await req.json()

        const { error } = await supabaseClient.auth.updateUser({
          password,
        })

        if (error) throw error

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
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
