import { z } from "zod";

export interface FuelSupply {
  supplier_id: string;
  fuel_type_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  invoice_number: string | undefined;
  notes: string | undefined;
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  shift_id: string;
  comments?: string;
  payment_method?: string;
  payment_status?: string;
  created_at?: string;

  // Join fields
  provider?: {
    id: string;
    name: string;
    contact?: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: string;
    capacity: number;
    current_level: number;
  };
}

export interface SuppliesFilters {
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
  providerId?: string;
  tankId?: string;
  fuelType?: string;
  minQuantity?: number;
  maxQuantity?: number;
  minPrice?: number;
  maxPrice?: number;
  minTotal?: number;
  maxTotal?: number;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface SuppliesSummary {
  totalLiters: number;
  totalCost: number;
  lastDelivery: string;
  currentTankLevel: number;
  tankCapacity: number;
  byFuelType: Record<
    string,
    {
      quantity: number;
      cost: number;
      averagePrice: number;
    }
  >;
}

export const fuelSupplySchema = z.object({
  delivery_date: z.string({ required_error: "Delivery date is required" }),
  provider_id: z.string({ required_error: "Provider is required" }),
  tank_id: z.string({ required_error: "Tank is required" }),
  quantity_liters: z.coerce
    .number({ required_error: "Quantity is required" })
    .positive("Quantity must be a positive number"),
  price_per_liter: z.coerce
    .number({ required_error: "Price per liter is required" })
    .nonnegative("Price must be a positive number or zero"),
  total_cost: z.coerce.number().optional(),
  shift_id: z.string({ required_error: "Shift is required" }),
  comments: z.string().optional(),
  payment_method: z.string().optional(),
  payment_status: z.string().optional(),
});

export type FuelSupplyFormData = z.infer<typeof fuelSupplySchema>;
