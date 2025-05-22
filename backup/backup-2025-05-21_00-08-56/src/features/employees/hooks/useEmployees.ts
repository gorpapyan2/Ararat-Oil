import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getEmployees,
  getEmployeeById as getEmployeeByIdService,
  createEmployee as createEmployeeService,
  updateEmployee as updateEmployeeService,
  deleteEmployee as deleteEmployeeService,
  getEmployeeSummary as getEmployeeSummaryService
} from '../services';
import type { Employee, EmployeeFormData, EmployeeFilters } from '../types/employees.types';

// Define query keys
const QUERY_KEYS = {
  employees: 'employees',
  employeesList: (filters?: EmployeeFilters) => ['employees', filters],
  employee: (id: string) => ['employee', id],
  summary: 'employees-summary'
};

/**
 * Hook for managing employee data and operations
 */
export function useEmployees(filters?: EmployeeFilters) {
  const queryClient = useQueryClient();

  // Query for fetching employees with filters
  const employees = useQuery({
    queryKey: QUERY_KEYS.employeesList(filters),
    queryFn: () => getEmployees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching employee summary stats
  const summary = useQuery({
    queryKey: [QUERY_KEYS.summary],
    queryFn: getEmployeeSummaryService,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating a new employee
  const createEmployee = useMutation({
    mutationFn: (data: EmployeeFormData) => createEmployeeService(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.employees] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });

  // Mutation for updating an existing employee
  const updateEmployee = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      updateEmployeeService(id, data),
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
    mutationFn: (id: string) => deleteEmployeeService(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.employee(id) });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.employees] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });

  // Hook for fetching a single employee by ID
  const getEmployeeById = (id: string) => 
    useQuery({
      queryKey: QUERY_KEYS.employee(id),
      queryFn: () => getEmployeeByIdService(id),
      enabled: !!id,
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
    
    // Helper functions
    getEmployeeById,
    
    // Refetch functions
    refetchEmployees: employees.refetch,
    refetchSummary: summary.refetch,
  };
} 