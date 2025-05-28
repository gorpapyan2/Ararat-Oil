/**
 * Employee Hooks - Refactored Version
 *
 * This file demonstrates the migration from the old implementation to
 * the new standardized API hooks.
 */

import { createResourceHooks } from "@/hooks/api";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSummary,
} from "../services";
import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
} from "../types/employees.types";
import type { ResourceService } from "@/hooks/api/types";

// Define the employee service implementation
const employeeService: ResourceService<Employee, EmployeeFilters, EmployeeFormData, EmployeeFormData> = {
  getList: getEmployees,
  getById: getEmployeeById,
  create: createEmployee,
  update: updateEmployee,
  delete: deleteEmployee,
  getSummary: getEmployeeSummary,
};

// Create all employee hooks with a single factory call
const {
  useList: useEmployeesList,
  useById: useEmployeeById,
  useCreate: useCreateEmployee,
  useUpdate: useUpdateEmployee,
  useDelete: useDeleteEmployee,
  useSummary: useEmployeeSummary,
} = createResourceHooks<
  Employee,
  EmployeeFilters,
  EmployeeFormData,
  EmployeeFormData
>({
  resourceName: "employees",
  service: employeeService,
  options: {
    staleTime: 5 * 60 * 1000, // 5 minutes
  },
});

/**
 * Backward compatible hook that combines multiple hooks
 * for a simpler migration path
 */
export function useEmployees(filters?: EmployeeFilters) {
  const employees = useEmployeesList(filters);
  const summary = useEmployeeSummary();
  const createEmployeeMutation = useCreateEmployee();
  const updateEmployeeMutation = useUpdateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  return {
    // Query results
    employees: employees.data || [],
    employeesQuery: employees,
    summary: summary?.data,
    summaryQuery: summary,
    isLoading: employees.isLoading || (summary?.isLoading ?? false),
    isError: employees.isError || (summary?.isError ?? false),
    error: employees.error || (summary?.error ?? null),

    // Mutation handlers
    createEmployee: createEmployeeMutation,
    updateEmployee: updateEmployeeMutation,
    deleteEmployee: deleteEmployeeMutation,

    // Helper functions
    getEmployeeById: useEmployeeById,

    // Refetch functions
    refetchEmployees: employees.refetch,
    refetchSummary: summary?.refetch,
  };
}

// Export individual hooks for more granular usage
export {
  useEmployeesList,
  useEmployeeById,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
  useEmployeeSummary,
};
