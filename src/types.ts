export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum FuelType {
  GASOLINE = 'GASOLINE',
  DIESEL = 'DIESEL',
  NATURAL_GAS = 'NATURAL_GAS'
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE'
}

export interface FuelSupply {
  id: string;
  created_at: string;
  provider_id: string;
  tank_id: string;
  employee_id: string;
  quantity: number;
  unit_price: number;
  total_cost: number;
  delivery_date: string;
  payment_method: string;
  payment_status: PaymentStatus;
  comments?: string;
  provider?: {
    id: string;
    name: string;
    contact: string;
  };
  tank?: {
    id: string;
    name: string;
    capacity: number;
    current_level: number;
    fuel_type: FuelType;
  };
  employee?: {
    id: string;
    name: string;
    position: string;
    contact: string;
    salary: number;
    status: EmployeeStatus;
    hire_date: string;
  };
}
