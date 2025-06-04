import { format, isValid, parseISO } from "date-fns";

/**
 * Consolidated formatting utility functions for consistent data display
 * Supports multiple locales and comprehensive formatting options
 */

// Default locale configuration
const DEFAULT_LOCALE = "hy-AM"; // Armenian locale
const FALLBACK_LOCALE = "en-US";

/**
 * Format a date to a standard string format
 * @param date Date to format
 * @param formatString Format string (default: "PP") or Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  formatString: string | Intl.DateTimeFormatOptions = "PP"
): string {
  if (!date) return "";

  try {
    const dateObj = date instanceof Date ? date : 
                   typeof date === "string" ? parseISO(date) : 
                   new Date(date);

    if (!isValid(dateObj)) return "";

    // If it's a date-fns format string, use date-fns
    if (typeof formatString === "string") {
      return format(dateObj, formatString);
    }

    // Otherwise use Intl.DateTimeFormat
    const defaultOptions: Intl.DateTimeFormatOptions = {
      month: "long",
      day: "numeric", 
      year: "numeric",
    };

    return new Intl.DateTimeFormat(FALLBACK_LOCALE, {
      ...defaultOptions,
      ...formatString,
    }).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format a date-time string for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(FALLBACK_LOCALE, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

/**
 * Format a number as currency with locale support
 * @param amount Amount to format
 * @param options Currency formatting options
 * @param locale Locale for formatting (default: Armenian)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options: Intl.NumberFormatOptions & { locale?: string } = {}
): string {
  if (amount === null || amount === undefined) return "";

  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(value)) return "";

  const { locale = DEFAULT_LOCALE, ...intlOptions } = options;

  const defaultOptions: Intl.NumberFormatOptions = {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  try {
    return new Intl.NumberFormat(locale, {
      ...defaultOptions,
      ...intlOptions,
    }).format(value);
  } catch (error) {
    // Fallback to default locale if provided locale fails
    return new Intl.NumberFormat(FALLBACK_LOCALE, {
      ...defaultOptions,
      ...intlOptions,
    }).format(value);
  }
}

/**
 * Format input currency for display while editing
 */
export function formatInputCurrency(value: number | string): string {
  const numValue =
    typeof value === "string"
      ? parseFloat(value.replace(/[^\d.]/g, ""))
      : value;
  return isNaN(numValue) ? "" : numValue.toFixed(2);
}

/**
 * Parse a currency input string back to a number
 */
export function parseCurrencyInput(value: string): number {
  const parsed = parseFloat(value.replace(/[^\d.]/g, ""));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a number with specified decimal places and separators
 * @param value The number to format
 * @param decimals Number of decimal places (default: 2)
 * @param locale Locale for formatting (default: Armenian)
 * @param options Additional formatting options
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | string | null | undefined,
  decimals: number = 2,
  locale: string = DEFAULT_LOCALE,
  options: Intl.NumberFormatOptions = {}
): string {
  if (value === null || value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";

  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...options,
    }).format(numValue);
  } catch (error) {
    // Fallback formatting
    return new Intl.NumberFormat(FALLBACK_LOCALE, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      ...options,
    }).format(numValue);
  }
}

/**
 * Format a number with commas as thousands separators (legacy support)
 */
export function numberWithCommas(x: number | string): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Format a percentage
 */
export function formatPercent(
  value: number | string | null | undefined,
  decimals: number = 0,
  locale: string = DEFAULT_LOCALE
): string {
  if (value === null || value === undefined) return "";

  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";

  try {
    return new Intl.NumberFormat(locale, {
      style: "percent",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numValue / 100);
  } catch (error) {
    return new Intl.NumberFormat(FALLBACK_LOCALE, {
      style: "percent", 
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(numValue / 100);
  }
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
 * Format a phone number (Armenian format)
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

/**
 * Calculate and format duration from a start time to now
 */
export function calculateDuration(startTimeString: string): string {
  const startTime = new Date(startTimeString);
  const now = new Date();

  // Calculate the difference in milliseconds
  const diffMillis = now.getTime() - startTime.getTime();

  // Convert to hours and minutes
  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Calculate and format duration between start and end times
 */
export function calculateShiftDuration(
  startTimeString: string,
  endTimeString?: string
): string {
  const startTime = new Date(startTimeString);
  const endTime = endTimeString ? new Date(endTimeString) : new Date();

  // Calculate the difference in milliseconds
  const diffMillis = endTime.getTime() - startTime.getTime();

  // Convert to hours and minutes
  const hours = Math.floor(diffMillis / (1000 * 60 * 60));
  const minutes = Math.floor((diffMillis % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Legacy aliases for backward compatibility (no need for separate imports)
export const formatDateLegacy = formatDate;
export const formatCurrencyLegacy = formatCurrency;
export const formatNumberLegacy = formatNumber;
