import { supabase } from './supabase';
import { FuelTank, FuelType } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// Export the FillingSystem type
export interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
  tank?: FuelTank;
  created_at?: string;
}

// Mock data for offline mode
const MOCK_FILLING_SYSTEMS: FillingSystem[] = [
  {
    id: "offline-fs-1",
    name: "Pump 1 - Petrol",
    tank_id: "offline-tank-1",
    created_at: new Date().toISOString(),
    tank: {
      id: "offline-tank-1",
      name: "Main Petrol Tank",
      capacity: 5000,
      current_level: 3500,
      fuel_type: "petrol",
      created_at: new Date().toISOString()
    }
  },
  {
    id: "offline-fs-2",
    name: "Pump 2 - Diesel",
    tank_id: "offline-tank-2",
    created_at: new Date().toISOString(),
    tank: {
      id: "offline-tank-2",
      name: "Main Diesel Tank",
      capacity: 5000,
      current_level: 2800,
      fuel_type: "diesel",
      created_at: new Date().toISOString()
    }
  }
];

export const createFillingSystem = async (
  name: string,
  tankId: string,
): Promise<FillingSystem> => {
  const { data, error } = await supabase
    .from("filling_systems")
    .insert([{ name, tank_id: tankId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Helper function to check if tank_ids exist in the fuel_tanks table
export const validateTankIds = async (
  tankIds: string[],
): Promise<Record<string, boolean>> => {
  if (!tankIds.length) return {};

  const { data, error } = await supabase
    .from("fuel_tanks")
    .select("id")
    .in("id", tankIds);

  if (error) {
    console.error("Error validating tank IDs:", error);
    return {};
  }

  const validIds = new Set((data || []).map((tank) => tank.id));
  const result: Record<string, boolean> = {};

  tankIds.forEach((id) => {
    result[id] = validIds.has(id);
  });

  return result;
};

export const fetchFillingSystems = async (): Promise<FillingSystem[]> => {
  try {
    // Check for offline status
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Fetching filling systems. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for filling systems");
      return MOCK_FILLING_SYSTEMS;
    }

    // Get auth session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No session, using offline mode for filling systems");
        return MOCK_FILLING_SYSTEMS;
      }
    } catch (sessionError) {
      console.error("Error getting auth session:", sessionError);
      return MOCK_FILLING_SYSTEMS;
    }

    // Use foreign table syntax instead of nested select
    const { data, error } = await supabase
      .from("filling_systems")
      .select(`
        id,
        name,
        tank_id,
        created_at,
        tank:fuel_tanks(id, name, capacity, current_level, fuel_type, created_at)
      `)
      .order("name");

    if (error) {
      console.error("Error fetching filling systems:", error);
      return MOCK_FILLING_SYSTEMS;
    }

    if (!data || data.length === 0) {
      console.log("No filling systems found, returning empty array");
      return [];
    }

    console.log(`Successfully fetched ${data.length} filling systems`);
    
    // Log the first record to help with debugging
    if (data.length > 0) {
      console.log("Sample filling system data:", data[0]);
    }

    // Transform the data to ensure proper typing of nested tank objects
    return data.map((item) => {
      try {
        // Handle tank data - Supabase can return either an array or object depending on the query
        let tankData = null;

        if (item.tank) {
          // If it's an array, take the first item
          if (Array.isArray(item.tank) && item.tank.length > 0) {
            tankData = item.tank[0];
          }
          // If it's a direct object (non-array), use it directly
          else if (typeof item.tank === "object") {
            tankData = item.tank;
          }
        }

        return {
          id: item.id,
          name: item.name || "Unnamed System",
          tank_id: item.tank_id,
          created_at: item.created_at,
          tank: tankData
            ? {
                id: tankData.id || item.tank_id, // Fallback to tank_id if id is missing
                name: tankData.name || "Unknown Tank",
                capacity: Number(tankData.capacity) || 0,
                current_level: Number(tankData.current_level) || 0,
                fuel_type: (tankData.fuel_type as FuelType) || "petrol", // Default to petrol
                created_at: tankData.created_at || item.created_at,
              }
            : undefined,
        };
      } catch (itemError) {
        console.error("Error processing filling system item:", itemError, item);
        // Return a basic version of the item to avoid breaking the UI
        return {
          id: item.id || `error-${Date.now()}`,
          name: item.name || "Error: Malformed System",
          tank_id: item.tank_id || "",
          created_at: item.created_at || new Date().toISOString(),
        };
      }
    });
  } catch (err) {
    console.error("Failed to fetch filling systems:", err);
    console.log("Using offline mode as fallback for filling systems");
    return MOCK_FILLING_SYSTEMS;
  }
};

export const deleteFillingSystem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("filling_systems")
    .delete()
    .eq("id", id);

  if (error) throw error;
};
