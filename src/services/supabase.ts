
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

// Define the data models for each table
export interface Sale {
  id: string;
  date: string;
  fuel_type: FuelType;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  payment_status: PaymentStatus;
  created_at?: string;
}

export interface InventoryItem {
  id: string;
  date: string;
  fuel_type: FuelType;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  created_at?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  payment_status: PaymentStatus;
  created_at?: string;
}

export interface ProfitLoss {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  contact: string;
  hire_date: string;
  salary: number;
  created_at?: string;
}

// Base fetch functions
export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false }) as { data: Sale[] | null; error: Error | null };
    
  if (error) throw error;
  return data || [];
};

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('date', { ascending: false }) as { data: InventoryItem[] | null; error: Error | null };
    
  if (error) throw error;
  return data || [];
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false }) as { data: Expense[] | null; error: Error | null };
    
  if (error) throw error;
  return data || [];
};

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  const { data, error } = await supabase
    .from('profit_loss_summary')
    .select('*')
    .order('period', { ascending: false }) as { data: ProfitLoss[] | null; error: Error | null };
    
  if (error) throw error;
  return data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true }) as { data: Employee[] | null; error: Error | null };
    
  if (error) throw error;
  return data || [];
};
