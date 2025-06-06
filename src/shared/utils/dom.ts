/**
 * DOM manipulation and UI utility functions
 */

import { clsx } from 'clsx';
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and merges them using tailwind-merge
 * This allows for proper class precedence when using Tailwind utility classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID with optional prefix
 */
export function generateId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounces a function to limit how often it can be called
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    const later = (): void => {
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
  return new Promise((resolve) => setTimeout(resolve, ms));
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
  isLargeText = false
): { ratio: string; passesAA: boolean } {
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
  const getLuminance = (r: number, g: number, b: number): number => {
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
