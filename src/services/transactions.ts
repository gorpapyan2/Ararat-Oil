
import { supabase } from "@/integrations/supabase/client";
import { Transaction, PaymentMethod, PaymentStatus } from "@/types";

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      employee:employees(name),
      sale:sales(filling_system_name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map(item => ({
    id: item.id,
    sale_id: item.sale_id,
    amount: item.amount,
    payment_method: item.payment_method,
    payment_reference: item.payment_reference,
    payment_status: item.payment_status,
    employee_id: item.employee_id,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
};

export const createTransaction = async (transaction: Partial<Transaction>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transaction)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateTransaction = async (
  id: string, 
  updates: Partial<Transaction>
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return data;
};
