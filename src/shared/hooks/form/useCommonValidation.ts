
import { z } from "zod";

/**
 * Common validation schemas and utilities
 */
export function useCommonValidation() {
  const emailSchema = z.string().email("Invalid email address");
  
  const phoneSchema = z.string().regex(
    /^\+?[\d\s\-\(\)]+$/,
    "Invalid phone number format"
  );
  
  const requiredStringSchema = z.string().min(1, "This field is required");
  
  const positiveNumberSchema = z.number().positive("Must be a positive number");
  
  const dateSchema = z.date();
  
  const currencySchema = z.number().min(0, "Amount cannot be negative");

  return {
    emailSchema,
    phoneSchema,
    requiredStringSchema,
    positiveNumberSchema,
    dateSchema,
    currencySchema,
    
    // Utility functions
    validateEmail: (email: string) => emailSchema.safeParse(email),
    validatePhone: (phone: string) => phoneSchema.safeParse(phone),
    validateCurrency: (amount: number) => currencySchema.safeParse(amount),
  };
}
