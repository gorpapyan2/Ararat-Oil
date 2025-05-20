/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesDebugger')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelSuppliesDebugger as FeatureFuelSuppliesDebugger } from "@/features/fuel-supplies/components/FuelSuppliesDebugger";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesDebugger')}
 */
export default function FuelSuppliesDebugger() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelSuppliesDebugger",
      "src\components\fuel-supplies\FuelSuppliesDebugger.tsx",
      "@/features/fuel-supplies/components/FuelSuppliesDebugger"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelSuppliesDebugger />;
}
