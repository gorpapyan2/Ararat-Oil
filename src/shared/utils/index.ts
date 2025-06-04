/**
 * Shared utilities index file
 * Exports all utility functions for easy imports
 */

// DOM utilities
export { cn, generateId, debounce, sleep, checkColorContrast } from "./dom";

// Formatting utilities (using consolidated formatter)
export {
  numberWithCommas,
  formatDate,
  formatCurrency,
  formatNumber,
  formatInputCurrency,
  parseCurrencyInput,
  formatDateTime,
  calculateDuration,
  calculateShiftDuration,
  formatPercent,
  formatFileSize,
  formatPhoneNumber,
  truncateText,
} from "@/lib/formatters";

// Object utilities
export {
  get,
  omitNullish,
  isPlainObject,
  deepMerge,
  pick,
  omit,
} from "./object";
