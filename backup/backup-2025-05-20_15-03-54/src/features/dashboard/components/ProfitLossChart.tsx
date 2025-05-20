/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/dashboard/components/ProfitLossChart')}
 * 
 * Deprecation Date: 2023-06-16
 * Planned Removal Date: 2023-12-16
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ProfitLossChart as FeatureProfitLossChart } from "@/features/dashboard/components/ProfitLossChart";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/dashboard/components/ProfitLossChart')}
 */
export function ProfitLossChart() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ProfitLossChart",
      "src\components\dashboard\ProfitLossChart.tsx",
      "@/features/dashboard/components/ProfitLossChart"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureProfitLossChart />;
}
