import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesService } from '../services/employeesService';
import type { Employee, EmployeeFormData, EmployeeFilters } from '../types/employees.types';

export function useEmployees(filters?: EmployeeFilters) {
  const queryClient = useQueryClient();

  const employees = useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesService.getEmployees(filters),
  });

  const summary = useQuery({
    queryKey: ['employees-summary'],
    queryFn: employeesService.getEmployeeSummary,
  });

  const createEmployee = useMutation({
    mutationFn: employeesService.createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  const updateEmployee = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EmployeeFormData> }) =>
      employeesService.updateEmployee(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  const deleteEmployee = useMutation({
    mutationFn: employeesService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees-summary'] });
    },
  });

  return {
    employees: employees.data || [],
    summary: summary.data,
    isLoading: employees.isLoading || summary.isLoading,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
} 