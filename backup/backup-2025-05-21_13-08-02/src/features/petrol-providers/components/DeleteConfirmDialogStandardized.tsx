/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/petrol-providers/components/DeleteConfirmDialogStandardized')}
 * 
 * Deprecation Date: 2023-06-17
 * Planned Removal Date: 2023-12-17
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { DeleteConfirmDialogStandardized as FeatureDeleteConfirmDialogStandardized } from "@/features/petrol-providers/components/DeleteConfirmDialogStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/petrol-providers/components/DeleteConfirmDialogStandardized')}
 */
export function DeleteConfirmDialogStandardized(props) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "DeleteConfirmDialogStandardized",
      "src\components\petrol-providers\DeleteConfirmDialogStandardized.tsx",
      "@/features/petrol-providers/components/DeleteConfirmDialogStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureDeleteConfirmDialogStandardized {...props} />;
}
