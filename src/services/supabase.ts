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
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

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
  status: EmployeeStatus;
  created_at?: string;
}

export interface FuelTank {
  id: string;
  name: string;
  fuel_type: FuelType;
  capacity: number;
  current_level: number;
  created_at?: string | null;
}

export interface TankLevelChange {
  id: string;
  tank_id: string;
  change_amount: number;
  previous_level: number;
  new_level: number;
  change_type: 'add' | 'subtract';
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
    fuel_type: item.fuel_type as FuelType,
    current_level: typeof item.current_level === 'number' ? item.current_level : 0
  }));
};

export const createFuelTank = async (tank: Omit<FuelTank, 'id' | 'created_at'>): Promise<FuelTank> => {
  const { data, error } = await supabase
    .from('fuel_tanks')
    .insert([tank])
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    ...data,
    fuel_type: data.fuel_type as FuelType,
    current_level: typeof data.current_level === 'number' ? data.current_level : 0
  };
};

export interface TankLevelUpdateParams {
  tankId: string;
  changeAmount: number;
  previousLevel: number;
  newLevel: number;
  changeType: 'add' | 'subtract';
}

export const updateTankLevel = async (params: TankLevelUpdateParams): Promise<FuelTank> => {
  const { tankId, changeAmount, previousLevel, newLevel, changeType } = params;
  
  // First update the tank's current level
  const { data: tankData, error: tankError } = await supabase
    .from('fuel_tanks')
    .update({ current_level: newLevel })
    .eq('id', tankId)
    .select()
    .single();
    
  if (tankError) throw tankError;
  
  // Then record the change in the tank_level_changes table
  // Using RPC call to record tank level change
  const { error: changeError } = await supabase
    .rpc('record_tank_level_change', {
      p_tank_id: tankId,
      p_change_amount: Math.abs(changeAmount),
      p_previous_level: previousLevel,
      p_new_level: newLevel,
      p_change_type: changeType
    });
    
  if (changeError) {
    console.error("Error recording tank level change:", changeError);
  }
  
  return {
    ...tankData,
    fuel_type: tankData.fuel_type as FuelType,
    current_level: typeof tankData.current_level === 'number' ? tankData.current_level : 0
  };
};

export const fetchTankLevelChanges = async (tankId: string): Promise<TankLevelChange[]> => {
  const { data, error } = await supabase
    .from('tank_level_changes')
    .select('*')
    .eq('tank_id', tankId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return (data || []).map(item => ({
    id: item.id,
    tank_id: item.tank_id,
    change_amount: item.change_amount,
    previous_level: item.previous_level,
    new_level: item.new_level,
    change_type: item.change_type as 'add' | 'subtract',
    created_at: item.created_at
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
  
  return (data || []).map(record => ({
    ...record,
    tank: record.tank ? {
      ...record.tank,
      fuel_type: record.tank.fuel_type as FuelType,
      current_level: typeof record.tank.current_level === 'number' ? record.tank.current_level : 0
    } : undefined,
    employee: record.employee
  }));
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

export const createEmployee = async (employee: Omit<Employee, 'id' | 'created_at'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([employee])
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const updateEmployee = async (id: string, employee: Partial<Employee>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update(employee)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
};
