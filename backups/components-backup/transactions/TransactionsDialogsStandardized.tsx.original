/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/TransactionsDialogsStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TransactionsDialogsStandardized as FeatureTransactionsDialogsStandardized } from "@/features/finance/components/TransactionsDialogsStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/finance/components/TransactionsDialogsStandardized')}
 */
export default function TransactionsDialogsStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TransactionsDialogsStandardized",
      "src\components\transactions\TransactionsDialogsStandardized.tsx",
      "@/features/finance/components/TransactionsDialogsStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTransactionsDialogsStandardized />;
}
