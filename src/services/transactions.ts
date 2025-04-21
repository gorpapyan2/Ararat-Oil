
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
    payment_method: item.payment_method as PaymentMethod,
    payment_reference: item.payment_reference,
    payment_status: item.payment_status as PaymentStatus,
    employee_id: item.employee_id,
    description: item.description || '',
    entity_type: item.entity_type as 'sale' | 'expense' | 'fuel_supply' || null,
    entity_id: item.entity_id || null,
    created_at: item.created_at,
    updated_at: item.updated_at,
    // Add these optional properties if they exist in the result
    ...(item.employee && { employee: item.employee }),
    ...(item.sale && { sale: item.sale }),
  }));
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      sale_id: transaction.sale_id,
      amount: transaction.amount,
      payment_method: transaction.payment_method,
      payment_reference: transaction.payment_reference,
      payment_status: transaction.payment_status,
      employee_id: transaction.employee_id,
      description: transaction.description,
      entity_type: transaction.entity_type,
      entity_id: transaction.entity_id
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    sale_id: data.sale_id,
    amount: data.amount,
    payment_method: data.payment_method as PaymentMethod,
    payment_reference: data.payment_reference,
    payment_status: data.payment_status as PaymentStatus,
    employee_id: data.employee_id,
    description: data.description || '',
    entity_type: data.entity_type as 'sale' | 'expense' | 'fuel_supply' || null,
    entity_id: data.entity_id || null,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const updateTransaction = async (
  id: string, 
  updates: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
): Promise<Transaction> => {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;

  return {
    id: data.id,
    sale_id: data.sale_id,
    amount: data.amount,
    payment_method: data.payment_method as PaymentMethod,
    payment_reference: data.payment_reference,
    payment_status: data.payment_status as PaymentStatus,
    employee_id: data.employee_id,
    description: data.description || '',
    entity_type: data.entity_type as 'sale' | 'expense' | 'fuel_supply' || null,
    entity_id: data.entity_id || null,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
