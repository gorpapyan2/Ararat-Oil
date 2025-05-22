/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/employees/components/EmployeeManagerStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { EmployeeManagerStandardized as FeatureEmployeeManagerStandardized } from "@/features/employees/components/EmployeeManagerStandardized";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/employees/components/EmployeeManagerStandardized')}
 */
export default function EmployeeManagerStandardized() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "EmployeeManagerStandardized",
      "src\components\employees\EmployeeManagerStandardized.tsx",
      "@/features/employees/components/EmployeeManagerStandardized"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureEmployeeManagerStandardized />;
}
