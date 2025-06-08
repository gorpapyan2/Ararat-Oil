
import { z } from "zod";

/**
 * Common form schemas for the application
 */
export function useFormSchemas() {
  // Employee schema
  const employeeSchema = z.object({
    name: z.string().min(1, "Name is required"),
    contact: z.string().min(1, "Contact is required"),
    position: z.string().min(1, "Position is required"),
    hire_date: z.string().min(1, "Hire date is required"),
    salary: z.number().positive("Salary must be positive"),
    status: z.enum(["active", "inactive"]).default("active"),
  });

  // Fuel supply schema
  const fuelSupplySchema = z.object({
    delivery_date: z.string().min(1, "Delivery date is required"),
    provider_id: z.string().min(1, "Provider is required"),
    tank_id: z.string().min(1, "Tank is required"),
    quantity_liters: z.number().positive("Quantity must be positive"),
    price_per_liter: z.number().positive("Price must be positive"),
    total_cost: z.number().positive("Total cost must be positive"),
    employee_id: z.string().min(1, "Employee is required"),
    comments: z.string().optional(),
    payment_method: z.string().optional(),
    payment_status: z.enum(["pending", "completed", "failed"]).default("pending"),
  });

  // Sales schema
  const salesSchema = z.object({
    date: z.string().min(1, "Date is required"),
    price_per_unit: z.number().positive("Price must be positive"),
    total_sales: z.number().positive("Total sales must be positive"),
    total_sold_liters: z.number().positive("Quantity must be positive"),
    meter_start: z.number().min(0, "Meter start cannot be negative"),
    meter_end: z.number().min(0, "Meter end cannot be negative"),
    filling_system_id: z.string().min(1, "Filling system is required"),
    employee_id: z.string().min(1, "Employee is required"),
  });

  return {
    employeeSchema,
    fuelSupplySchema,
    salesSchema,
  };
}
