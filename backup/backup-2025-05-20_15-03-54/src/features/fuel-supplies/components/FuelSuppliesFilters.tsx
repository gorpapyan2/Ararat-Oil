/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesFilters')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelSuppliesFilters as FeatureFuelSuppliesFilters } from "@/features/fuel-supplies/components/FuelSuppliesFilters";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesFilters')}
 */
export default function FuelSuppliesFilters() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelSuppliesFilters",
      "src\components\fuel-supplies\FuelSuppliesFilters.tsx",
      "@/features/fuel-supplies/components/FuelSuppliesFilters"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelSuppliesFilters />;
}
