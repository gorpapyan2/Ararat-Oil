import { createServiceClient, getUserFromRequest } from '../_shared/database.ts';
import {
  handleCors,
  successResponse,
  errorResponse,
  methodNotAllowed,
  unauthorized,
  notFound,
  parseRequestBody
} from '../_shared/api.ts';
import { FuelType, PaymentStatus } from '../_shared/types.ts';

// FuelPrice type definition (add to _shared/types.ts if not present)
interface FuelPrice {
  id: string;
  fuel_type: FuelType;
  price_per_liter: number;
  effective_date: string;
  created_at?: string;
  updated_at?: string;
  status?: PaymentStatus | string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  const url = new URL(req.url);
  const path = url.pathname.replace('/fuel-prices', '');

  // Auth required for mutations
  const user = await getUserFromRequest(req);
  const isMutation = req.method !== 'GET';
  if (isMutation && !user) return unauthorized();

  try {
    if (req.method === 'GET') {
      if (path === '' || path === '/') {
        // List all fuel prices, optionally filter by fuel_type
        const fuelType = url.searchParams.get('fuel_type');
        return await getFuelPrices(fuelType);
      } else if (path.match(/^\/[a-zA-Z0-9-]+$/)) {
        const id = path.split('/')[1];
        return await getFuelPriceById(id);
      }
    } else if (req.method === 'POST' && (path === '' || path === '/')) {
      const data = await parseRequestBody<Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>>(req);
      return await createFuelPrice(data);
    } else if (req.method === 'PUT' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      const data = await parseRequestBody<Partial<Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>>>(req);
      return await updateFuelPrice(id, data);
    } else if (req.method === 'DELETE' && path.match(/^\/[a-zA-Z0-9-]+$/)) {
      const id = path.split('/')[1];
      return await deleteFuelPrice(id);
    }
  } catch (error) {
    return errorResponse(error);
  }

  return methodNotAllowed();
});

/**
 * List all fuel prices, optionally filter by fuel_type
 */
async function getFuelPrices(fuelType?: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    let query = supabase.from('fuel_prices').select('*').order('effective_date', { ascending: false });
    if (fuelType) query = query.eq('fuel_type', fuelType);
    const { data, error } = await query;
    if (error) throw error;
    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Get a specific fuel price by ID
 */
async function getFuelPriceById(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('fuel_prices').select('*').eq('id', id).single();
    if (error) {
      if (error.code === 'PGRST116') return notFound('Fuel price');
      throw error;
    }
    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Create a new fuel price record
 */
async function createFuelPrice(
  price: Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase.from('fuel_prices').insert(price).select().single();
    if (error) throw error;
    return successResponse(data, 201);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Update an existing fuel price record
 */
async function updateFuelPrice(
  id: string,
  updates: Partial<Omit<FuelPrice, 'id' | 'created_at' | 'updated_at'>>
): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const updatedFields = { ...updates, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('fuel_prices').update(updatedFields).eq('id', id).select().single();
    if (error) throw error;
    return successResponse(data);
  } catch (error) {
    return errorResponse(error);
  }
}

/**
 * Delete a fuel price record
 */
async function deleteFuelPrice(id: string): Promise<Response> {
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('fuel_prices').delete().eq('id', id);
    if (error) throw error;
    return successResponse({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
} 