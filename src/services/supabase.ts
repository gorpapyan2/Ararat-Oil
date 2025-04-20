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

export interface FuelTank {
  id: string;
  name: string;
  fuel_type: FuelType;
  capacity: number;
  created_at?: string;
}

export interface DailyInventoryRecord {
  id: string;
  tank_id: string;
  date: string;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  employee_id?: string;
  created_at?: string;
  tank?: FuelTank;
  employee?: Employee;
}

// Refactored fetch functions with proper typing
export const fetchSales = async (): Promise<Sale[]> => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  // Cast the data to ensure it matches our defined types
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType,
    payment_status: item.payment_status as PaymentStatus
  }));
};

export const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  // Cast the data to ensure it matches our defined types
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType
  }));
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
    
  if (error) throw error;
  
  // Cast the data to ensure it matches our defined types
  return (data || []).map(item => ({
    ...item,
    category: item.category as ExpenseCategory,
    payment_status: item.payment_status as PaymentStatus
  }));
};

export const fetchProfitLoss = async (): Promise<ProfitLoss[]> => {
  const { data, error } = await supabase
    .from('profit_loss_summary')
    .select('*')
    .order('period', { ascending: false });
    
  if (error) throw error;
  return data || [];
};

export const fetchEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  return data || [];
};

export const fetchFuelTanks = async (): Promise<FuelTank[]> => {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .select('*')
    .order('name', { ascending: true });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    ...item,
    fuel_type: item.fuel_type as FuelType
  }));
};

export const fetchDailyInventoryRecords = async (date?: string): Promise<DailyInventoryRecord[]> => {
  let query = supabase
    .from('daily_inventory_records')
    .select(`
      *,
      tank:fuel_tanks(*),
      employee:employees(*)
    `)
    .order('date', { ascending: false });
    
  if (date) {
    query = query.eq('date', date);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data || [];
};

export const createDailyInventoryRecord = async (record: Omit<DailyInventoryRecord, 'id' | 'created_at'>): Promise<DailyInventoryRecord> => {
  const { data, error } = await supabase
    .from('daily_inventory_records')
    .insert([record])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};
