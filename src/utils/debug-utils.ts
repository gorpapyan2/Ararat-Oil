import { supabase } from "@/integrations/supabase/client";

/**
 * Tests the Supabase connection and fetches basic information about the fuel_supplies table
 * @returns Promise<void>
 */
export async function testSupabaseConnection(): Promise<void> {
  try {
    console.log("Testing Supabase connection...");
    
    // Check if we can connect to Supabase
    const { data: connectionTestData, error: connectionError } = await supabase
      .from("fuel_supplies")
      .select("count")
      .limit(1);
    
    if (connectionError) {
      console.error("Supabase connection error:", connectionError);
      return;
    }
    
    console.log("Supabase connection successful");
    
    // Check if the fuel_supplies table exists and has data
    const { count, error: countError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Error checking fuel_supplies table:", countError);
      return;
    }
    
    console.log(`The fuel_supplies table has ${count} records`);
    
    // Fetch a single record to check the structure
    if (count && count > 0) {
      const { data: sampleData, error: sampleError } = await supabase
        .from("fuel_supplies")
        .select("*")
        .limit(1)
        .single();
      
      if (sampleError) {
        console.error("Error fetching sample record:", sampleError);
        return;
      }
      
      console.log("Sample record structure:", Object.keys(sampleData));
      console.log("Sample record values:", sampleData);
    }
    
    // Now check the full query that's used in the application
    const { data, error } = await supabase
      .from("fuel_supplies")
      .select(`
        *,
        provider:petrol_providers(id, name, contact),
        tank:fuel_tanks(id, name, fuel_type, capacity, current_level),
        employee:employees(id, name, position, contact, salary, hire_date, status)
      `)
      .order("delivery_date", { ascending: false });

    if (error) {
      console.error("Error with full query:", error);
      return;
    }
    
    console.log(`Full query returned ${data?.length || 0} records`);
    
    if (data && data.length > 0) {
      console.log("First record from full query:", data[0]);
    }
    
  } catch (e) {
    console.error("Exception in testSupabaseConnection:", e);
  }
} 