
import { supabase } from "@/integrations/supabase/client";

// Types
export type FuelType = 'Petrol' | 'Diesel' | 'Gas';
export type PaymentStatus = 'Paid' | 'Pending';
export type ExpenseCategory = 
  | 'Rent' 
  | 'Utilities' 
  | 'Salaries' 
  | 'Maintenance' 
  | 'Supplies' 
  | 'Marketing' 
  | 'Insurance' 
  | 'Taxes' 
  | 'Other';

// Base fetch functions
export const fetchSales = async () => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchInventory = async () => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchProfitLoss = async () => {
  const { data, error } = await supabase
    .from('profit_loss_summary')
    .select('*')
    .order('period', { ascending: false });
    
  if (error) throw error;
  return data;
};

export const fetchEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data;
};
