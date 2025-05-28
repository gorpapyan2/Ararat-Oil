export type PaymentMethod =
  | "cash"
  | "card"
  | "bank_transfer"
  | "mobile_payment";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  employee_id: string;
  created_at: string;
  updated_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  employee_id: string;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface ProfitLoss {
  id: string;
  period: string;
  total_sales: number;
  total_expenses: number;
  profit: number;
  created_at: string;
  updated_at: string;
}

export interface FinanceOverview {
  total_sales: number;
  total_expenses: number;
  net_profit: number;
  recent_transactions?: Transaction[];
  top_expenses?: Expense[];
}

export interface FinanceData {
  transactions: Transaction[];
  expenses: Expense[];
  profitLoss: ProfitLoss[];
}

// Filter interfaces
export interface ExpenseFilters {
  category?: string;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  employee_id?: string;
}

export interface TransactionFilters {
  payment_method?: PaymentMethod;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  employee_id?: string;
}
