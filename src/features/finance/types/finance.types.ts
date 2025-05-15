export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

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

export interface FinanceData {
  transactions: Transaction[];
  expenses: Expense[];
  profitLoss: ProfitLoss[];
} 