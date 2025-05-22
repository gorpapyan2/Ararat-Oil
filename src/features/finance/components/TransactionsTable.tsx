/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/TransactionsTableStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TransactionsTableStandardized } from "./TransactionsTableStandardized";
import type { Transaction } from "../types/finance.types";

interface TransactionsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onViewDetails?: (transaction: Transaction) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  paymentMethods?: { id: string; name: string }[];
  statuses?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please use TransactionsTableStandardized instead.
 */
export function TransactionsTable(props: TransactionsTableProps) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TransactionsTable",
      "src/features/finance/components/TransactionsTable.tsx",
      "@/features/finance/components/TransactionsTableStandardized"
    );
  }, []);
  
  // Forward all props to the standardized component
  return <TransactionsTableStandardized {...props} />;
}
