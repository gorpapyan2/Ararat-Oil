import { FuelSupply, SuppliesFilters } from '@/features/supplies/types';
import { supabase } from '@/services/supabase';

const FUEL_SUPPLIES_FUNCTION = 'fuel-supplies';

/**
 * Fetch all fuel supply records with related provider, tank, and employee details.
 * Uses Edge Function for complex filtering and data aggregation.
 * @returns {Promise<FuelSupply[]>}
 * @throws {Error} If fetching data fails
 */
export async function fetchFuelSupplies(filters?: SuppliesFilters): Promise<FuelSupply[]> {
  try {
    const { data, error } = await supabase.functions.invoke(FUEL_SUPPLIES_FUNCTION, {
      body: { action: 'getAll', filters }
    });

    if (error) {
      throw error;
    }

    return data as FuelSupply[];
  } catch (error) {
    console.error('Error fetching fuel supplies:', error);
    throw error;
  }
}

/**
 * Create a new fuel supply record.
 * Uses Edge Function to handle business logic and related updates.
 */
export async function createFuelSupply(supply: Omit<FuelSupply, 'id' | 'created_at'>): Promise<FuelSupply> {
  try {
    const { data, error } = await supabase.functions.invoke(FUEL_SUPPLIES_FUNCTION, {
      body: { action: 'create', supply }
    });

    if (error) {
      throw error;
    }

    return data as FuelSupply;
  } catch (error) {
    console.error('Error creating fuel supply:', error);
    throw error;
  }
}

/**
 * Update an existing fuel supply record.
 * Uses Edge Function to handle business logic and related updates.
 */
export async function updateFuelSupply(id: string, supply: Partial<FuelSupply>): Promise<FuelSupply> {
  try {
    const { data, error } = await supabase.functions.invoke(FUEL_SUPPLIES_FUNCTION, {
      body: { action: 'update', id, supply }
    });

    if (error) {
      throw error;
    }

    return data as FuelSupply;
  } catch (error) {
    console.error('Error updating fuel supply:', error);
    throw error;
  }
}

/**
 * Delete a fuel supply record.
 * Uses Edge Function to handle cleanup and related updates.
 */
export async function deleteFuelSupply(id: string): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke(FUEL_SUPPLIES_FUNCTION, {
      body: { action: 'delete', id }
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error deleting fuel supply:', error);
    throw error;
  }
}
