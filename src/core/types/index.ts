// Re-export all types from this central location

// Export supabase types from their canonical location
export * from "@/integrations/supabase/types";

// Employee status enum
export type EmployeeStatus = "active" | "inactive" | "on_leave";

// Expense category enum
export type ExpenseCategory =
  | "utilities"
  | "supplies"
  | "maintenance"
  | "salary"
  | "other";

// Payment status enum
export type PaymentStatus =
  | "pending"
  | "completed"
  | "cancelled"
  | "paid"
  | "failed"
  | "refunded";

// Payment method enum
export type PaymentMethod =
  | "cash"
  | "credit_card"
  | "debit_card"
  | "mobile_payment"
  | "card"
  | "bank_transfer"
  | "other";

// Fuel type code enum
export type FuelTypeCode =
  | "diesel"
  | "gas"
  | "petrol_regular"
  | "petrol_premium";

// Basic entity types
export interface Employee {
  id: string;
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: EmployeeStatus;
  created_at: string;
}

// Legacy type definition, maintained for backward compatibility
export interface FuelType {
  id: string;
  name: string;
  code: FuelTypeCode;
  price: number;
  color: string;
}

// FuelSupply type definition
export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  shift_id: string;
  comments?: string;
  created_at: string;
}

// Transaction related types
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  type: string;
  description: string;
  status: PaymentStatus;
  customer_id?: string;
  employee_id?: string;
  created_at?: string;
}

// Legacy Sale definition (keep for backward compatibility)
export interface SaleLegacy {
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
  shift_id: string;
}

// New Sale type definition that matches the sales adapter implementation
export interface Sale {
  id: string;
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date;
  fuelType: FuelTypeCode;
  vehiclePlate?: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// Legacy Expense definition (keep for backward compatibility)
export interface ExpenseLegacy {
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

// New Expense type definition that matches the expenses adapter implementation
export interface Expense {
  id: string;
  amount: number;
  expenseDate: Date;
  category: ExpenseCategory;
  description: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  receiptUrl?: string;
  vendorName?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date | null;
}

// ProfitLoss summary type for the front-end
export interface ProfitLossSummary {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at: string;
  updated_at: string;
}

export interface FuelTypeModel {
  id: string;
  code: FuelTypeCode | string;
  name: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface FuelTank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type: FuelType | FuelTypeModel;
  fuel_type_id?: string; // New field for the foreign key
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
  is_active?: boolean;
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

// Shift type - Updated to support multiple employees
export interface Shift {
  id: string;
  start_time: string;
  end_time?: string;
  is_active: boolean;
  opening_cash: number;
  closing_cash?: number;
  sales_total: number;
  status: "OPEN" | "CLOSED";
  employee_id?: string; // Kept for backward compatibility
  employees?: ShiftEmployee[]; // New: array of employees
  created_at?: string;
  updated_at?: string;
}

// Shift employee interface
export interface ShiftEmployee {
  id: string;
  employee_id: string;
  employee_name: string;
  employee_position: string;
  employee_status: string;
  created_at: string;
}

// Shift payment method relationship
export interface ShiftPaymentMethod {
  id: string;
  shift_id: string;
  payment_method: PaymentMethod;
  amount: number;
  reference?: string;
  created_at?: string;
}

// Tank level change record type
export interface TankLevelChange {
  id: string;
  tank_id: string;
  change_amount: number;
  previous_level: number;
  new_level: number;
  change_type: "add" | "subtract";
  created_at?: string;
  created_by?: string; // Made optional to match current DB schema
}

// Add this to the file, preserving existing exports
export interface FuelManagementSummary {
  tanks: {
    totalVolume: number;
    availableVolume: number;
    utilizationRate: number;
    list: Array<{
      id: string;
      name: string;
      capacity: number;
      current_level: number;
      fuel_type_id?: string;
      status?: "active" | "inactive" | "maintenance" | string;
    }>;
    byType: Record<string, number>;
  };
  supplies: {
    total: number;
    totalCost: number;
    list: Array<{
      id: string;
      fuel_type: string;
      quantity: number;
      cost: number;
      date: string;
    }>;
  };
  systems: {
    active: number;
    total: number;
  };
  trends: {
    dailyConsumption: Array<{
      date: string;
      value: number;
    }>;
  };
}
