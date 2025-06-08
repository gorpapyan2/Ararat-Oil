import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Inline CORS headers (same as auth function)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-auth',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

// --- INTERFACES ---
interface FuelTank {
  id: string
  name: string
  fuel_type_id: string
  fuel_type?: { id: string; name: string }
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
  created_by?: string
}

// --- MAIN HANDLER ---
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // --- Simple Path Parsing for health check ---
    const url = new URL(req.url);
    const pathParts = url.pathname.replace(/^\/functions\/v1\//, '').split('/').filter(Boolean);
    const mainRoute = pathParts[0];
    const secondPart = pathParts[1] || '';

    // /tanks/health - Simple health check (no auth required)
    if (mainRoute === 'tanks' && secondPart === 'health') {
      if (req.method === 'GET') {
        return new Response(
          JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }
    }

    // For all other routes, initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the session (handle both authenticated users and anon key)
    let user = null;
    let isAnonKeyRequest = false;
    
    try {
      const {
        data: { user: authUser },
        error: userError,
      } = await supabaseClient.auth.getUser();
      
      if (userError) {
        // Check if this is an anon key request (missing sub claim)
        if (userError.message?.includes('missing sub claim') || userError.message?.includes('invalid claim')) {
          console.log('Anon key request detected');
          isAnonKeyRequest = true;
        } else {
          throw userError;
        }
      } else {
        user = authUser;
      }
    } catch (error) {
      console.log('Auth error:', error);
      // For any auth errors, assume anon key request
      isAnonKeyRequest = true;
    }

    // --- Robust Path Parsing ---
    // e.g. /functions/v1/tanks/level-changes -> ['tanks', 'level-changes']
    // e.g. /functions/v1/tanks/123 -> ['tanks', '123']
    // e.g. /functions/v1/tanks/123/level-changes -> ['tanks', '123', 'level-changes']
    const thirdPart = pathParts[2] || '';

    // --- ROUTES ---
    if (mainRoute !== 'tanks') {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // /tanks - GET all tanks, POST new tank
    if (!secondPart) {
      if (req.method === 'GET') {
        // Allow both authenticated users and anon key for GET requests
        const { data, error } = await supabaseClient
          .from('fuel_tanks')
          .select('*, fuel_type:fuel_types(id, name)')
          .order('name');
        if (error) throw error;
        return new Response(JSON.stringify({ tanks: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      if (req.method === 'POST') {
        // Require authenticated user for write operations
        if (!user && !isAnonKeyRequest) throw new Error('Unauthorized: Authentication required for write operations');
        if (isAnonKeyRequest) throw new Error('Unauthorized: Anon key cannot perform write operations');
        
        const tank = await req.json();
        
        // Validate tank data
        if (!tank.name || !tank.capacity || tank.capacity <= 0) {
          throw new Error('Tank name and valid capacity are required');
        }
        
        if (!tank.fuel_type_id) {
          throw new Error('Fuel type is required');
        }
        
        // Validate current level doesn't exceed capacity
        if (tank.current_level && tank.current_level > tank.capacity) {
          throw new Error(
            `Initial fuel level (${tank.current_level}L) cannot exceed tank capacity (${tank.capacity}L)`
          );
        }
        
        // Ensure current level is not negative
        if (tank.current_level && tank.current_level < 0) {
          throw new Error('Initial fuel level cannot be negative');
        }
        
        // Set default current_level if not provided
        if (!tank.current_level) {
          tank.current_level = 0;
        }
        
        const { data, error } = await supabaseClient
          .from('fuel_tanks')
          .insert(tank)
          .select('*, fuel_type:fuel_types(id, name)')
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ tank: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // /tanks/summary - GET tank summary
    if (secondPart === 'summary') {
      if (req.method === 'GET') {
        // Allow both authenticated users and anon key for GET requests
        const { data: tanks, error } = await supabaseClient
          .from('fuel_tanks')
          .select('*');
        if (error) throw error;
        const totalTanks = tanks.length;
        const activeTanks = tanks.filter(t => t.is_active).length;
        const totalCapacity = tanks.reduce((sum, t) => sum + t.capacity, 0);
        const totalCurrentLevel = tanks.reduce((sum, t) => sum + t.current_level, 0);
        const lowLevelTanks = tanks.filter(t => t.current_level < t.capacity * 0.2).length;
        const criticalLevelTanks = tanks.filter(t => t.current_level < t.capacity * 0.1).length;
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
        );
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If we have a second part, it should be either a UUID (tank ID) or a known subroute
    const tankId = secondPart;
    
    // /tanks/{id} - GET, PUT, DELETE specific tank
    if (!thirdPart) {
      if (req.method === 'GET') {
        // Allow both authenticated users and anon key for GET requests
        const { data, error } = await supabaseClient
          .from('fuel_tanks')
          .select('*, fuel_type:fuel_types(id, name)')
          .eq('id', tankId)
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ tank: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      if (req.method === 'PUT') {
        // Require authenticated user for write operations
        if (!user && !isAnonKeyRequest) throw new Error('Unauthorized: Authentication required for write operations');
        if (isAnonKeyRequest) throw new Error('Unauthorized: Anon key cannot perform write operations');
        
        const updates = await req.json();
        const { data, error } = await supabaseClient
          .from('fuel_tanks')
          .update(updates)
          .eq('id', tankId)
          .select('*, fuel_type:fuel_types(id, name)')
          .single();
        if (error) throw error;
        return new Response(JSON.stringify({ tank: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      if (req.method === 'DELETE') {
        // Require authenticated user for write operations
        if (!user && !isAnonKeyRequest) throw new Error('Unauthorized: Authentication required for write operations');
        if (isAnonKeyRequest) throw new Error('Unauthorized: Anon key cannot perform write operations');
        
        const { error } = await supabaseClient
          .from('fuel_tanks')
          .delete()
          .eq('id', tankId);
        if (error) throw error;
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // /tanks/{id}/level-changes - GET level changes for tank
    if (thirdPart === 'level-changes') {
      if (req.method === 'GET') {
        // Allow both authenticated users and anon key for GET requests
        const { data, error } = await supabaseClient
          .from('tank_level_changes')
          .select('*')
          .eq('tank_id', tankId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        return new Response(JSON.stringify({ levelChanges: data }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // /tanks/{id}/adjust-level - POST to adjust tank level
    if (thirdPart === 'adjust-level') {
      if (!user) throw new Error('Unauthorized');
      if (req.method === 'POST') {
        const { change_amount, change_type, reason } = await req.json();
        
        // Validate input parameters
        if (!change_amount || change_amount <= 0) {
          throw new Error('Invalid change amount. Must be greater than 0.');
        }
        if (!change_type || !['add', 'subtract'].includes(change_type)) {
          throw new Error('Invalid change type. Must be "add" or "subtract".');
        }
        
        // Get current tank data including capacity
        const { data: tank, error: tankError } = await supabaseClient
          .from('fuel_tanks')
          .select('current_level, capacity, name')
          .eq('id', tankId)
          .single();
        if (tankError) throw tankError;
        if (!tank) throw new Error('Tank not found');
        
        const previous_level = tank.current_level;
        const new_level = change_type === 'add'
          ? previous_level + change_amount
          : previous_level - change_amount;
        
        // Enhanced server-side validation
        if (change_type === 'add') {
          // Check for capacity overflow
          if (new_level > tank.capacity) {
            const maxAddAmount = tank.capacity - previous_level;
            throw new Error(
              `Cannot add ${change_amount}L to tank "${tank.name}". ` +
              `This would exceed tank capacity (${tank.capacity}L). ` +
              `Maximum you can add: ${maxAddAmount}L`
            );
          }
        } else if (change_type === 'subtract') {
          // Check for underflow (negative level)
          if (new_level < 0) {
            throw new Error(
              `Cannot remove ${change_amount}L from tank "${tank.name}". ` +
              `This would result in negative fuel level. ` +
              `Maximum you can remove: ${previous_level}L`
            );
          }
        }
        
        // Additional safety check: ensure new level is within valid range
        if (new_level < 0) {
          throw new Error('Fuel level cannot be negative');
        }
        if (new_level > tank.capacity) {
          throw new Error(`Fuel level cannot exceed tank capacity of ${tank.capacity}L`);
        }
        
        // Update tank level
        const { error: updateError } = await supabaseClient
          .from('fuel_tanks')
          .update({ 
            current_level: new_level
          })
          .eq('id', tankId);
        if (updateError) throw updateError;
        
        // Record level change
        const { data: levelChange, error: changeError } = await supabaseClient
          .from('tank_level_changes')
          .insert({
            tank_id: tankId,
            previous_level,
            new_level,
            change_amount,
            change_type,
            // reason, // Temporarily commented out due to missing column in DB
            // created_by: user.id, // Temporarily commented out due to missing column in DB
          })
          .select()
          .single();
        if (changeError) throw changeError;
        
        return new Response(JSON.stringify({ 
          levelChange,
          message: `Successfully ${change_type === 'add' ? 'added' : 'removed'} ${change_amount}L. New level: ${new_level}L`
        }), {
          headers: corsHeaders,
          status: 201,
        });
      }
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders,
      });
    }

    // --- Not Found ---
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
// --- END ---
