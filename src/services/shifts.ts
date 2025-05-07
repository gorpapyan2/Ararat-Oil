import { supabase } from "@/services/supabase";
import { Shift } from "@/types";
import { addShiftPaymentMethods, deleteShiftPaymentMethods } from "./shiftPaymentMethods";
import { PaymentMethodItem } from "@/components/shared/MultiPaymentMethodFormStandardized";

export async function startShift(openingCash: number): Promise<Shift> {
  try {
    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Starting shift. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for shift creation");
      
      // Create a mock shift
      const mockShift: Shift = {
        id: `offline-shift-${Date.now()}`,
        employee_id: "offline-user",
        opening_cash: openingCash,
        status: "OPEN",
        start_time: new Date().toISOString(),
        sales_total: 0,
        created_at: new Date().toISOString()
      };

      console.log("Created mock shift:", mockShift);
      return mockShift;
    }

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in to start a shift");

    // Check if user exists in employees table
    const { data: existingEmployee, error: employeeCheckError } = await supabase
      .from("employees")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    // If user doesn't exist in employees table, create a new employee record
    if (employeeCheckError || !existingEmployee) {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        // Create an employee record for this user
        const { error: createError } = await supabase.from("employees").insert({
          id: user.id,
          name: userProfile?.full_name || user.email || "Unknown User",
          position: "Staff",
          contact: userProfile?.email || user.email || "",
          salary: 0,
          hire_date: new Date().toISOString().split("T")[0],
          status: "active",
        });

        if (createError) {
          console.error("Error creating employee record:", createError);
          throw new Error(
            "Could not create employee record required for shift",
          );
        }
      }
    }

    const { data, error } = await supabase
      .from("shifts")
      .insert({
        employee_id: user.id,
        opening_cash: openingCash,
        status: "OPEN",
        start_time: new Date().toISOString(),
        sales_total: 0,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Failed to create shift");
    return data as Shift;
  } catch (error) {
    console.error("Error in startShift:", error);
    throw error;
  }
}

export async function closeShift(
  shiftId: string,
  closingCash: number,
  paymentMethods: PaymentMethodItem[] = [],
): Promise<Shift> {
  try {
    // Validate inputs
    if (!shiftId || typeof shiftId !== 'string' || shiftId.trim() === '') {
      const error = new Error("Invalid shift ID provided for closing");
      console.error(error);
      throw error;
    }

    if (typeof closingCash !== 'number' || isNaN(closingCash) || closingCash < 0) {
      const error = new Error(`Invalid closing cash amount: ${closingCash}`);
      console.error(error);
      throw error;
    }

    // Validate paymentMethods if provided
    if (paymentMethods && paymentMethods.length > 0) {
      const invalid = paymentMethods.some(
        method => !method.payment_method || 
                  typeof method.amount !== 'number' || 
                  isNaN(method.amount) || 
                  method.amount <= 0
      );
      
      if (invalid) {
        const error = new Error("One or more payment methods are invalid");
        console.error("Invalid payment methods:", paymentMethods);
        throw error;
      }
      
      console.log(`Closing shift with ${paymentMethods.length} payment methods`);
    }

    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Closing shift ${shiftId}. Offline mode: ${isOffline}`);

    if (isOffline) {
      console.log("Using offline mode for shift closing");
      
      // Create a mock closed shift response
      const mockClosedShift: Shift = {
        id: shiftId,
        employee_id: "offline-user",
        start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        end_time: new Date().toISOString(),
        opening_cash: 0, // We don't know the original opening cash in offline mode
        closing_cash: closingCash,
        sales_total: paymentMethods.reduce((sum, method) => sum + method.amount, 0),
        status: "CLOSED",
        created_at: new Date(Date.now() - 3600000).toISOString(),
      };

      console.log("Created mock closed shift:", mockClosedShift);
      return mockClosedShift;
    }

    // First, verify shift exists
    const { data: shiftData, error: shiftError } = await supabase
      .from("shifts")
      .select("*")
      .eq("id", shiftId)
      .single();
      
    if (shiftError) {
      console.error("Error verifying shift exists:", shiftError);
      throw new Error(`Failed to verify shift: ${shiftError.message}`);
    }
    
    if (!shiftData) {
      const error = new Error(`Shift with ID ${shiftId} not found`);
      console.error(error);
      throw error;
    }
    
    if (shiftData.status === "CLOSED") {
      const error = new Error(`Shift with ID ${shiftId} is already closed`);
      console.error(error);
      throw error;
    }

    console.log(`Found active shift: ${shiftId}, calculating sales total...`);

    // Get the current sales total for this shift
    const { data: salesData, error: salesError } = await supabase
      .from("sales")
      .select("total_sales")
      .eq("shift_id", shiftId);

    if (salesError) {
      console.error("Error fetching sales data:", salesError);
      throw new Error(`Failed to fetch sales data: ${salesError.message}`);
    }

    // Calculate the total sales amount
    const salesTotal =
      salesData?.reduce((sum, sale) => sum + (sale.total_sales || 0), 0) || 0;
      
    console.log(`Calculated sales total: ${salesTotal} for shift: ${shiftId}`);

    // If payment methods were provided, save them
    if (paymentMethods.length > 0) {
      console.log(`Processing ${paymentMethods.length} payment methods...`);
      try {
        // First, delete any existing payment methods for this shift (in case of retry)
        await deleteShiftPaymentMethods(shiftId);
        
        // Then add the new payment methods
        await addShiftPaymentMethods(shiftId, paymentMethods);
        console.log("Payment methods successfully added");
      } catch (paymentError) {
        console.error("Error managing payment methods:", paymentError);
        throw new Error(`Failed to save payment methods: ${paymentError.message}`);
      }
    }

    console.log(`Updating shift status to CLOSED for shift: ${shiftId}`);

    // Now update the shift with the closing details and sales total
    const { data, error } = await supabase
      .from("shifts")
      .update({
        closing_cash: closingCash,
        end_time: new Date().toISOString(),
        status: "CLOSED",
        sales_total: salesTotal,
      })
      .eq("id", shiftId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating shift status:", error);
      throw new Error(`Failed to close shift: ${error.message}`);
    }
    
    if (!data) {
      const error = new Error("No data returned after closing shift");
      console.error(error);
      throw error;
    }
    
    console.log("Shift successfully closed:", data);
    return data as Shift;
  } catch (error) {
    console.error("Error in closeShift:", error);
    throw error;
  }
}

export async function getActiveShift(
  employeeId: string,
): Promise<Shift | null> {
  try {
    if (!employeeId) {
      console.warn("getActiveShift called with no employeeId");
      return null;
    }

    // Check if we're offline
    const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
    console.log(`Getting active shift for ${employeeId}. Offline mode: ${isOffline}`);

    // If we're in offline mode and have an active shift in localStorage, use that
    if (isOffline) {
      console.log("Using offline mode for getting active shift");
      const storedShift = localStorage.getItem('active_shift');
      
      if (storedShift) {
        try {
          const parsedShift = JSON.parse(storedShift);
          console.log("Found stored active shift:", parsedShift);
          return parsedShift;
        } catch (e) {
          console.error("Error parsing stored shift:", e);
        }
      }
      
      // We don't have a stored shift, create a mock one
      const mockShift: Shift = {
        id: `offline-shift-${Date.now()}`,
        employee_id: employeeId,
        opening_cash: 0,
        status: "OPEN",
        start_time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        sales_total: 0,
        created_at: new Date(Date.now() - 3600000).toISOString()
      };
      
      // Store this shift for future offline use
      localStorage.setItem('active_shift', JSON.stringify(mockShift));
      console.log("Created mock active shift:", mockShift);
      return mockShift;
    }

    const { data, error } = await supabase
      .from("shifts")
      .select()
      .eq("employee_id", employeeId)
      .eq("status", "OPEN")
      .maybeSingle();

    if (error) {
      console.error("Error fetching active shift:", error);
      return null;
    }

    // If we found an active shift and we're online, store it for offline use
    if (data) {
      localStorage.setItem('active_shift', JSON.stringify(data));
    } else {
      // If there's no active shift, clear any stored shift
      localStorage.removeItem('active_shift');
    }

    return data as Shift;
  } catch (error) {
    console.error("Exception in getActiveShift:", error);
    return null;
  }
}
