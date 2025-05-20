// Re-export the original service
export * from './employeesService';

// Import API endpoints
import { employeesApi } from '@/core/api/endpoints/employees';
import type { Employee as ApiEmployee } from '@/core/api/types';
import type { 
  Employee, 
  EmployeeFormData, 
  EmployeeFilters,
  EmployeeSummary
} from '../types/employees.types';
import { extractDepartment, normalizeStatus } from '../utils/employeeMappers';

// Helper function to adapt API response to feature type
function adaptApiResponseToFeatureType(apiEmployee: ApiEmployee): Employee {
  // Parse name into first and last name (assuming format "First Last")
  const nameParts = apiEmployee.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Parse contact string (assuming format "email|phone")
  const contactParts = (apiEmployee.contact || '').split('|');
  const email = contactParts[0] || '';
  const phone = contactParts[1] || '';

  return {
    id: apiEmployee.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    position: apiEmployee.position,
    department: extractDepartment(apiEmployee.status || ''),
    hire_date: apiEmployee.hire_date,
    salary: apiEmployee.salary,
    status: normalizeStatus(apiEmployee.status || ''),
    notes: '',
    created_at: apiEmployee.created_at,
    updated_at: apiEmployee.updated_at
  };
}

// Helper function to adapt feature type to API request for creation/update
function adaptFeatureTypeToApiRequest(employee: EmployeeFormData) {
  // Combine first and last name
  const name = `${employee.first_name} ${employee.last_name}`;
  
  // Combine email and phone into contact string
  const contact = `${employee.email}|${employee.phone}`;
  
  // Store department info in status field if not general
  let status: string = employee.status;
  if (employee.department !== 'general') {
    status = `dept:${employee.department}`;
  }
  
  return {
    name,
    contact,
    position: employee.position,
    hire_date: employee.hire_date,
    salary: employee.salary,
    status,
  };
}

/**
 * Get all employees with optional filters
 */
export async function getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
  const response = await employeesApi.getEmployees();
  
  if (response.error) {
    throw new Error(response.error.message);
  }
  
  let employees = (response.data || []).map(adaptApiResponseToFeatureType);
  
  // Apply client-side filtering if filters provided
  if (filters) {
    if (filters.status) {
      employees = employees.filter(e => e.status === filters.status);
    }
    
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      employees = employees.filter(e => 
        e.first_name.toLowerCase().includes(query) || 
        e.last_name.toLowerCase().includes(query) ||
        e.position.toLowerCase().includes(query)
      );
    }
    
    if (filters.department) {
      employees = employees.filter(e => e.department === filters.department);
    }
  }
  
  return employees;
}

/**
 * Get an employee by ID
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  const response = await employeesApi.getEmployeeById(id);
  
  if (response.error) {
    console.error('Error fetching employee:', response.error.message);
    return null;
  }
  
  if (!response.data) {
    return null;
  }
  
  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Create a new employee
 */
export async function createEmployee(employeeData: EmployeeFormData): Promise<Employee | null> {
  const apiData = adaptFeatureTypeToApiRequest(employeeData);
  
  const response = await employeesApi.createEmployee(apiData);
  
  if (response.error) {
    console.error('Error creating employee:', response.error.message);
    return null;
  }
  
  if (!response.data) {
    return null;
  }
  
  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Update an existing employee
 */
export async function updateEmployee(id: string, employeeData: EmployeeFormData): Promise<Employee | null> {
  const apiData = adaptFeatureTypeToApiRequest(employeeData);
  
  const response = await employeesApi.updateEmployee(id, apiData);
  
  if (response.error) {
    console.error('Error updating employee:', response.error.message);
    return null;
  }
  
  if (!response.data) {
    return null;
  }
  
  return adaptApiResponseToFeatureType(response.data);
}

/**
 * Delete an employee
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  const response = await employeesApi.deleteEmployee(id);
  
  if (response.error) {
    console.error('Error deleting employee:', response.error.message);
    return false;
  }
  
  return true;
}

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  const allEmployees = await getEmployees();
  return allEmployees.filter(employee => employee.department === department);
}

/**
 * Get employee summary statistics
 */
export async function getEmployeeSummary(): Promise<EmployeeSummary | null> {
  try {
    const employees = await getEmployees();
    
    const summary: EmployeeSummary = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      onLeaveEmployees: employees.filter(e => e.status === 'on_leave').length,
      departments: Object.entries(
        employees.reduce((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => ({ name, count }))
    };
    
    return summary;
  } catch (error) {
    console.error('Error fetching employee summary:', error);
    return null;
  }
}

// Export as an object for compatibility with existing code
export const employeesService = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeesByDepartment,
  getEmployeeSummary
}; 