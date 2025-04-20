
import { supabase } from "@/integrations/supabase/client";
import { Expense, ExpenseCategory, PaymentStatus } from "@/types";

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    category: item.category as ExpenseCategory,
    payment_status: item.payment_status as PaymentStatus
  }));
};
