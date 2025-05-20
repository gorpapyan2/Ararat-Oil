/**
 * Formatting utility functions for consistent data display
 */

/**
 * Format a number with commas as thousands separators
 */
export function numberWithCommas(x: number | string): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Formats a date for display
 * @param date Date to format
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}

/**
 * Formats a currency amount with the specified locale and currency
 */
export function formatCurrency(
  amount: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats input currency for display while editing
 */
export function formatInputCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
  return isNaN(numValue) ? '' : numValue.toFixed(2);
}

/**
 * Parses a currency input string back to a number
 */
export function parseCurrencyInput(value: string): number {
  const parsed = parseFloat(value.replace(/[^\d.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Formats a date-time string for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
}

/**
 * Calculates and formats the duration from a start time to now
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
 * Calculates and formats the duration between start and end times
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