
import { supabase } from "@/integrations/supabase/client";
import { Shift } from "@/types";

export async function startShift(openingCash: number): Promise<Shift> {
  // Get the authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User must be logged in to start a shift");

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
