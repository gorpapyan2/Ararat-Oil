import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseCategory, PaymentStatus } from "@/types";

export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching expenses:', error);
      throw error;
    }
  
    return (data || []).map(item => ({
      ...item,
      category: item.category as ExpenseCategory,
      payment_status: item.payment_status as PaymentStatus
    }));
  } catch (err: any) {
    console.error('Failed to fetch expenses:', err);
    throw new Error(err.message || 'Failed to fetch expenses data');
  }
};
