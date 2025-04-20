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

export interface FillingSystem {
  id: string;
  name: string;
  tank_id?: string;
  tank?: FuelTank;
  created_at?: string;
}

export interface DailyInventoryRecord {
  id: string;
  filling_system_id: string;
  date: string;
  opening_stock: number;
  received: number;
  sold: number;
  closing_stock: number;
  unit_price: number;
  employee_id?: string;
  created_at?: string;
  filling_system?: FillingSystem;
  employee?: Employee;
}
