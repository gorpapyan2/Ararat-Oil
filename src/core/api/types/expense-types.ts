/**
 * API Expense object type
 */
export interface ApiExpense {
  id: string;
  amount: number;
  expense_date: string;
  expense_category: string;
  description: string;
  payment_method: string;
  payment_status: string;
  receipt_url?: string;
  vendor_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string | null;
}
