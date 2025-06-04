import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { employeesApi, Employee, EmployeeCreate, EmployeeUpdate } from "@/core/api";
import type {
  EmployeeFilters,
} from "../types/employees.types";

// Define query keys
const QUERY_KEYS = {
  employees: "employees",
  employeesList: (filters?: EmployeeFilters) => ["employees", filters],
  employee: (id: string) => ["employee", id],
  summary: "employees-summary",
};

/**
 * Hook for managing employee data and operations
 */
export function useEmployees(filters?: EmployeeFilters) {
  const queryClient = useQueryClient();

  // Query for fetching employees with filters
  const employees = useQuery({
    queryKey: QUERY_KEYS.employeesList(filters),
    queryFn: () => employeesApi.getEmployees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching employee summary stats - simplified for now
  const summary = useQuery({
    queryKey: [QUERY_KEYS.summary],
    queryFn: () => ({ totalEmployees: 0, activeEmployees: 0, departments: 0 }), // Mock data
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating a new employee
  const createEmployee = useMutation({
    mutationFn: (data: EmployeeCreate) => employeesApi.createEmployee(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.employees] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });

  // Mutation for updating an existing employee
  const updateEmployee = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeUpdate }) =>
      employeesApi.updateEmployee(id, data),
    onSuccess: (updatedEmployee, variables) => {
      // Update cache for single employee query if it exists
      if (updatedEmployee) {
        queryClient.setQueryData(
          QUERY_KEYS.employee(variables.id),
          updatedEmployee
        );
      }
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.employees] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });

  // Mutation for deleting an employee
  const deleteEmployee = useMutation({
    mutationFn: (id: string) => employeesApi.deleteEmployee(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.employee(id) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.employees] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });

  return {
    // Query results
    employees: employees.data || [],
    employeesQuery: employees,
    summary: summary.data,
    summaryQuery: summary,
    isLoading: employees.isLoading || summary.isLoading,
    isError: employees.isError || summary.isError,
    error: employees.error || summary.error,

    // Mutation handlers
    createEmployee,
    updateEmployee,
    deleteEmployee,

    // Refetch functions
    refetchEmployees: employees.refetch,
    refetchSummary: summary.refetch,
  };
}

// Separate custom hook for fetching a single employee by ID
export function useEmployeeById(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.employee(id),
    queryFn: () => employeesApi.getEmployeeById(id),
    enabled: !!id,
  });
}
