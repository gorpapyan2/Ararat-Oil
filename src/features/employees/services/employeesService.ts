import { supabase } from '@/lib/supabase';
import type { Employee, EmployeeFormData, EmployeeFilters } from '../types/employees.types';

export const employeesService = {
  async getEmployees(filters?: EmployeeFilters) {
    let query = supabase
      .from('employees')
      .select('*')
      .order('last_name');

    if (filters?.searchQuery) {
      query = query.or(
        `first_name.ilike.%${filters.searchQuery}%,last_name.ilike.%${filters.searchQuery}%,email.ilike.%${filters.searchQuery}%`
      );
    }

    if (filters?.department) {
      query = query.eq('department', filters.department);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Employee[];
  },

  async createEmployee(employee: EmployeeFormData) {
    const { data, error } = await supabase
      .from('employees')
      .insert(employee)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async updateEmployee(id: string, employee: Partial<EmployeeFormData>) {
    const { data, error } = await supabase
      .from('employees')
      .update(employee)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Employee;
  },

  async deleteEmployee(id: string) {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getEmployeeSummary() {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('status, department');

    if (error) throw error;

    const summary = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      onLeaveEmployees: employees.filter(e => e.status === 'on_leave').length,
      departments: Object.entries(
        employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count })),
    };

    return summary;
  },
}; 