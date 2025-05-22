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
 * @param options Intl.DateTimeFormat options or string format pattern
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions | string
): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // If options is a string, it's a format pattern like "MM/dd/yyyy"
  if (typeof options === 'string') {
    // Simple format pattern replacement
    // This is a basic implementation - for production, consider using a library like date-fns
    return options
      .replace(/PPPP/g, new Intl.DateTimeFormat('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(dateObj))
      .replace(/PP/g, new Intl.DateTimeFormat('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(dateObj))
      .replace(/P/g, new Intl.DateTimeFormat('en-US', { 
        month: 'numeric', 
        day: 'numeric', 
        year: 'numeric' 
      }).format(dateObj));
  }
  
  // Otherwise, use the provided options object or default
  const defaultOptions: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  
  return new Intl.DateTimeFormat("en-US", options || defaultOptions).format(dateObj);
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
 * Formats a number with specified decimal places and thousands separator
 * @param value The number to format
 * @param decimals Number of decimal places to show (default: 2)
 * @param thousandsSep Thousands separator character (default: ',')
 * @param decimalSep Decimal separator character (default: '.')
 * @returns Formatted number string
 */
export function formatNumber(
  value: number | string,
  decimals: number = 2,
  thousandsSep: string = ',',
  decimalSep: string = '.'
): string {
  // Handle non-numeric inputs
  if (value === null || value === undefined) return '';
  
  // Convert to number if string
  const num = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(num)) return '';
  
  // Format the number
  const fixedNum = num.toFixed(decimals);
  const parts = fixedNum.split('.');
  
  // Add thousands separators
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  
  // Join with decimal separator
  return parts.join(decimalSep);
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