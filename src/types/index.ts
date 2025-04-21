// Payment related types
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

// Employee related types
export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

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

// Expense related types
export type ExpenseCategory = 'utilities' | 'rent' | 'salaries' | 'maintenance' | 'supplies' | 'fuel' | 'other';

export interface Expense {
  id: string;
  date: string;
  description: string;
  category: ExpenseCategory;
  amount: number;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  invoice_number?: string;
  notes?: string;
  created_at?: string;
}

// Fuel related types
export type FuelType = 'diesel' | 'gasoline' | 'premium' | 'cng' | 'petrol';

export interface FuelTank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type: FuelType;
  created_at?: string;
}

export interface TankLevelChange {
  id: string;
  tank_id: string;
  previous_level: number;
  new_level: number;
  change_amount: number;
  change_type: 'add' | 'subtract';
  created_at?: string;
}

export interface FillingSystem {
  id: string;
  name: string;
  tank_id: string;
  tank?: FuelTank;
  created_at?: string;
}

// Supply related types
export interface PetrolProvider {
  id: string;
  name: string;
  contact: string;
  created_at?: string;
  updated_at?: string;
}

export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  provider?: PetrolProvider;
  tank_id: string;
  tank?: FuelTank;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  employee_id: string;
  employee?: Employee;
  comments?: string;
  payment_status: PaymentStatus;
  payment_method?: PaymentMethod;
  created_at?: string;
}

// Sales related types
export interface Sale {
  id: string;
  date: string;
  filling_system_id: string;
  filling_system_name?: string;
  fuel_type?: FuelType;
  price_per_unit: number;
  quantity: number;
  total_sales: number;
  meter_start?: number;
  meter_end?: number;
  employee_id?: string;
  payment_status?: PaymentStatus;
  created_at?: string;
}

// Inventory related types
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

// Financial related types
export interface ProfitLoss {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at?: string;
}

// Transaction related interfaces
export interface Transaction {
  id: string;
  sale_id?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  payment_status: PaymentStatus;
  employee_id: string;
  description?: string; // Added for better invoice details
  entity_type?: 'sale' | 'expense' | 'fuel_supply'; // To track transaction source
  entity_id?: string; // Generic ID for the source entity
  created_at?: string;
  updated_at?: string;
}
