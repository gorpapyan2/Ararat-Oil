/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesSearchBar')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelSuppliesSearchBar as FeatureFuelSuppliesSearchBar } from "@/features/fuel-supplies/components/FuelSuppliesSearchBar";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesSearchBar')}
 */
export default function FuelSuppliesSearchBar() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelSuppliesSearchBar",
      "src\components\fuel-supplies\FuelSuppliesSearchBar.tsx",
      "@/features/fuel-supplies/components/FuelSuppliesSearchBar"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelSuppliesSearchBar />;
}
