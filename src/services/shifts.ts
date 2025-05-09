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

    // First check if there are any active shifts in the system
    const { data: existingShifts, error: shiftCheckError } = await supabase
      .from("shifts")
      .select("id, employee_id")
      .eq("status", "OPEN");

    if (shiftCheckError) {
      console.error("Error checking for existing shifts:", shiftCheckError);
      // We'll proceed with caution, but log this error
    } else if (existingShifts && existingShifts.length > 0) {
      // There's at least one active shift
      const userShift = existingShifts.find(shift => shift.employee_id === user.id);
      
      if (userShift) {
        throw new Error("You already have an active shift open. Please close it before starting a new one.");
      } else {
        throw new Error("Another employee has an active shift open. Only one shift can be active at a time.");
      }
    }

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
  paymentMethods?: PaymentMethodItem[]
): Promise<Shift> {
  try {
    // Check network connectivity
    if (!navigator.onLine) {
      throw new Error("Cannot close shift while offline");
    }

    // First update the shift status
    const { data: updatedShift, error: updateError } = await supabase
      .from("shifts")
      .update({
        status: "CLOSED",
        end_time: new Date().toISOString(),
        closing_cash: closingCash,
      })
      .eq("id", shiftId)
      .select()
      .single();

    if (updateError) {
      console.error("Error closing shift:", updateError);
      throw new Error(updateError.message || "Failed to close shift");
    }

    if (!updatedShift) {
      throw new Error("No shift data returned after update");
    }
    
    // Then add payment methods if provided
    if (paymentMethods && paymentMethods.length > 0) {
      const paymentData = paymentMethods.map((method) => ({
        shift_id: shiftId,
        payment_method: method.payment_method,
        amount: method.amount,
        reference: method.reference || "",
      }));

      // Insert payment methods
      const { error: paymentError } = await supabase
        .from("shift_payment_methods")
        .insert(paymentData);

      if (paymentError) {
        console.error("Error adding payment methods:", paymentError);
        // Don't fail the entire operation if payment methods fail
        // Just log the error and continue
      }
    }

    // Clear the cached active shift to avoid conflicts
    try {
      // Get the user ID in a type-safe way
      const userId = (updatedShift as any).user_id;
      if (userId) {
        localStorage.removeItem(`activeShift_${userId}`);
      }
    } catch (e) {
      console.warn("Error clearing shift cache:", e);
      // Non-critical error, continue
    }

    return updatedShift as Shift;
  } catch (error: any) {
    console.error("Error in closeShift service:", error);
    
    // Check if it's a network error
    if (error.message?.includes("Failed to fetch") || 
        !navigator.onLine || 
        error.message?.includes("offline")) {
      throw new Error("Network error: Cannot close shift while offline");
    }
    
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
