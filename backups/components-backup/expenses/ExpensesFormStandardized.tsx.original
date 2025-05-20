/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/finance/components/ExpensesFormStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ExpensesFormStandardized as FeatureExpensesFormStandardized } from "@/features/finance/components/ExpensesFormStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/finance/components/ExpensesFormStandardized')}
 */
export default function ExpensesFormStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ExpensesFormStandardized",
      "src\components\expenses\ExpensesFormStandardized.tsx",
      "@/features/finance/components/ExpensesFormStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureExpensesFormStandardized />;
}
