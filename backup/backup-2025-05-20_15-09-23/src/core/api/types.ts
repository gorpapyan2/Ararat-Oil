/**
 * API Types
 * 
 * This file contains type definitions for the API client.
 */

// Fuel Supply Types
export interface FuelSupply {
  id: string;
  supplier_id: string;
  fuel_type_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  delivery_date: string;
  invoice_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FuelSupplyCreate {
  supplier_id: string;
  fuel_type_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  delivery_date: string;
  invoice_number?: string;
  notes?: string;
}

export interface FuelSupplyUpdate {
  supplier_id?: string;
  fuel_type_id?: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  delivery_date?: string;
  invoice_number?: string;
  notes?: string;
}

// Shift Types
export interface Shift {
  id: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  opening_cash: number;
  closing_cash?: number;
  employee_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ShiftPaymentMethod {
  id: string;
  shift_id: string;
  payment_method: string;
  amount: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Tank Types
export interface Tank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface TankCreate {
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export interface TankUpdate {
  name?: string;
  capacity?: number;
  current_level?: number;
  fuel_type_id?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

// Fuel Type Types
export interface FuelType {
  id: string;
  name: string;
  color: string;
  price_per_liter: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface FuelTypeCreate {
  name: string;
  color: string;
  price_per_liter: number;
  status: 'active' | 'inactive';
}

export interface FuelTypeUpdate {
  name?: string;
  color?: string;
  price_per_liter?: number;
  status?: 'active' | 'inactive';
}

// Filling System Types
export interface FillingSystem {
  id: string;
  name: string;
  location: string;
  tank_ids: string[];
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface FillingSystemCreate {
  name: string;
  location: string;
  tank_ids: string[];
  status: 'active' | 'inactive' | 'maintenance';
}

export interface FillingSystemUpdate {
  name?: string;
  location?: string;
  tank_ids?: string[];
  status?: 'active' | 'inactive' | 'maintenance';
}

// Transaction Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  entity_type: string;
  entity_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Employee Types
export interface Employee {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: 'active' | 'inactive' | 'on_leave' | string;
  department?: string;
  created_at: string;
  updated_at: string;
}

// Sales Types
export interface Sale {
  id: string;
  filling_system_id: string;
  fuel_type_id: string;
  quantity: number;
  price_per_liter: number;
  total_price: number;
  payment_method: string;
  employee_id: string;
  shift_id?: string;
  created_at: string;
  updated_at: string;
}

// Expense Types
export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  payment_status: 'paid' | 'pending' | 'cancelled';
  payment_date?: string;
  receipt_number?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Dashboard Types
export interface DashboardData {
  fuel_levels: Record<string, number>;
  recent_sales: Sale[];
  revenue_summary: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  inventory_status: {
    total_capacity: number;
    current_level: number;
    percentage: number;
  };
}

// Fuel Price Types
export interface FuelPrice {
  id: string;
  fuel_type: string;
  fuel_type_id?: string;
  price_per_liter: number;
  effective_date: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

// Financial Types
export interface ProfitLoss {
  id: string;
  period: string;
  revenue: number;
  expenses: number;
  profit: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface RevenueData {
  total: number;
  breakdown: Record<string, number>;
  trend?: Array<{
    date: string;
    value: number;
  }>;
}

export interface ExpensesData {
  total: number;
  breakdown: Record<string, number>;
  trend?: Array<{
    date: string;
    value: number;
  }>;
}

export interface FinancialDashboard {
  revenue: {
    total: number;
    trend: Array<{
      date: string;
      value: number;
    }>;
  };
  expenses: {
    total: number;
    trend: Array<{
      date: string;
      value: number;
    }>;
  };
  profit: {
    total: number;
    trend: Array<{
      date: string;
      value: number;
    }>;
  };
}

// Petrol Provider Types
export interface PetrolProvider {
  id: string;
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface PetrolProviderCreate {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

export interface PetrolProviderUpdate {
  name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  status?: 'active' | 'inactive';
} 