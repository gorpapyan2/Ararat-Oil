import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Check Supabase connection on import
(async function checkSupabaseConnection() {
  try {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabase.from('petrol_providers').select('count').limit(1);
    
    if (error) {
      console.error("Supabase connection error:", error);
    } else {
      console.log("Supabase connection successful, table access verified");
    }
  } catch (err) {
    console.error("Failed to check Supabase connection:", err);
  }
})();

// Re-export all types from types directory
export * from "@/types";

// Re-export all service functions
export * from "./sales";
export * from "./expenses";
export * from "./financials";
export * from "./employees";
export * from "./tanks";
export * from "./transactions";

// Don't re-export petrol-providers to avoid circular dependency
// export * from "./petrol-providers";

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
