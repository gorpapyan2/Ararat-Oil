/**
 * Shared utilities index file
 * Exports all utility functions for easy imports
 */

// DOM utilities
export { cn, generateId, debounce, sleep, checkColorContrast } from './dom';

// Formatting utilities
export {
  numberWithCommas,
  formatDate,
  formatCurrency,
  formatInputCurrency,
  parseCurrencyInput,
  formatDateTime,
  calculateDuration,
  calculateShiftDuration
} from './formatting';

// Object utilities
export {
  get,
  omitNullish,
  isPlainObject,
  deepMerge,
  pick,
  omit
} from './object'; 