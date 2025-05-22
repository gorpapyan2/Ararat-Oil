/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesFormStandardized')}
 * 
 * Deprecation Date: 2023-06-17
 * Planned Removal Date: 2023-12-17
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelSuppliesFormStandardized as FeatureFuelSuppliesFormStandardized } from "@/features/fuel-supplies/components/FuelSuppliesFormStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesFormStandardized')}
 */
export function FuelSuppliesFormStandardized(props) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelSuppliesFormStandardized",
      "src\components\fuel-supplies\FuelSuppliesFormStandardized.tsx",
      "@/features/fuel-supplies/components/FuelSuppliesFormStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelSuppliesFormStandardized {...props} />;
}
