import { z } from "zod";

// Export specific types from fuel-sales without conflicts
export type {
  FuelSaleFormData,
  FuelSaleFilters,
  FuelSaleExportOptions,
  FuelSaleSummary
} from "./fuel-sales.types";

// Export all from supplies
export * from "./fuel-supplies.types";

// Export all from petrol providers
export * from "./petrol-providers.types";

// Export all from fuel prices
export * from "./fuel-prices.types";

// Export all from fuel types (main FuelSale interface)
export * from "./fuel.types";

// Base interfaces for other exports
interface RefuelEntry {
  id: string;
  vehicle_id: string;
  tank_id: string;
  fuel_type: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  timestamp: string;
  notes?: string;
}

interface FuelTransfer {
  id: string;
  from_tank: {
    id: string;
    name: string;
  };
  to_tank: {
    id: string;
    name: string;
  };
  fuel_type: string;
  quantity: number;
  timestamp: string;
  notes?: string;
}

interface BatchOperation {
  id: string;
  type: 'refuel' | 'transfer' | 'delivery';
  tankId?: string;
  quantity: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface TankSafetyMetrics {
  id: string;
  tank_id: string;
  safety_check_date: string;
  pressure_reading: number;
  temperature_reading: number;
  leak_detection_status: 'normal' | 'warning' | 'critical';
  currentTankLevel: number;
  tankCapacity: number;
  notes?: string;
}

// Common schemas
export const fuelRefillSchema = z.object({
  tank_id: z.string({ required_error: "Tank is required" }),
  quantity: z
    .number({ required_error: "Quantity is required" })
    .min(1, "Quantity must be at least 1 liter"),
  unit_price: z
    .number({ required_error: "Unit price is required" })
    .min(0.01, "Unit price must be greater than 0"),
  supplier_id: z.string({ required_error: "Supplier is required" }),
  delivery_date: z.date({ required_error: "Delivery date is required" }),
  notes: z.string().optional(),
});

export type FuelRefillFormData = z.infer<typeof fuelRefillSchema>;

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
