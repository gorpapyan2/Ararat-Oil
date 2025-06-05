/**
 * @deprecated This file has been superseded by @/shared/hooks/useEmployees
 * Please import employee hooks from @/shared/hooks/useEmployees instead
 * 
 * This file is maintained for backward compatibility but will be removed in a future version.
 */

export {
  useEmployees,
  useEmployee,
  useEmployeeSummary,
  useEmployeeMutations,
  useEmployeesManager,
  EMPLOYEE_QUERY_KEYS,
} from "@/shared/hooks/useEmployees";

// Re-export types for backward compatibility
export type {   
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
} from "@/core/api/types";

// Keep the EmployeeFilters type from the local types file if it exists
export type { EmployeeFilters } from "../types/employees.types";
