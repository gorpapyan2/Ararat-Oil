/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel/components/FuelManagementDashboard')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelManagementDashboard as FeatureFuelManagementDashboard } from "@/features/fuel/components/FuelManagementDashboard";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel/components/FuelManagementDashboard')}
 */
export default function FuelManagementDashboard() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelManagementDashboard",
      "src\components\fuel\FuelManagementDashboard.tsx",
      "@/features/fuel/components/FuelManagementDashboard"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelManagementDashboard />;
}
