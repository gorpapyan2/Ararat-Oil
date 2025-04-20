export type FuelType = 'Petrol' | 'Diesel' | 'Gas';
export type PaymentStatus = 'Paid' | 'Pending';
export type PaymentMethod = "Cash" | "Credit Card" | "Bank Transfer" | "Mobile" | "Other";
export type ExpenseCategory =
  | 'Rent' 
  | 'Utilities' 
  | 'Salaries' 
  | 'Maintenance' 
  | 'Supplies' 
  | 'Marketing' 
  | 'Insurance' 
  | 'Taxes'
  | 'Travel'
  | 'Fuel'
  | 'Other';
export type EmployeeStatus = 'active' | 'on_leave' | 'terminated';

export interface Sale {
  id: string;
  date: string;
  fuel_type: FuelType;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  payment_status?: PaymentStatus;
  filling_system_name?: string;
  created_at?: string;
  meter_start: number;
  meter_end: number;
  filling_system_id: string;
  employee_id: string;
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
  payment_method?: PaymentMethod;
  invoice_number?: string;
  notes?: string;
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

export interface FillingSystem {
  id: string;
  name: string;
  tank_id?: string;
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

export interface DailyInventoryRecord {
  id: string;
  filling_system_id: string;
  tank_id?: string;
  provider_id?: string;
  date: string;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  total_price: number;
  employee_id?: string;
  created_at?: string;
  last_refill_date?: string;
  filling_system?: FillingSystem;
  tank?: FuelTank;
  provider?: PetrolProvider;
  employee?: Employee;
}

export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  employee_id: string;
  comments?: string;
  total_cost: number;
  created_at?: string;
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: FuelType;
  };
  employee?: {
    id: string;
    name: string;
  };
}
