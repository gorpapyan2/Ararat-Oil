
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Set up ENV configs for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing environment variables VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY!"
  );
}

// Configure the Supabase client with better network handling
const supabaseClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      // Add fetch options with longer timeout
      fetch: (url, options) => {
        const fetchOptions = {
          ...options,
          // Longer timeout for slower connections
          timeout: 30000,  // 30 seconds
        };
        
        return fetch(url, fetchOptions);
      },
    },
    // Improved retry configuration
    db: {
      schema: "public",
    },
    // Add custom fetch handler to simulate retries
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Add error event listener to detect network issues
window.addEventListener('offline', () => {
  console.warn('Connection lost. App will operate in offline mode.');
});

window.addEventListener('online', () => {
  console.log('Connection restored. Reconnecting to Supabase...');
  // We can trigger any reconnection logic here if needed
});

// Helper to check if a network error occurred
export const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('Failed to fetch') || 
    error?.message?.includes('Network Error') ||
    error?.message?.includes('NetworkError') ||
    error?.name === 'TypeError' && error?.message?.includes('fetch')
  );
};

// Check Supabase connection on import
(async function checkSupabaseConnection() {
  try {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabaseClient.from('petrol_providers').select('count').limit(1);
    
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

// Export the client with both named export and as default
export const supabase = supabaseClient;
export default supabaseClient;
