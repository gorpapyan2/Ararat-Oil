import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges them using tailwind-merge
 * This allows for proper class precedence when using Tailwind utility classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID with optional prefix
 */
export function generateId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounces a function to limit how often it can be called
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Pauses execution for the specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Safely access nested object properties
 */
export function get(obj: any, path: string, defaultValue: any = undefined): any {
  const travel = (regexp: RegExp) =>
    String.prototype.split
      .call(path, regexp)
      .filter(Boolean)
      .reduce((res, key) => (res !== null && res !== undefined ? res[key] : res), obj);
      
  const result = travel(/[,[\]]+?/) || travel(/[,[\].]+?/);
  return result === undefined || result === obj ? defaultValue : result;
}

/**
 * Filter null and undefined values from an object
 */
export function omitNullish<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value;
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Format a number with commas as thousands separators
 */
export function numberWithCommas(x: number | string): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Determines if a value is a plain object
 */
export function isPlainObject(value: any): boolean {
  return typeof value === 'object' 
    && value !== null 
    && value.constructor === Object 
    && Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * Deep merges two objects
 */
export function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target };
  
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceKey = key as keyof typeof source;
      const targetKey = key as keyof typeof target;
      
      if (isPlainObject(source[sourceKey]) && key in target) {
        (output as any)[targetKey] = deepMerge(
          target[targetKey],
          source[sourceKey] as any
        );
      } else {
        (output as any)[targetKey] = source[sourceKey];
      }
    });
  }
  
  return output;
}

/**
 * Checks if a color meets WCAG AA contrast ratio standards
 * @param foreground - CSS color value for text
 * @param background - CSS color value for background
 * @param isLargeText - Whether the text is considered "large" (18pt+ or 14pt+ bold)
 * @returns Object containing the contrast ratio and whether it passes WCAG AA
 */
export function checkColorContrast(
  foreground: string,
  background: string,
  isLargeText: boolean = false,
) {
  // Convert colors to RGB
  const getRGB = (color: string) => {
    // Handle hex colors
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const bigint = parseInt(hex, 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
      };
    }

    // Handle rgb/rgba colors
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g);
      if (values && values.length >= 3) {
        return {
          r: parseInt(values[0]),
          g: parseInt(values[1]),
          b: parseInt(values[2]),
        };
      }
    }

    // Default fallback
    return { r: 0, g: 0, b: 0 };
  };

  // Calculate luminance for an RGB color
  const getLuminance = (r: number, g: number, b: number) => {
    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const rgb1 = getRGB(foreground);
  const rgb2 = getRGB(background);

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // WCAG AA requires 4.5:1 for normal text and 3:1 for large text
  const passesAA = isLargeText ? ratio >= 3 : ratio >= 4.5;

  return {
    ratio: ratio.toFixed(2),
    passesAA,
  };
}

/**
 * Formats a date for display
 * @param date Date to format
 * @param options Intl.DateTimeFormat options
 * @returns Formatted date string
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", options).format(date);
}

/**
 * Formats a number as currency (AMD - Armenian Dram)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-AM", {
    style: "currency",
    currency: "AMD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a number as currency for input fields (with commas but no currency symbol)
 */
export function formatInputCurrency(value: number | string): string {
  if (value === "" || value === null || value === undefined) return "";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numValue)) return "";
  return numValue.toLocaleString("en-AM");
}

/**
 * Parses a formatted currency string back to a number
 */
export function parseCurrencyInput(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.-]/g, "");
  const numValue = parseFloat(cleanValue);
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Formats a date with both date and time information
 * @param dateString Date string to format
 * @returns Formatted date and time string
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Calculate the duration between a start time and the current time
 * @param startTimeString Start time as a date string
 * @returns Formatted duration string (e.g. "2h 15m" or "45m")
 */
export function calculateDuration(startTimeString: string): string {
  if (!startTimeString) return "-";
  
  try {
    const startTime = new Date(startTimeString);
    
    // Check if date is valid
    if (isNaN(startTime.getTime())) {
      return "-";
    }
    
    const currentTime = new Date();
    
    const durationMs = currentTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "-";
  }
}

/**
 * Calculate the duration between a start time and end time (or current time if end time not provided)
 * @param startTimeString Start time as a date string
 * @param endTimeString Optional end time as a date string, defaults to current time if not provided
 * @returns Formatted duration string (e.g. "2h 15m" or "45m")
 */
export function calculateShiftDuration(startTimeString: string, endTimeString?: string): string {
  if (!startTimeString) return "-";
  
  try {
    const startTime = new Date(startTimeString);
    
    // Check if start date is valid
    if (isNaN(startTime.getTime())) {
      return "-";
    }
    
    // Use end time if provided, otherwise use current time
    const endTime = endTimeString ? new Date(endTimeString) : new Date();
    
    // Check if end date is valid
    if (endTimeString && isNaN(endTime.getTime())) {
      return "-";
    }
    
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  } catch (error) {
    console.error("Error calculating shift duration:", error);
    return "-";
  }
}
