import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Helper function to ensure consistent error handling and response parsing
 * for Supabase queries
 */
export async function safeQuery<T>(
  query: Promise<PostgrestSingleResponse<T>>,
  errorMessage = 'Database query failed'
): Promise<T | null> {
  try {
    const { data, error } = await query;
    
    if (error) {
      console.error(`${errorMessage}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Exception in ${errorMessage}:`, err);
    return null;
  }
}

/**
 * Safely fetch a user's employee record by user ID
 */
export async function fetchEmployeeByUserId(userId: string) {
  if (!userId) return null;
  
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('id, name')
      .eq('id', userId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching employee record:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Exception in fetching employee record:', err);
    return null;
  }
}

/**
 * Safely fetch an active shift for an employee
 */
export async function fetchActiveShift(employeeId: string) {
  if (!employeeId) return null;
  
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select()
      .eq('employee_id', employeeId)
      .eq('status', 'OPEN')
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching active shift:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in fetching active shift:', error);
    return null;
  }
}

/**
 * Safely fetch recent shift history for an employee
 */
export async function fetchShiftHistory(employeeId: string, limit = 10) {
  if (!employeeId) return [];
  
  try {
    const { data, error } = await supabase
      .from('shifts')
      .select()
      .eq('employee_id', employeeId)
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      console.error('Error fetching shift history:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in fetching shift history:', err);
    return [];
  }
}
