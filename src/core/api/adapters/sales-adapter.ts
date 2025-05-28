import { format } from "date-fns";
import { ApiSale } from "../types/sale-types";
import { Sale, FuelTypeCode, PaymentMethod, PaymentStatus } from "@/types";

/**
 * Converts API sale data format to the application's sale data format
 */
function fromApiData(data: ApiSale): Sale;
function fromApiData(data: ApiSale[]): Sale[];
function fromApiData(data: ApiSale | ApiSale[]): Sale | Sale[] {
  if (Array.isArray(data)) {
    return data.map((item) => fromApiData(item));
  }

  return {
    id: data.id,
    amount: data.amount || data.total_price || 0,
    quantityLiters: data.quantity_liters || data.quantity || 0,
    unitPrice: data.unit_price || data.price_per_liter || 0,
    saleDate: data.sale_date ? new Date(data.sale_date) : new Date(),
    fuelType:
      (data.fuel_type as FuelTypeCode) || (data.fuel_type_id as FuelTypeCode),
    vehiclePlate: data.vehicle_plate,
    customerName: data.customer_name,
    paymentMethod: (data.payment_method as PaymentMethod) || "cash",
    paymentStatus: (data.payment_status as PaymentStatus) || "completed",
    notes: data.notes,
    createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    updatedAt: data.updated_at ? new Date(data.updated_at) : null,
  };
}

/**
 * Converts application's sale data format to the API sale data format
 */
function toApiData(data: Sale): ApiSale;
function toApiData(data: Sale[]): ApiSale[];
function toApiData(data: Sale | Sale[]): ApiSale | ApiSale[] {
  if (Array.isArray(data)) {
    return data.map((item) => toApiData(item));
  }

  return {
    id: data.id,
    amount: data.amount,
    quantity_liters: data.quantityLiters,
    unit_price: data.unitPrice,
    sale_date: data.saleDate ? format(data.saleDate, "yyyy-MM-dd") : "",
    fuel_type: data.fuelType,
    vehicle_plate: data.vehiclePlate,
    customer_name: data.customerName,
    payment_method: data.paymentMethod,
    payment_status: data.paymentStatus,
    notes: data.notes,
    created_at: data.createdAt
      ? format(data.createdAt, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : "",
    updated_at: data.updatedAt
      ? format(data.updatedAt, "yyyy-MM-dd'T'HH:mm:ss'Z'")
      : null,
  };
}

export const salesAdapter = {
  fromApiData,
  toApiData,
};
