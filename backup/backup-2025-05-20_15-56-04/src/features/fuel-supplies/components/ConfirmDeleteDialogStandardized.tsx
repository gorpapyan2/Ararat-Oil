/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized')}
 * 
 * Deprecation Date: 2023-06-17
 * Planned Removal Date: 2023-12-17
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { ConfirmDeleteDialogStandardized as FeatureConfirmDeleteDialogStandardized } from "@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized')}
 */
export function ConfirmDeleteDialogStandardized(props) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "ConfirmDeleteDialogStandardized",
      "src\components\fuel-supplies\ConfirmDeleteDialogStandardized.tsx",
      "@/features/fuel-supplies/components/ConfirmDeleteDialogStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureConfirmDeleteDialogStandardized {...props} />;
}
