import { PostgrestError, PostgrestSingleResponse } from "@supabase/supabase-js";
import { supabase } from "@/services/supabase";

/**
 * Helper function to ensure consistent error handling and response parsing
 * for Supabase queries
 */
export async function safeQuery<T>(
  query: Promise<PostgrestSingleResponse<T>>,
  errorMessage = "Database query failed",
): Promise<T | null> {
  try {
    const { data, error } = await query;

    if (error) {
      console.error(`${errorMessage}:`, error);
      return null;
    }

    return data;
  } catch (err) {
    console.error(`Exception in ${errorMessage}:`, err);
    return null;
  }
}

/**
 * Safely fetch a user's employee record by user ID
 */
export async function fetchEmployeeByUserId(userId: string) {
  if (!userId) return null;

  try {
    const { data, error } = await supabase
      .from("employees")
      .select("id, name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching employee record:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Exception in fetching employee record:", err);
    return null;
  }
}

/**
 * Safely fetch an active shift for an employee
 */
export async function fetchActiveShift(employeeId: string) {
  if (!employeeId) return null;

  try {
    // Check for network connectivity first
    if (!navigator.onLine) {
      console.warn("No internet connection. Using offline mode for active shift.");
      // Try to get shift from localStorage if offline
      const cachedShift = localStorage.getItem(`activeShift_${employeeId}`);
      if (cachedShift) {
        return JSON.parse(cachedShift);
      }
      return null;
    }

    const { data, error } = await supabase
      .from("shifts")
      .select()
      .eq("employee_id", employeeId)
      .eq("status", "OPEN")
      .maybeSingle();

    if (error) {
      console.error("Error fetching active shift:", error);
      
      // Try to get shift from localStorage if there's an error
      const cachedShift = localStorage.getItem(`activeShift_${employeeId}`);
      if (cachedShift) {
        console.log("Using cached shift data during API error");
        return JSON.parse(cachedShift);
      }
      
      return null;
    }

    // Cache the shift data in localStorage
    if (data) {
      localStorage.setItem(`activeShift_${employeeId}`, JSON.stringify(data));
    } else {
      // Clear the cache if no active shift
      localStorage.removeItem(`activeShift_${employeeId}`);
    }

    return data;
  } catch (error) {
    console.error("Error fetching active shift:", error);
    
    // Try to use cached data in case of network failure
    try {
      const cachedShift = localStorage.getItem(`activeShift_${employeeId}`);
      if (cachedShift) {
        console.log("Using cached shift data during network error");
        return JSON.parse(cachedShift);
      }
    } catch (cacheError) {
      console.error("Error retrieving cached shift:", cacheError);
    }
    
    return null;
  }
}

/**
 * Safely fetch recent shift history for an employee
 */
export async function fetchShiftHistory(employeeId: string, limit = 10) {
  if (!employeeId) return [];

  try {
    const { data, error } = await supabase
      .from("shifts")
      .select()
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching shift history:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Exception in fetching shift history:", err);
    return [];
  }
}
