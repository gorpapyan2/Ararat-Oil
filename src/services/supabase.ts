import { createClient } from "@supabase/supabase-js";

// Environment variables check
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create Supabase client with improved network handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
  global: {
    headers: {
      "x-client-info": "web-tech-whisperer-vibe",
    },
  },
});

export default supabase;

// Add error event listener to detect network issues
window.addEventListener("offline", () => {
  console.warn("Connection lost. App will operate in offline mode.");
});

window.addEventListener("online", () => {
  console.log("Connection restored. Reconnecting to Supabase...");
});

// Helper to check if a network error occurred
export const isNetworkError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    return (
      message?.includes("Failed to fetch") ||
      message?.includes("Network Error") ||
      message?.includes("NetworkError")
    );
  }
  
  if (error && typeof error === 'object' && 'name' in error && 'message' in error) {
    const errorObj = error as { name: string; message: string };
    return errorObj.name === "TypeError" && errorObj.message?.includes("fetch");
  }
  
  return false;
};
