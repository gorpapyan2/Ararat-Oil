
import { supabase } from "@/integrations/supabase/client";
import { Shift } from "@/types";

export async function startShift(openingCash: number): Promise<Shift> {
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in to start a shift");

  // Check if user exists in employees table
  const { data: existingEmployee, error: employeeCheckError } = await supabase
    .from('employees')
    .select('id')
    .eq('id', user.id)
    .single();

  // If user doesn't exist in employees table, create a new employee record
  if (employeeCheckError && !existingEmployee) {
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

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
      status: 'OPEN'
    })
    .select()
    .single();

  if (error) throw error;
  return data as Shift;
}

export async function closeShift(shiftId: string, closingCash: number): Promise<Shift> {
  // First, get the current sales total for this shift
  const { data: salesData, error: salesError } = await supabase
    .from('sales')
    .select('total_sales')
    .eq('shift_id', shiftId);
    
  if (salesError) throw salesError;
  
  // Calculate the total sales amount
  const salesTotal = salesData.reduce((sum, sale) => sum + (sale.total_sales || 0), 0);
  
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
    .single();

  if (error) throw error;
  return data as Shift;
}

export async function getActiveShift(employeeId: string): Promise<Shift | null> {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'OPEN')
    .single();

  if (error) return null;
  return data as Shift;
}
