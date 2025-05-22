/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/TransactionsManagerStandardized')}
 * 
 * Deprecation Date: 2023-06-19
 * Planned Removal Date: 2023-12-19
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { TransactionsManagerStandardized as FeatureTransactionsManagerStandardized } from "@/features/finance/components/TransactionsManagerStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/finance/components/TransactionsManagerStandardized')}
 */
export function TransactionsManagerStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "TransactionsManagerStandardized",
      "src\components\transactions\TransactionsManagerStandardized.tsx",
      "@/features/finance/components/TransactionsManagerStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureTransactionsManagerStandardized />;
}
