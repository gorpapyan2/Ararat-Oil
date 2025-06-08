import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Inlined shared code - CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

// Inlined types
interface SuppliesFilters {
  searchTerm?: string;
  selectedProvider?: string;
  selectedFuelType?: string;
}

interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  shift_id?: string;
  comments?: string;
  payment_method?: string;
  payment_status?: string;
  created_at: string;
  updated_at: string;
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: string;
  };
  shift?: {
    id: string;
    start_time: string;
    end_time?: string;
    employee_id?: string;
    employees?: {
      id: string;
      name: string;
      position: string;
    };
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments[pathSegments.length - 1];
    const secondLastSegment = pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : null;
    
    // Check if this is the fuel-supplies endpoint (either direct call or with ID)
    const isFuelSuppliesEndpoint = lastSegment === 'fuel-supplies' || secondLastSegment === 'fuel-supplies';
    const resourceId = secondLastSegment === 'fuel-supplies' ? lastSegment : null;

    if (isFuelSuppliesEndpoint) {
      // GET /fuel-supplies
      if (req.method === "GET" && !resourceId) {
        const { data, error } = await supabaseClient
          .from("fuel_supplies")
          .select(`
            *,
            petrol_providers(id, name),
            fuel_tanks(
              id, 
              name, 
              fuel_types(id, name, code)
            ),
            shifts(
              id,
              start_time,
              end_time,
              employees(id, name, position)
            )
          `)
          .order("delivery_date", { ascending: false });

        if (error) {
          console.error('Database error:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: corsHeaders }
          );
        }

        console.log('Raw data from database:', JSON.stringify(data, null, 2));
        return new Response(
          JSON.stringify(data),
          { status: 200, headers: corsHeaders }
        );
      }

      // GET /fuel-supplies/:id
      if (req.method === "GET" && resourceId) {
        const { data, error } = await supabaseClient
          .from("fuel_supplies")
          .select(`
            *,
            petrol_providers(id, name),
            fuel_tanks(
              id, 
              name, 
              fuel_types(id, name, code)
            ),
            shifts(
              id,
              start_time,
              end_time,
              employees(id, name, position)
            )
          `)
          .eq("id", resourceId)
          .single();

        if (error) {
          console.error('Database error for single record:', error);
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: corsHeaders }
          );
        }

        console.log('Single record data:', JSON.stringify(data, null, 2));
        return new Response(
          JSON.stringify(data),
          { status: 200, headers: corsHeaders }
        );
      }

      // POST /fuel-supplies
      if (req.method === "POST" && !resourceId) {
        const body = await req.json();
        const { data, error } = await supabaseClient
          .from("fuel_supplies")
          .insert(body)
          .select("*")
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 201, headers: corsHeaders }
        );
      }

      // PATCH /fuel-supplies/:id
      if (req.method === "PATCH" && resourceId) {
        const body = await req.json();
        const { data, error } = await supabaseClient
          .from("fuel_supplies")
          .update(body)
          .eq("id", resourceId)
          .select("*")
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: corsHeaders }
        );
      }

      // PUT /fuel-supplies/:id (for compatibility)
      if (req.method === "PUT" && resourceId) {
        const body = await req.json();
        const { data, error } = await supabaseClient
          .from("fuel_supplies")
          .update(body)
          .eq("id", resourceId)
          .select("*")
          .single();

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify(data),
          { status: 200, headers: corsHeaders }
        );
      }

      // DELETE /fuel-supplies/:id
      if (req.method === "DELETE" && resourceId) {
        const { error } = await supabaseClient
          .from("fuel_supplies")
          .delete()
          .eq("id", resourceId);

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 400, headers: corsHeaders }
          );
        }

        return new Response(
          JSON.stringify({ message: 'Fuel supply deleted successfully' }),
          { status: 200, headers: corsHeaders }
        );
      }
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  } catch (error) {
    return createResponse<null>(null, error.message);
  }
});

function createResponse<T>(data: T | null, error?: string): Response {
  return new Response(
    JSON.stringify({ data, error: error || null }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error ? 400 : 200,
    }
  );
}
