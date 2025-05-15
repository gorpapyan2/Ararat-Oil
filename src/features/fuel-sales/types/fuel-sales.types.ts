export interface FuelSale {
  id: string;
  date: string;
  fuel_type: string;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  filling_system_id: string;
  filling_system_name: string;
  employee_id: string;
  shift_id: string;
  meter_start: number;
  meter_end: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_method?: 'cash' | 'card' | 'transfer';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FuelSaleFormData {
  date: string;
  fuel_type: string;
  quantity: number;
  price_per_unit: number;
  filling_system_id: string;
  filling_system_name?: string;
  employee_id?: string;
  shift_id: string;
  meter_start: number;
  meter_end: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_method?: 'cash' | 'card' | 'transfer';
  notes?: string;
}

export interface FuelSaleFilters {
  shiftId?: string;
  startDate?: string;
  endDate?: string;
  employeeId?: string;
}

export interface FuelSaleSummary {
  totalSales: number;
  totalQuantity: number;
  averagePrice: number;
  salesCount: number;
  byPaymentStatus: {
    pending: number;
    paid: number;
    cancelled: number;
  };
  byPaymentMethod: {
    cash: number;
    card: number;
    transfer: number;
  };
} 