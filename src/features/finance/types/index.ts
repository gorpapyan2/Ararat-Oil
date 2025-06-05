import { FuelTypeCode, PaymentMethod, PaymentStatus } from "@/types";

// Main Sale interface
export interface Sale {
  id: string;
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date;
  fuelType: FuelTypeCode;
  vehiclePlate?: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date | null;
  fillingSystemId?: string;
  fillingSystemName?: string;
  meterStart?: number;
  meterEnd?: number;
  shiftId?: string;
}

// Create Sale request
export interface CreateSaleRequest {
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date | string;
  fuelType: FuelTypeCode;
  vehiclePlate?: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  fillingSystemId?: string;
  meterStart?: number;
  meterEnd?: number;
  shiftId?: string;
}

// Update Sale request
export interface UpdateSaleRequest extends Partial<CreateSaleRequest> {
  id: string;
}

// Sales filter options
export interface SalesFilters {
  searchTerm?: string;
  dateRange?: {
    from: Date;
    to?: Date;
  };
  fuelType?: FuelTypeCode | "all";
  paymentStatus?: PaymentStatus | "all";
  fillingSystem?: string | "all";
  minAmount?: number;
  maxAmount?: number;
  minQuantity?: number;
  maxQuantity?: number;
}

// Sales statistics summary
export interface SalesSummary {
  totalSales: number;
  totalQuantity: number;
  averagePrice: number;
  salesCount: number;
  byFuelType?: Record<
    FuelTypeCode,
    {
      quantity: number;
      amount: number;
      count: number;
    }
  >;
  byPaymentMethod?: Record<
    PaymentMethod,
    {
      amount: number;
      count: number;
    }
  >;
}

// Export options
export interface SalesExportOptions {
  startDate: string;
  endDate: string;
  format: "csv" | "pdf" | "excel";
  includeDetails?: boolean;
}

// Export response
export interface SalesExportResponse {
  url?: string;
  data?: string;
  filename?: string;
}
