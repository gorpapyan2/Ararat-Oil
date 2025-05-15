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
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hire_date: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  notes?: string;
}

export interface EmployeeFilters {
  searchQuery?: string;
  department?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface EmployeeSummary {
  totalEmployees: number;
  activeEmployees: number;
  onLeaveEmployees: number;
  departments: {
    name: string;
    count: number;
  }[];
} 