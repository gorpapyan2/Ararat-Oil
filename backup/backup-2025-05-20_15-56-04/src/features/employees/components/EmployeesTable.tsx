/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/employees/components/EmployeesTable')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { EmployeesTable as FeatureEmployeesTable } from "@/features/employees/components/EmployeesTable";

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please update imports to use the standardized component directly:
 * {@link import('@/features/employees/components/EmployeesTable')}
 */
export default function EmployeesTable() {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "EmployeesTable",
      "src\components\employees\EmployeesTable.tsx",
      "@/features/employees/components/EmployeesTable"
    );
  }, []);
  
  // Re-export the feature component
  return <FeatureEmployeesTable />;
}
