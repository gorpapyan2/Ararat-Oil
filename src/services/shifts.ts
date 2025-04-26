import { supabase } from "@/integrations/supabase/client";
import { Shift } from "@/types";

export async function startShift(openingCash: number): Promise<Shift> {
  try {
    // Get the authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User must be logged in to start a shift");

    // Check if user exists in employees table
    const { data: existingEmployee, error: employeeCheckError } = await supabase
      .from('employees')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    // If user doesn't exist in employees table, create a new employee record
    if (employeeCheckError || !existingEmployee) {
      const { data: userProfile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        // Create an employee record for this user
        const { error: createError } = await supabase
          .from('employees')
          .insert({
            id: user.id,
            name: userProfile?.full_name || user.email || 'Unknown User',
            position: 'Staff',
            contact: userProfile?.email || user.email || '',
            salary: 0,
            hire_date: new Date().toISOString().split('T')[0],
            status: 'active'
          });

        if (createError) {
          console.error("Error creating employee record:", createError);
          throw new Error("Could not create employee record required for shift");
        }
      }
    }

    const { data, error } = await supabase
      .from('shifts')
      .insert({
        employee_id: user.id,
        opening_cash: openingCash,
        status: 'OPEN',
        start_time: new Date().toISOString(),
        sales_total: 0
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

export async function closeShift(shiftId: string, closingCash: number): Promise<Shift> {
  try {
    // First, get the current sales total for this shift
    const { data: salesData, error: salesError } = await supabase
      .from('sales')
      .select('total_sales')
      .eq('shift_id', shiftId);
      
    if (salesError) throw salesError;
    
    // Calculate the total sales amount
    const salesTotal = salesData?.reduce((sum, sale) => sum + (sale.total_sales || 0), 0) || 0;
    
    // Now update the shift with the closing details and sales total
    const { data, error } = await supabase
      .from('shifts')
      .update({
        closing_cash: closingCash,
        end_time: new Date().toISOString(),
        status: 'CLOSED',
        sales_total: salesTotal
      })
      .eq('id', shiftId)
      .select()
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Failed to close shift");
    return data as Shift;
  } catch (error) {
    console.error("Error in closeShift:", error);
    throw error;
  }
}

export async function getActiveShift(employeeId: string): Promise<Shift | null> {
  try {
    if (!employeeId) {
      console.warn("getActiveShift called with no employeeId");
      return null;
    }
    
    const { data, error } = await supabase
      .from('shifts')
      .select()
      .eq('employee_id', employeeId)
      .eq('status', 'OPEN')
      .maybeSingle();

    if (error) {
      console.error("Error fetching active shift:", error);
      return null;
    }
    
    return data as Shift;
  } catch (error) {
    console.error("Exception in getActiveShift:", error);
    return null;
  }
}
