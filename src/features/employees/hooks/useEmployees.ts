import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesService } from '../services/employeesService';
import type { Employee, EmployeeFormData, EmployeeFilters } from '../types/employees.types';

/**
 * Hook for managing employee data and operations
 */
export function useEmployees(filters?: EmployeeFilters) {
  const queryClient = useQueryClient();

  // Query for fetching employees with filters
  const employees = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesService.getEmployees(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for fetching employee summary stats
  const summary = useQuery({
    queryKey: ['employees-summary'],
    queryFn: employeesService.getEmployeeSummary,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Mutation for creating a new employee
  const createEmployee = useMutation({
    mutationFn: (data: EmployeeFormData) => employeesService.createEmployee(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  // Mutation for updating an existing employee
  const updateEmployee = useMutation({
    mutationFn: ({ id, data }: { id: string; data: EmployeeFormData }) =>
      employeesService.updateEmployee(id, data),
    onSuccess: (updatedEmployee, variables) => {
      // Update cache for single employee query if it exists
      if (updatedEmployee) {
        queryClient.setQueryData(
          ['employee', variables.id],
          updatedEmployee
        );
      }
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  // Mutation for deleting an employee
  const deleteEmployee = useMutation({
    mutationFn: (id: string) => employeesService.deleteEmployee(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: ['employee', id] });
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  // Hook for fetching a single employee by ID
  const getEmployeeById = (id: string) => 
    useQuery({
      queryKey: ['employee', id],
      queryFn: () => employeesService.getEmployeeById(id),
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