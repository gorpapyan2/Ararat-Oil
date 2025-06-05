/**
 * API Types
 *
 * This file contains type definitions for the API client.
 */

import type { Tank, TankCreate, TankUpdate, TankLevelChange, FuelType } from "@/shared/types/tank.types";

// Export tank types for backward compatibility
export type { Tank, TankCreate, TankUpdate, TankLevelChange, FuelType };

// Backward compatibility alias
export type FuelTank = Tank;

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
  employees?: ShiftEmployee[];
  created_at: string;
  updated_at: string;
}

export interface ShiftEmployee {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_position: string;
  employee_status: string;
  created_at: string;
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

// New types for shift creation with multiple employees
export interface ShiftCreateRequest {
  opening_cash: number;
  employee_ids?: string[];
}

export interface ShiftCloseRequest {
  closing_cash: number;
  payment_methods?: ShiftPaymentMethod[];
}

// Fuel Type Types - Base interface imported from shared/types/tank.types
// Only keeping create/update interfaces here

export interface FuelTypeCreate {
  name: string;
  code?: string;
  description?: string;
}

export interface FuelTypeUpdate {
  name?: string;
  code?: string;
  description?: string;
}

// Filling System Types
export interface FillingSystem {
  id: string;
  name: string;
  location: string;
  tank_ids: string[];
  status: "active" | "inactive" | "maintenance";
  created_at: string;
  updated_at: string;
}

export interface FillingSystemCreate {
  name: string;
  location: string;
  tank_ids: string[];
  status: "active" | "inactive" | "maintenance";
}

export interface FillingSystemUpdate {
  name?: string;
  location?: string;
  tank_ids?: string[];
  status?: "active" | "inactive" | "maintenance";
}

// Transaction Types
export interface Transaction {
  id: string;
  type: "income" | "expense";
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
  status: "active" | "inactive" | "on_leave" | string;
  department?: string;
  created_at: string;
  updated_at: string;
}

// Sales Types
export interface Sale {
  id: string;
  filling_system_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  sale_date: string;
  created_at: string;
  updated_at: string;
}

export interface SaleCreate {
  filling_system_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  sale_date: string;
}

export interface SaleUpdate {
  filling_system_id?: string;
  quantity_liters?: number;
  price_per_liter?: number;
  total_amount?: number;
  sale_date?: string;
}

// Expense Types
export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  payment_status: "paid" | "pending" | "cancelled";
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
  contact_info?: string;
  rating?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PetrolProviderCreate {
  name: string;
  contact_info?: string;
  rating?: number;
  is_active: boolean;
}

export interface PetrolProviderUpdate {
  name?: string;
  contact_info?: string;
  rating?: number;
  is_active?: boolean;
}

// Type aliases for backward compatibility and consistency
export type CreateProviderRequest = PetrolProviderCreate;
export type UpdateProviderRequest = PetrolProviderUpdate;

// Employee type aliases
export type EmployeeCreate = Omit<Employee, "id" | "created_at" | "updated_at">;
export type EmployeeUpdate = Partial<EmployeeCreate>;

// Fuel Price type aliases  
export type FuelPriceCreate = {
  fuel_type: string;
  price_per_liter: number;
  effective_date: string;
};
export type FuelPriceUpdate = Partial<FuelPriceCreate>;

// Filling System type aliases
export type fillingsApi = any; // Placeholder for filling systems API

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface QueryParams {
  limit?: number;
  offset?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface ApiResult<T> {
  data?: T;
  error?: string;
  status?: number;
}
