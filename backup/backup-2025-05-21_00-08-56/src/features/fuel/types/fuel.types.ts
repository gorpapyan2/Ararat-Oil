export type FuelType = 'petrol' | 'diesel' | 'lpg' | 'cng';

export interface FuelTank {
  id: string;
  name: string;
  capacity: number;
  current_level: number;
  fuel_type: FuelType;
  status: 'active' | 'maintenance' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface FuelSupply {
  id: string;
  tank_id: string;
  provider_id: string;
  shift_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  delivery_date: string;
  payment_method: string;
  payment_status: string;
  comments: string;
  created_at: string;
  updated_at: string;
}

export interface FuelSale {
  id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_amount: number;
  payment_method: 'cash' | 'card' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed';
  sale_date: string;
  customer_name: string;
  created_at: string;
  updated_at: string;
}

export interface FuelData {
  tanks: FuelTank[];
  supplies: FuelSupply[];
  sales: FuelSale[];
} 