import { supabase } from "@/services/supabase";
import { FuelType, FuelTypeCode } from "@/types";
import type { PostgrestError } from "@supabase/supabase-js";

export interface FuelPrice {
  id: string;
  fuel_type: FuelType;
  fuel_type_id?: string;
  price_per_liter: number;
  effective_date: string;
  created_at?: string;
  updated_at?: string;
}

// Database type for fuel_prices table
type FuelPriceRecord = {
  id: string;
  fuel_type: string;
  fuel_type_id?: string;
  price_per_liter: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}

// Interface for joined fuel price data from Supabase
interface FuelPriceWithType {
  id: string;
  fuel_type: string;
  fuel_type_id: string;
  price_per_liter: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
  fuel_types?: {
    id: string;
    code: string;
    name: string;
  };
}

// Specific fuel type codes array to avoid deep instantiation error
const FUEL_TYPE_CODES: FuelTypeCode[] = [
  "diesel", 
  "gas", 
  "petrol_regular", 
  "petrol_premium"
];

// Get the current fuel price for each fuel type
export async function getCurrentFuelPrices(): Promise<Record<FuelTypeCode, number>> {
  try {
    // Get the latest price for each fuel type
    const { data, error } = await supabase
      .from("fuel_prices")
      .select(`
        id, 
        fuel_type,
        fuel_type_id,
        price_per_liter, 
        effective_date,
        created_at,
        fuel_types!fuel_prices_fuel_type_id_fkey (
          id,
          code,
          name
        )
      `);

    if (error) {
      console.error("Error fetching current fuel prices:", error);
      throw error;
    }

    // Create a record with the latest price for each fuel type
    const latestPrices: Record<FuelTypeCode, number> = {
      diesel: 0,
      gas: 0,
      petrol_regular: 0,
      petrol_premium: 0,
    };

    if (!data || data.length === 0) {
      return latestPrices;
    }

    // Explicitly type the data for easier handling
    const fuelPriceData = data as unknown as FuelPriceWithType[];

    // Group by fuel type and get the latest price for each
    FUEL_TYPE_CODES.forEach((fuelType) => {
      const latestPrice = fuelPriceData
        .filter((price) => {
          if (price.fuel_types) {
            return price.fuel_types.code === fuelType;
          } else {
            return price.fuel_type === fuelType;
          }
        })
        .sort((a, b) => {
          // Sort by effective date (desc) then created_at (desc)
          const dateA = new Date(a.effective_date);
          const dateB = new Date(b.effective_date);
          if (dateA.getTime() !== dateB.getTime()) {
            return dateB.getTime() - dateA.getTime();
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        })[0];

      if (latestPrice) {
        latestPrices[fuelType] = latestPrice.price_per_liter;
      }
    });

    return latestPrices;
  } catch (err) {
    console.error("Failed to fetch current fuel prices:", err);
    // Return default prices if failed
    return {
      diesel: 0,
      gas: 0,
      petrol_regular: 0,
      petrol_premium: 0,
    };
  }
}

// Get fuel price history for a specific type or all types
export async function getFuelPriceHistory(fuelType?: FuelType, limit = 50): Promise<FuelPrice[]> {
  try {
    let query = supabase
      .from("fuel_prices")
      .select(`
        id, 
        fuel_type,
        fuel_type_id,
        price_per_liter, 
        effective_date,
        created_at,
        updated_at,
        fuel_types!fuel_prices_fuel_type_id_fkey (
          id,
          code,
          name
        )
      `)
      .order('effective_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    // If a specific fuel type is requested, filter by it
    if (fuelType) {
      query = query.eq('fuel_type', fuelType);
    } else {
      // If no specific type, get records for all our supported types
      query = query.in('fuel_type', FUEL_TYPE_CODES);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching fuel price history:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Explicitly type the data
    const fuelPriceData = data as unknown as FuelPriceWithType[];

    return fuelPriceData.map(record => ({
      id: record.id,
      fuel_type: record.fuel_type as FuelType,
      fuel_type_id: record.fuel_type_id,
      price_per_liter: record.price_per_liter,
      effective_date: record.effective_date,
      created_at: record.created_at,
      updated_at: record.updated_at
    }));
  } catch (err) {
    console.error("Failed to fetch fuel price history:", err);
    throw err;
  }
}

// Get fuel type ID by code - Use string literal type to avoid deep instantiation
export async function getFuelTypeIdByCode(code: 'diesel' | 'gas' | 'petrol_regular' | 'petrol_premium'): Promise<string> {
  try {
    const { data, error } = await supabase
      .from("fuel_types")
      .select("id")
      .eq("code", code)
      .single();

    if (error) {
      console.error(`Error getting fuel type ID for code ${code}:`, error);
      throw error;
    }

    return data.id as string;
  } catch (err) {
    console.error(`Failed to get fuel type ID for code ${code}:`, err);
    throw err;
  }
}

// Set or update the fuel price for a specific type
export async function setFuelPrice(fuelType: FuelType, price: number): Promise<FuelPrice> {
  const effectiveDate = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
  
  try {
    // Get the fuel type ID from the code
    const fuelTypeId = await getFuelTypeIdByCode(fuelType as 'diesel' | 'gas' | 'petrol_regular' | 'petrol_premium');
    
    if (!fuelTypeId) {
      throw new Error(`Fuel type ID not found for code: ${fuelType}`);
    }
    
    const { data, error } = await supabase
      .from("fuel_prices")
      .insert({
        fuel_type: fuelType, // Keep for backward compatibility
        fuel_type_id: fuelTypeId,
        price_per_liter: price,
        effective_date: effectiveDate,
      })
      .select();

    if (error) {
      console.error(`Error setting fuel price for ${fuelType}:`, error);
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned after inserting fuel price");
    }

    const result = data[0];
    return {
      id: result.id,
      fuel_type: result.fuel_type as FuelType,
      fuel_type_id: result.fuel_type_id,
      price_per_liter: result.price_per_liter,
      effective_date: result.effective_date,
      created_at: result.created_at,
      updated_at: result.updated_at
    };
  } catch (err) {
    console.error(`Error setting fuel price for ${fuelType}:`, err);
    throw err;
  }
}

// Update all fuel prices at once
export async function updateAllFuelPrices(
  prices: Record<FuelTypeCode, number>
): Promise<Record<FuelTypeCode, FuelPrice>> {
  const effectiveDate = new Date().toISOString().split('T')[0]; // Today's date
  const fuelTypeCodes = Object.keys(prices) as FuelTypeCode[];
  
  try {
    // Validate prices - make sure they're positive
    for (const fuelType of fuelTypeCodes) {
      if (prices[fuelType] < 0) {
        throw new Error(`Invalid price for ${fuelType}: ${prices[fuelType]}. Prices must be non-negative.`);
      }
    }

    // Get all fuel type IDs in one batch
    const { data: fuelTypeData, error: fuelTypeError } = await supabase
      .from("fuel_types")
      .select("id, code")
      .in("code", fuelTypeCodes);
    
    if (fuelTypeError) {
      console.error("Error fetching fuel type IDs:", fuelTypeError);
      throw fuelTypeError;
    }
    
    // Check that we found all required fuel types
    if (!fuelTypeData || fuelTypeData.length !== fuelTypeCodes.length) {
      const foundCodes = fuelTypeData?.map(ft => ft.code) || [];
      const missingCodes = fuelTypeCodes.filter(code => !foundCodes.includes(code));
      throw new Error(`Could not find all required fuel types. Missing: ${missingCodes.join(', ')}`);
    }

    // Create a map of code to ID for easy lookup
    const fuelTypeMap = new Map();
    fuelTypeData.forEach(item => {
      fuelTypeMap.set(item.code, item.id);
    });

    // Create price records with both code and ID
    const newPrices = fuelTypeCodes.map((fuelType) => ({
      fuel_type: fuelType, // Keep for backward compatibility
      fuel_type_id: fuelTypeMap.get(fuelType), // Add the foreign key
      price_per_liter: prices[fuelType],
      effective_date: effectiveDate,
    }));

    const { data, error } = await supabase
      .from("fuel_prices")
      .insert(newPrices)
      .select();

    if (error) {
      console.error("Error updating fuel prices:", error);
      throw error;
    }

    if (!data) {
      throw new Error("No data returned after inserting fuel prices");
    }

    // Transform the result into a record by fuel type
    const result: Record<string, FuelPrice> = {};
    data.forEach((price) => {
      const fuelType = price.fuel_type as FuelTypeCode;
      result[fuelType] = {
        id: price.id,
        fuel_type: fuelType,
        fuel_type_id: price.fuel_type_id,
        price_per_liter: price.price_per_liter,
        effective_date: price.effective_date,
        created_at: price.created_at,
        updated_at: price.updated_at
      };
    });

    return result as Record<FuelTypeCode, FuelPrice>;
  } catch (err) {
    console.error("Error updating all fuel prices:", err);
    throw err;
  }
} 