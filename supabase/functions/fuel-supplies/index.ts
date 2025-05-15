import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
import { SuppliesFilters, FuelSupply, ApiResponse } from '../_shared/types.ts';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

async function handleGetAll(filters?: SuppliesFilters): Promise<Response> {
  try {
    let query = supabaseClient
      .from('fuel_supplies')
      .select(`
        id,
        delivery_date,
        provider_id,
        tank_id,
        quantity_liters,
        price_per_liter,
        total_cost,
        shift_id,
        comments,
        payment_method,
        payment_status,
        created_at,
        provider:petrol_providers!fuel_supplies_provider_id_fkey(id, name, contact),
        tank:fuel_tanks!fuel_supplies_tank_id_fkey(id, name, fuel_type, capacity, current_level),
        shift:shifts!fuel_supplies_shift_id_fkey(
          id,
          employee:employees!shifts_employee_id_fkey(id, name, position)
        )
      `)
      .order('delivery_date', { ascending: false });

    if (filters?.search) {
      query = query.or(`provider.name.ilike.%${filters.search}%,tank.name.ilike.%${filters.search}%`);
    }

    if (filters?.dateRange) {
      query = query
        .gte('delivery_date', filters.dateRange.from.toISOString())
        .lte('delivery_date', filters.dateRange.to.toISOString());
    }

    if (filters?.providerId) {
      query = query.eq('provider_id', filters.providerId);
    }

    if (filters?.tankId) {
      query = query.eq('tank_id', filters.tankId);
    }

    if (filters?.fuelType) {
      query = query.eq('tank.fuel_type', filters.fuelType);
    }

    if (filters?.minQuantity) {
      query = query.gte('quantity_liters', filters.minQuantity);
    }

    if (filters?.maxQuantity) {
      query = query.lte('quantity_liters', filters.maxQuantity);
    }

    if (filters?.minPrice) {
      query = query.gte('price_per_liter', filters.minPrice);
    }

    if (filters?.maxPrice) {
      query = query.lte('price_per_liter', filters.maxPrice);
    }

    if (filters?.minTotal) {
      query = query.gte('total_cost', filters.minTotal);
    }

    if (filters?.maxTotal) {
      query = query.lte('total_cost', filters.maxTotal);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform the data to ensure consistent structure
    const transformedData = data.map(supply => ({
      id: supply.id,
      delivery_date: supply.delivery_date,
      provider_id: supply.provider_id,
      tank_id: supply.tank_id,
      quantity_liters: supply.quantity_liters,
      price_per_liter: supply.price_per_liter,
      total_cost: supply.total_cost,
      shift_id: supply.shift_id,
      comments: supply.comments || '',
      payment_method: supply.payment_method,
      payment_status: supply.payment_status,
      created_at: supply.created_at,
      provider: supply.provider ? {
        id: supply.provider.id,
        name: supply.provider.name,
        contact: supply.provider.contact
      } : null,
      tank: supply.tank ? {
        id: supply.tank.id,
        name: supply.tank.name,
        fuel_type: supply.tank.fuel_type,
        capacity: supply.tank.capacity,
        current_level: supply.tank.current_level
      } : null,
      shift: supply.shift ? {
        id: supply.shift.id,
        employee: supply.shift.employee ? {
          id: supply.shift.employee.id,
          name: supply.shift.employee.name,
          position: supply.shift.employee.position
        } : null
      } : null
    }));

    return createResponse<FuelSupply[]>(transformedData);
  } catch (error) {
    console.error('Error fetching fuel supplies:', error);
    return createResponse<null>(null, error.message);
  }
}

async function handleCreate(supply: Omit<FuelSupply, 'id' | 'created_at'>): Promise<Response> {
  try {
    const { data, error } = await supabaseClient.rpc('create_fuel_supply', {
      p_supply: supply
    });

    if (error) throw error;

    return createResponse<FuelSupply>(data);
  } catch (error) {
    console.error('Error creating fuel supply:', error);
    return createResponse<null>(null, error.message);
  }
}

async function handleUpdate(id: string, supply: Partial<FuelSupply>): Promise<Response> {
  try {
    const { data, error } = await supabaseClient.rpc('update_fuel_supply', {
      p_id: id,
      p_supply: supply
    });

    if (error) throw error;

    return createResponse<FuelSupply>(data);
  } catch (error) {
    console.error('Error updating fuel supply:', error);
    return createResponse<null>(null, error.message);
  }
}

async function handleDelete(id: string): Promise<Response> {
  try {
    const { data, error } = await supabaseClient.rpc('delete_fuel_supply', {
      p_id: id
    });

    if (error) throw error;

    return createResponse<null>(data);
  } catch (error) {
    console.error('Error deleting fuel supply:', error);
    return createResponse<null>(null, error.message);
  }
}

// Helper function to create consistent API responses
function createResponse<T>(data: T | null, error?: string): Response {
  const response: ApiResponse<T> = {
    data: data ?? undefined,
    error: error ?? undefined,
  };

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: error ? 400 : 200,
  });
} 