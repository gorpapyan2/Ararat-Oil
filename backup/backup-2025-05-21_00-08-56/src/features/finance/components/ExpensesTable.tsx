/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/ExpensesTable')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ExpensesTable as FeatureExpensesTable } from "@/features/finance/components/ExpensesTable";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/finance/components/ExpensesTable')}
 */
export default function ExpensesTable() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ExpensesTable",
      "src\components\expenses\ExpensesTable.tsx",
      "@/features/finance/components/ExpensesTable"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureExpensesTable />;
}
