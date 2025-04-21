
// Add to existing types
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'mobile_payment';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  sale_id?: string;
  amount: number;
  payment_method: PaymentMethod;
  payment_reference?: string;
  payment_status: PaymentStatus;
  employee_id: string;
  created_at?: string;
  updated_at?: string;
}
