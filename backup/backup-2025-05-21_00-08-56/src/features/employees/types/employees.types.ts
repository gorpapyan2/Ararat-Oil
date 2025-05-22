import type { Database } from '@/types/supabase';

// Type for database employees shape
export type DbEmployee = Database['public']['Tables']['employees']['Row'];

// Employee domain model
export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  notes: string;
  created_at: string;
  updated_at: string;
}

// Form data for creating/updating employees
export type EmployeeFormData = Omit<Employee, 'id' | 'created_at' | 'updated_at'>;

// Filter options for employee queries
export interface EmployeeFilters {
  status?: string;
  searchQuery?: string;
  department?: string;
}

// Summary statistics for employees
export interface EmployeeSummary {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  departments: Array<{
    name: string;
    count: number;
  }>;
} 