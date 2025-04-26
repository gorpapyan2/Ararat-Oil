import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency (AMD - Armenian Dram)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AM', {
    style: 'currency',
    currency: 'AMD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as currency for input fields (with commas but no currency symbol)
 */
export function formatInputCurrency(value: number | string): string {
  if (value === '' || value === null || value === undefined) return '';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '';
  return numValue.toLocaleString('en-AM');
}

/**
 * Parses a formatted currency string back to a number
 */
export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.-]/g, '');
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
}
