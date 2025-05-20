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

export interface FuelSupplyFormData {
  tank_id: string;
  provider_id: string;
  shift_id: string;
  quantity_liters: number;
  price_per_liter: number;
  delivery_date: string;
  payment_method: string;
  payment_status: string;
  comments: string;
}

export interface FuelSupplyFilters {
  dateRange?: {
    from: Date;
    to: Date;
  };
  providerId?: string;
  tankId?: string;
  paymentStatus?: string;
  searchQuery?: string;
}

export interface FuelSupplySummary {
  totalQuantity: number;
  totalCost: number;
  averagePrice: number;
  supplyCount: number;
} 