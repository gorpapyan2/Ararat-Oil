/**
 * Central export point for utility functions
 * This allows importing multiple utilities from a single location:
 * import { formatDate, cn, formatCurrency } from '@/utils';
 */

// Import and re-export specifically to avoid naming conflicts
import { 
  formatDate as formatDateUtil,
  formatCurrency,
  formatNumber,
  formatPercent,
  getRelativeTime as getRelativeTimeUtil
} from './formatting';

import { cn } from './cn';

// Export date utilities with preference for date.ts implementation
import { formatDate, getRelativeTime } from './date';

// Export other utilities
export * from './deprecation';
export * from './errorHandling';

// Export with disambiguated names
export {
  formatDate,
  getRelativeTime,
  formatCurrency,
  formatNumber,
  formatPercent,
  cn,
  // Provide alternative names for the formatting.ts versions if needed
  formatDateUtil,
  getRelativeTimeUtil
}; 