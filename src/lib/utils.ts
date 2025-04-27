import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names with Tailwind's recommended method
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
