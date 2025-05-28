/**
 * API Sale object type
 */
export interface ApiSale {
  id: string;
  amount?: number;
  total_price?: number;
  quantity_liters?: number;
  quantity?: number;
  unit_price?: number;
  price_per_liter?: number;
  sale_date: string;
  fuel_type?: string;
  fuel_type_id?: string;
  vehicle_plate?: string;
  customer_name?: string;
  payment_method: string;
  payment_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string | null;
}
