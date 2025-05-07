import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Re-export all types from types directory
export * from "@/types";

// Re-export all service functions
export * from "./sales";
export * from "./expenses";
export * from "./financials";
export * from "./employees";
export * from "./tanks";
export * from "./transactions";

// We'll be more specific with these exports to avoid ambiguity
export {
  fetchFuelSupplies,
  createFuelSupply,
  updateFuelSupply,
  deleteFuelSupply,
} from "./fuel-supplies";

export {
  createFillingSystem,
  fetchFillingSystems,
  deleteFillingSystem,
  validateTankIds,
} from "./filling-systems";

export {
  fetchPetrolProviders,
  createPetrolProvider,
  updatePetrolProvider,
  deletePetrolProvider,
} from "./petrol-providers";
