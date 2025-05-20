/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesDatePicker')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { FuelSuppliesDatePicker as FeatureFuelSuppliesDatePicker } from "@/features/fuel-supplies/components/FuelSuppliesDatePicker";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/FuelSuppliesDatePicker')}
 */
export default function FuelSuppliesDatePicker() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "FuelSuppliesDatePicker",
      "src\components\fuel-supplies\FuelSuppliesDatePicker.tsx",
      "@/features/fuel-supplies/components/FuelSuppliesDatePicker"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureFuelSuppliesDatePicker />;
}
