import { supabase } from "@/services/supabase";
import { Sale, FuelType, PaymentStatus, Shift } from "@/types";
import { useShift } from "@/hooks/useShift";

export const createSale = async (data: {
  quantity?: number;
  unit_price: number;
  meter_start: number;
  meter_end: number;
  filling_system_id: string;
  employee_id: string;
  comments?: string;
}) => {
  // Check if we're offline
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
  console.log(`Creating sale. Offline mode: ${isOffline}`);

  if (isOffline) {
    console.log("Using offline mode for sale creation");
    
    // Calculate values
    const total_sold_liters = data.meter_end - data.meter_start;
    const total_sales = total_sold_liters * data.unit_price;
    
    // Create a mock sale with a generated ID
    const mockSale: Sale = {
      id: `offline-sale-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      fuel_type: "petrol", // Default fuel type
      quantity: total_sold_liters,
      price_per_unit: data.unit_price,
      total_sales: total_sales,
      payment_status: "pending",
      filling_system_name: "Offline Filling System",
      created_at: new Date().toISOString(),
      meter_start: data.meter_start,
      meter_end: data.meter_end,
      filling_system_id: data.filling_system_id,
      employee_id: data.employee_id,
      shift_id: `offline-shift-${Date.now()}`,
    };

    console.log("Created mock sale:", mockSale);
    
    // Store the sale in localStorage for later syncing
    try {
      const storedSales = localStorage.getItem('offline_sales') || '[]';
      const salesArray = JSON.parse(storedSales);
      salesArray.push(mockSale);
      localStorage.setItem('offline_sales', JSON.stringify(salesArray));
    } catch (e) {
      console.error("Error storing offline sale:", e);
    }
    
    return mockSale;
  }

  // Get the authenticated user and their active shift
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in to create a sale");

  // Get the active shift
  const { data: shiftData, error: shiftError } = await supabase
    .from("shifts")
    .select("*")
    .eq("employee_id", user.id)
    .eq("status", "OPEN")
    .single();

  if (shiftError)
    throw new Error(
      "No active shift found. Please start a shift before creating a sale.",
    );

  const activeShift = shiftData as Shift;

  const total_sold_liters = data.meter_end - data.meter_start;
  const total_sales = total_sold_liters * data.unit_price;

  const { data: fillingSystemData, error: fillingSystemError } = await supabase
    .from("filling_systems")
    .select(
      `
      id,
      name,
      tank:fuel_tanks (
        id,
        fuel_type,
        current_level
      )
    `,
    )
    .eq("id", data.filling_system_id)
    .single();

  if (fillingSystemError) throw fillingSystemError;
  if (!fillingSystemData?.tank)
    throw new Error("No tank found for this filling system");
  // tank is an array, so we need to access the first element
  const tankId = fillingSystemData.tank[0].id;
  const currentLevel = fillingSystemData.tank[0].current_level;
  const newLevel = currentLevel - total_sold_liters;

  if (newLevel < 0) {
    throw new Error("Insufficient fuel in tank");
  }

  const { data: sale, error } = await supabase.rpc(
    "create_sale_and_update_tank",
    {
      p_date: new Date().toISOString().split("T")[0],
      p_price_per_unit: data.unit_price,
      p_total_sales: total_sales,
      p_total_sold_liters: total_sold_liters,
      p_meter_start: data.meter_start,
      p_meter_end: data.meter_end,
      p_filling_system_id: data.filling_system_id,
      p_employee_id: data.employee_id,
      p_tank_id: tankId,
      p_previous_level: currentLevel,
      p_new_level: newLevel,
      p_change_amount: total_sold_liters,
    },
  );

  if (error) {
    console.error("Error creating sale:", error);
    throw error;
  }

  // Attach the sale to the active shift
  const { error: updateError } = await supabase
    .from("sales")
    .update({ shift_id: activeShift.id })
    .eq("id", sale.id);

  if (updateError) {
    console.error("Error attaching sale to shift:", updateError);
  }

  const existingSaleData = {
    id: sale.id,
    date: sale.date,
    fuel_type: (fillingSystemData.tank[0].fuel_type as FuelType) || "petrol",
    quantity: sale.total_sold_liters || 0,
    price_per_unit: sale.price_per_unit,
    total_sales: sale.total_sales,
    payment_status: "pending" as PaymentStatus,
    filling_system_name: fillingSystemData.name || "Unknown",
    created_at: sale.created_at,
    meter_start: sale.meter_start || 0,
    meter_end: sale.meter_end || 0,
    filling_system_id: sale.filling_system_id || "",
    employee_id: sale.employee_id || "",
    shift_id: activeShift.id,
  };

  return existingSaleData;
};
