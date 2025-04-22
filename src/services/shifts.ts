
import { supabase } from "@/integrations/supabase/client";
import { Shift } from "@/types";
import { useAuth } from "@/hooks/useAuth";

export async function startShift(openingCash: number): Promise<Shift> {
  const { user } = useAuth();
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
  return data;
}

export async function closeShift(shiftId: string, closingCash: number): Promise<Shift> {
  const { data, error } = await supabase
    .from('shifts')
    .update({
      closing_cash: closingCash,
      end_time: new Date().toISOString(),
      status: 'CLOSED'
    })
    .eq('id', shiftId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getActiveShift(employeeId: string): Promise<Shift | null> {
  const { data, error } = await supabase
    .from('shifts')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'OPEN')
    .single();

  if (error) return null;
  return data;
}
