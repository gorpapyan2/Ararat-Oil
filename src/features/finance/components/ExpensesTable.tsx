/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/ExpensesTableStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ExpensesTableStandardized } from "./ExpensesTableStandardized";
import type { Expense } from "../types/finance.types";

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  categories?: { id: string; name: string }[];
  paymentMethods?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please use ExpensesTableStandardized instead.
 */
export function ExpensesTable(props: ExpensesTableProps) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ExpensesTable",
      "src/features/finance/components/ExpensesTable.tsx",
      "@/features/finance/components/ExpensesTableStandardized"
    );
  }, []);
  
  // Forward all props to the standardized component
  return <ExpensesTableStandardized {...props} />;
}
