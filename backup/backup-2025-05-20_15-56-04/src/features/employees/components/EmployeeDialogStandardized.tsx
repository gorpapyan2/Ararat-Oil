/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/employees/components/EmployeeDialogStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { EmployeeDialogStandardized as FeatureEmployeeDialogStandardized } from "@/features/employees/components/EmployeeDialogStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/employees/components/EmployeeDialogStandardized')}
 */
export default function EmployeeDialogStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "EmployeeDialogStandardized",
      "src\components\employees\EmployeeDialogStandardized.tsx",
      "@/features/employees/components/EmployeeDialogStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureEmployeeDialogStandardized />;
}
