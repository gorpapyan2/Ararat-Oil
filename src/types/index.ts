
// Basic entity types
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface Employee {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: EmployeeStatus;
  created_at?: string;
}

export type FuelType = 'petrol' | 'diesel' | 'gas' | 'kerosene' | 'cng';

export interface FuelTank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type: FuelType;
  created_at?: string;
}

export interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
  tank?: FuelTank;
  created_at?: string;
}

export interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

// Transaction related types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';

export interface Transaction {
  id: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference?: string;
  employee_id: string;
  sale_id?: string;
  entity_id?: string;
  entity_type?: 'sale' | 'expense' | 'fuel_supply';
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Sales related
export interface Sale {
  id: string;
  date: string;
  fuel_type: FuelType;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  payment_status: PaymentStatus;
  filling_system_name: string;
  created_at?: string;
  meter_start: number;
  meter_end: number;
  filling_system_id: string;
  employee_id: string;
  shift_id?: string;
}

// Expense related
export type ExpenseCategory = 
  'utilities' | 
  'rent' | 
  'salaries' | 
  'maintenance' | 
  'supplies' | 
  'taxes' | 
  'insurance' | 
  'other';

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  invoice_number?: string;
  notes?: string;
  created_at?: string;
}

// Inventory related
export interface InventoryItem {
  id: string;
  date: string;
  fuel_type: FuelType;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  tank_id?: string;
  created_at?: string;
}

// Fuel supply related
export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  employee_id: string;
  comments?: string;
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  created_at?: string;
  
  // Join fields
  provider?: PetrolProvider;
  tank?: FuelTank;
  employee?: Employee;
}

// Financial reports
export interface ProfitLoss {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at?: string;
}

// Shift type
export interface Shift {
  id: string;
  employee_id: string;
  start_time: string;
  end_time?: string;
  opening_cash: number;
  closing_cash?: number;
  sales_total: number;
  status: 'OPEN' | 'CLOSED';
  created_at?: string;
  updated_at?: string;
}

// Tank level change record type
export interface TankLevelChange {
  id: string;
  tank_id: string;
  change_amount: number;
  previous_level: number;
  new_level: number;
  change_type: 'add' | 'subtract';
  created_at?: string;
}
