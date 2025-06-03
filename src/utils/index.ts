/**
 * Central export point for utility functions
 * This allows importing multiple utilities from a single location:
 * import { formatDate, cn, formatCurrency } from '@/utils';
 */

// Re-export from shared utils
export {
  formatDate,
  formatCurrency,
  formatNumber,
  formatPercent,
  getRelativeTime,
} from "@/shared/utils/formatting";

export { cn } from "@/shared/utils/cn";

// Re-export from core utilities
export * from "@/core/errorHandling";
export * from "@/core/api-helpers";
export * from "@/core/supabase-helpers";
export * from "@/core/db-migration";
