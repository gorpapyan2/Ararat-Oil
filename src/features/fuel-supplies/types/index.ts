export interface FuelSupply {
  id: string;
  delivery_date: string;
  provider_id: string;
  tank_id: string;
  quantity_liters: number;
  price_per_liter: number;
  total_cost: number;
  comments?: string;
  provider?: {
    id: string;
    name: string;
  };
  tank?: {
    id: string;
    name: string;
    fuel_type: string;
  };
  employee?: {
    id: string;
    name: string;
  };
}

export type CreateFuelSupplyRequest = Omit<
  FuelSupply,
  "id" | "provider" | "tank" | "employee"
>;

export type UpdateFuelSupplyRequest = Partial<CreateFuelSupplyRequest>; 