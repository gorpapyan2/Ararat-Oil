
// Add to existing types file
export interface Shift {
  id: string;
  employee_id: string;
  start_time: string;
  end_time?: string;
  opening_cash: number;
  closing_cash?: number;
  sales_total: number;
  status: 'OPEN' | 'CLOSED';
  created_at?: string;
  updated_at?: string;
}
