import { format, isValid, parseISO } from "date-fns";

/**
 * Format a date to a standard string format
 */
export function formatDate(
  date: Date | string | null | undefined,
  formatString: string = "PP"
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? parseISO(date) : date;

  if (!isValid(dateObj)) return "";

  return format(dateObj, formatString);
}

/**
 * Format a number as currency
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {}
): string {
  if (amount === null || amount === undefined) return "";

  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(value)) return "";

  return new Intl.NumberFormat("hy-AM", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
}

/**
 * Format a number with specified decimal places
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals: number = 2
): string {
  if (value === null || value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "";

  return new Intl.NumberFormat("hy-AM", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue);
}

/**
 * Format a percentage
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) return "";

  return new Intl.NumberFormat("hy-AM", {
    style: "percent",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numValue / 100);
}

/**
 * Format a file size (bytes to KB, MB, etc.)
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined) return "";

  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(
  phoneNumber: string | null | undefined
): string {
  if (!phoneNumber) return "";

  // Remove non-digit characters
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length !== 8 && digits.length !== 9) {
    return phoneNumber; // Return original if not in expected format
  }

  if (digits.length === 8) {
    // Format as XX-XX-XX-XX
    return digits.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4");
  } else {
    // Format as XXX-XX-XX-XX
    return digits.replace(/(\d{3})(\d{2})(\d{2})(\d{2})/, "$1-$2-$3-$4");
  }
}

/**
 * Truncate a string to a maximum length with ellipsis
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 30
): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + "...";
}
