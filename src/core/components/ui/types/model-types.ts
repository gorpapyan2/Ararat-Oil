/**
 * Type definitions for model/domain entities
 * This file centralizes entity type definitions to improve type safety across the application
 */

/**
 * Base entity interface with common fields
 */
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * User entity
 */
export interface User extends BaseEntity {
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  profile_image?: string;
  last_login?: string;
  settings?: UserSettings;
}

/**
 * User role enum
 */
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  EMPLOYEE = "employee",
  READONLY = "readonly",
}

/**
 * User status enum
 */
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  SUSPENDED = "suspended",
}

/**
 * User settings interface
 */
export interface UserSettings {
  language: string;
  theme: "light" | "dark" | "system";
  notifications: boolean;
  dashboard_layout?: Record<string, unknown>;
}

/**
 * Tank entity
 */
export interface Tank extends BaseEntity {
  name: string;
  capacity: number;
  current_level: number;
  fuel_type_id: string;
  fuel_type?: FuelType;
  is_active: boolean;
  location?: string;
  last_filled_at?: string;
  installation_date?: string;
  notes?: string;
}

/**
 * FuelType entity
 */
export interface FuelType extends BaseEntity {
  name: string;
  code: string;
  color: string;
  unit_price: number;
  description?: string;
  is_active: boolean;
}

/**
 * Transaction entity
 */
export interface Transaction extends BaseEntity {
  amount: number;
  description: string;
  transaction_date: string;
  transaction_type: TransactionType;
  category: string;
  employee_id?: string;
  employee?: Employee;
  reference_number?: string;
  payment_method?: string;
  status: TransactionStatus;
  attachments?: string[];
}

/**
 * Transaction type enum
 */
export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

/**
 * Transaction status enum
 */
export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

/**
 * Employee entity
 */
export interface Employee extends BaseEntity {
  name: string;
  position: string;
  hire_date: string;
  salary: number;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  is_active: boolean;
  department?: string;
  manager_id?: string;
  emergency_contact?: string;
}

/**
 * Filling system entity
 */
export interface FillingSystem extends BaseEntity {
  name: string;
  location: string;
  tank_id: string;
  tank?: Tank;
  is_active: boolean;
  last_maintenance_date?: string;
  next_maintenance_date?: string;
  maintenance_interval_days?: number;
  notes?: string;
}

/**
 * Dashboard data interface
 */
export interface DashboardData {
  summary: {
    totalSales: number;
    totalExpenses: number;
    profit: number;
    salesChange: number;
  };
  fuelLevels: TankSummary[];
  recentTransactions: TransactionSummary[];
}

/**
 * Tank summary interface for dashboard
 */
export interface TankSummary {
  tankId: string;
  tankName: string;
  fuelType: string;
  currentLevel: number;
  capacity: number;
  percentFull: number;
}

/**
 * Transaction summary interface for dashboard
 */
export interface TransactionSummary {
  id: string;
  amount: number;
  date: string;
  type: "sale" | "expense";
}

/**
 * Sales summary interface
 */
export interface SalesSummary {
  totalSales: number;
  averagePerDay: number;
  topSellingProducts: ProductSalesSummary[];
  salesByDay: DailySalesSummary[];
}

/**
 * Product sales summary
 */
export interface ProductSalesSummary {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

/**
 * Daily sales summary
 */
export interface DailySalesSummary {
  date: string;
  amount: number;
}

/**
 * Financial dashboard data
 */
export interface FinancialDashboardData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  revenueByCategory: CategoryAmount[];
  expensesByCategory: CategoryAmount[];
}

/**
 * Category amount interface
 */
export interface CategoryAmount {
  category: string;
  amount: number;
}
