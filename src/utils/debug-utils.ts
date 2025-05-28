import { supabase } from "@/core/api/supabase";

/**
 * Tests the Supabase connection and fetches basic information about the fuel_supplies table
 * For debugging purposes only - do not use in production
 */
export async function testSupabaseConnection() {
  console.log("=== Supabase Connection Test ===");

  try {
    // Test 1: Basic connection check
    console.log("1. Checking base connection...");
    const { data: testData, error: testError } = await supabase
      .from("fuel_supplies")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Basic connection test failed:", testError);
      return false;
    }

    console.log("✅ Basic connection successful");

    // Test 2: Check if the fuel_supplies table exists and has data
    console.log("2. Checking fuel_supplies table...");
    const { count, error: countError } = await supabase
      .from("fuel_supplies")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Error checking fuel_supplies table:", countError);
      return false;
    }

    console.log(`✅ The fuel_supplies table has ${count} records`);

    // Test 3: Simple query without relations
    console.log("3. Executing simple query...");
    const { data: simpleData, error: simpleError } = await supabase
      .from("fuel_supplies")
      .select("id, delivery_date")
      .limit(3);

    if (simpleError) {
      console.error("Simple query failed:", simpleError);
      return false;
    }

    console.log(
      `✅ Simple query returned ${simpleData.length} items:`,
      simpleData
    );

    // Test 4: Full query with relations
    console.log("4. Executing full query with relations...");
    const { data, error } = await supabase
      .from("fuel_supplies")
      .select(
        `
        *,
        provider:petrol_providers!provider_id(id, name, contact),
        tank:fuel_tanks!tank_id(id, name, fuel_type, capacity, current_level),
        employee:employees!employee_id(id, name, position, contact, salary, hire_date, status)
      `
      )
      .limit(1);

    if (error) {
      console.error("Full query with relations failed:", error);
      return false;
    }

    console.log(`✅ Full query returned ${data.length} items with relations`);
    console.log(
      "Sample data structure:",
      data[0] ? Object.keys(data[0]) : "No data"
    );

    if (data.length > 0) {
      const sample = data[0];
      console.log("Relation check:", {
        hasProvider: Boolean(sample.provider),
        hasTank: Boolean(sample.tank),
        hasEmployee: Boolean(sample.employee),
      });
    }

    console.log("=== Connection Test Finished Successfully ===");
    return true;
  } catch (e) {
    console.error("Connection test failed with exception:", e);
    return false;
  }
}
