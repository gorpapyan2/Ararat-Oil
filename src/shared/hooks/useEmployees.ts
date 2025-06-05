/**
 * Centralized Employee Hooks
 * 
 * This file contains all employee-related React Query hooks used across the application.
 * Import from this file instead of creating duplicate hook implementations.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesApi } from "@/core/api";
import { useToast } from "@/hooks";
import type {
  Employee,
  EmployeeCreate,
  EmployeeUpdate,
} from "@/core/api/types";

// Define query keys as constants for consistency
export const EMPLOYEE_QUERY_KEYS = {
  employees: ["employees"] as const,
  employee: (id: string) => ["employee", id] as const,
  employeesList: (filters?: any) => ["employees", "list", filters] as const,
  summary: ["employees", "summary"] as const,
} as const;

/**
 * Hook for fetching all employees with optional filters
 * @param filters - Optional filters for employees
 * @returns Query object for employees list
 */
export function useEmployees(filters?: { status?: string }) {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.employeesList(filters),
    queryFn: async () => {
      const response = await employeesApi.getEmployees(filters);
      return response.data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching an employee by ID
 * @param id - Employee ID
 * @returns Query object for single employee
 */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.employee(id),
    queryFn: async () => {
      const response = await employeesApi.getEmployeeById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

/**
 * Hook for fetching employee summary statistics
 * @returns Query object for employee summary
 */
export function useEmployeeSummary() {
  return useQuery({
    queryKey: EMPLOYEE_QUERY_KEYS.summary,
    queryFn: async () => {
      // TODO: Implement actual API call when summary endpoint is available
      return {
        totalEmployees: 0,
        activeEmployees: 0,
        departments: 0,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook for employee mutations (create, update, delete)
 * @returns Mutation objects for employee operations
 */
export function useEmployeeMutations() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Create employee mutation
  const createEmployee = useMutation({
    mutationFn: async (data: EmployeeCreate) => {
      const response = await employeesApi.createEmployee(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Employee created successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create employee",
        variant: "error",
      });
    },
  });

  // Update employee mutation
  const updateEmployee = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EmployeeUpdate }) => {
      const response = await employeesApi.updateEmployee(id, data);
      return response.data;
    },
    onSuccess: (updatedEmployee, { id }) => {
      if (updatedEmployee) {
        queryClient.setQueryData(EMPLOYEE_QUERY_KEYS.employee(id), updatedEmployee);
      }
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Employee updated successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update employee",
        variant: "error",
      });
    },
  });

  // Delete employee mutation
  const deleteEmployee = useMutation({
    mutationFn: async (id: string) => {
      const response = await employeesApi.deleteEmployee(id);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employee(id) });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.employees });
      queryClient.invalidateQueries({ queryKey: EMPLOYEE_QUERY_KEYS.summary });
      toast({
        title: "Success",
        description: "Employee deleted successfully",
        variant: "success",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to delete employee",
        variant: "error",
      });
    },
  });

  return {
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}

/**
 * Convenience hook that combines all employee hooks for easy use in components
 * @param filters - Optional filters for employees list
 * @returns Combined query results and mutation functions
 */
export function useEmployeesManager(filters?: { status?: string }) {
  const employeesQuery = useEmployees(filters);
  const summaryQuery = useEmployeeSummary();
  const mutations = useEmployeeMutations();

  // Compute combined loading state
  const isLoading = employeesQuery.isLoading || summaryQuery.isLoading;

  // Compute combined error state
  const error = employeesQuery.error || summaryQuery.error;

  return {
    // Data properties
    employees: employeesQuery.data || [],
    summary: summaryQuery.data,

    // Combined states
    isLoading,
    error,

    // Individual states
    isLoadingEmployees: employeesQuery.isLoading,
    isLoadingSummary: summaryQuery.isLoading,
    employeesError: employeesQuery.error,
    summaryError: summaryQuery.error,

    // Query objects for advanced usage
    employeesQuery,
    summaryQuery,

    // Mutations
    ...mutations,

    // Helper functions
    getEmployeeById: useEmployee,

    // Refetch functions
    refetchEmployees: employeesQuery.refetch,
    refetchSummary: summaryQuery.refetch,

    // Refetch all
    refetchAll: () => {
      employeesQuery.refetch();
      summaryQuery.refetch();
    },
  };
} 