/**
 * @deprecated This component is deprecated and will be removed in the next major version.
 * Please use the standardized version from the feature directory instead:
 * {@link import('@/features/employees/components/EmployeesTableStandardized')}
 * 
 * Deprecation Date: 2023-06-22
 * Planned Removal Date: 2023-12-22
 * Migration Guide: See docs/refactoring/component-deprecation-schedule.md
 */
import React, { useEffect } from "react";
import { trackDeprecatedComponentUsage } from "@/utils/deprecation/tracking";
import { EmployeesTableStandardized } from "./EmployeesTableStandardized";
import type { Employee } from "../types/employees.types";

interface EmployeesTableProps {
  employees: Employee[];
  onEdit?: (employee: Employee) => void;
  onDelete?: (employee: Employee) => void;
  onView?: (employee: Employee) => void;
  isLoading?: boolean;
  positions?: { id: string; name: string }[];
  departments?: { id: string; name: string }[];
  onFiltersChange?: (filters: any) => void;
  totalCount?: number;
  onPageChange?: (page: number, pageSize: number) => void;
  onSortChange?: (column: string | null, direction: 'asc' | 'desc') => void;
}

/**
 * @deprecated This component is a bridge to the standardized version.
 * Please use EmployeesTableStandardized instead.
 */
function EmployeesTable(props: EmployeesTableProps) {
  // Issue a deprecation warning
  useEffect(() => {
    trackDeprecatedComponentUsage(
      "EmployeesTable",
      "src/features/employees/components/EmployeesTable.tsx",
      "@/features/employees/components/EmployeesTableStandardized"
    );
  }, []);

  // Convert onDelete to accept string id instead of Employee object
  const handleDelete = props.onDelete 
    ? (id: string) => {
        const employee = props.employees.find(e => e.id === id);
        if (employee) props.onDelete!(employee);
      }
    : undefined;
    
  // Forward all props to the standardized component with adjusted onDelete
  return <EmployeesTableStandardized 
    {...props} 
    onDelete={handleDelete}
    isLoading={props.isLoading || false}  
  />;
}

export { EmployeesTable };
export default EmployeesTable; 