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
  comments?: string;
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: string;
  };
  employee?: {
    id: string;
    name: string;
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // GET /fuel-supplies
    if (req.method === "GET" && !path) {
      const { data, error } = await supabaseClient
        .from("fuel_supplies")
        .select(`
          *,
          provider:providers(id, name),
          tank:tanks(id, name, fuel_type),
          employee:employees(id, name)
        `)
        .order("delivery_date", { ascending: false });

      if (error) throw error;

      return createResponse<FuelSupply[]>(data);
    }

    // POST /fuel-supplies
    if (req.method === "POST" && !path) {
      const body = await req.json();
      const { data, error } = await supabaseClient
        .from("fuel_supplies")
        .insert(body)
        .select()
        .single();

      if (error) throw error;

      return createResponse<FuelSupply>(data);
    }

    // PATCH /fuel-supplies/:id
    if (req.method === "PATCH" && path) {
      const body = await req.json();
      const { data, error } = await supabaseClient
        .from("fuel_supplies")
        .update(body)
        .eq("id", path)
        .select()
        .single();

      if (error) throw error;

      return createResponse<FuelSupply>(data);
    }

    // DELETE /fuel-supplies/:id
    if (req.method === "DELETE" && path) {
      const { error } = await supabaseClient
        .from("fuel_supplies")
        .delete()
        .eq("id", path);

      if (error) throw error;

      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
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
