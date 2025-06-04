/**
 * Supabase Client Configuration
 *
 * This file sets up and exports the Supabase client with proper configuration
 * for authentication, networking, and error handling.
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { API_CONFIG } from "@/core/config/api";
import { isDevelopment } from "@/core/config/environment";

// Validate environment configuration
if (!API_CONFIG.SUPABASE_URL || !API_CONFIG.SUPABASE_ANON_KEY) {
  console.error("Missing Supabase configuration in API_CONFIG!");
}

// Configure the Supabase client with improved configuration
export const supabase = createClient<Database>(
  API_CONFIG.SUPABASE_URL,
  API_CONFIG.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
    global: {
      // Add fetch options with configuration from API_CONFIG
      fetch: (url, options) => {
        const fetchOptions = {
          ...options,
          // Use timeout from API_CONFIG
          timeout: API_CONFIG.TIMEOUT,
        };

        return fetch(url, fetchOptions);
      },
    },
    // Database configuration
    db: {
      schema: "public",
    },
    // Realtime configuration
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Add connection monitoring if in development mode
if (isDevelopment()) {
  // Check Supabase connection on import
  (async function checkSupabaseConnection() {
    try {
      console.log("Checking Supabase connection...");
      const { data, error } = await supabase
        .from("employees")
        .select("count")
        .limit(1);

      if (error) {
        console.error("Supabase connection error:", error);
      } else {
        console.log("Supabase connection successful");
      }
    } catch (err) {
      console.error("Failed to check Supabase connection:", err);
    }
  })();
}

// Add connection event listeners
if (typeof window !== "undefined") {
  window.addEventListener("offline", () => {
    console.warn("Connection lost. App will operate in offline mode.");
  });

  window.addEventListener("online", () => {
    console.log("Connection restored. Reconnecting to Supabase...");
    // We can trigger any reconnection logic here if needed
  });
}

// Export the client as default and named export
export default supabase;
