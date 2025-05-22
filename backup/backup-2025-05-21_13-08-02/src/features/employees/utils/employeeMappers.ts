import type { Database } from '@/types/supabase';
import type { Employee, EmployeeFormData } from '../types/employees.types';

// Type for database employees shape
export type DbEmployee = Database['public']['Tables']['employees']['Row'];

/**
 * Extract department information from status field
 * @param status - Status string which may contain department info
 */
export function extractDepartment(status: string): string {
  if (status.includes('dept:')) {
    return status.replace('dept:', '');
  }
  return 'general';
}

/**
 * Normalize status to one of the allowed values
 * @param status - Status string from database
 */
export function normalizeStatus(status: string): 'active' | 'inactive' | 'on_leave' {
  if (status.includes('dept:')) {
    return 'active';
  }
  
  if (['active', 'inactive', 'on_leave'].includes(status)) {
    return status as 'active' | 'inactive' | 'on_leave';
  }
  
  return 'active'; // Default fallback
}

/**
 * Maps a database employee record to a domain Employee model
 * @param dbEmployee - Employee record from database
 * @returns Domain Employee model
 */
export function mapDbToEmployee(dbEmployee: DbEmployee): Employee {
  // Parse name into first and last name (assuming format "First Last")
  const nameParts = dbEmployee.name.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  // Parse contact string (assuming format "email|phone")
  const contactParts = dbEmployee.contact.split('|');
  const email = contactParts[0] || '';
  const phone = contactParts[1] || '';

  return {
    id: dbEmployee.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    position: dbEmployee.position,
    department: extractDepartment(dbEmployee.status),
    hire_date: dbEmployee.hire_date,
    salary: dbEmployee.salary,
    status: normalizeStatus(dbEmployee.status),
    notes: '',
    created_at: dbEmployee.created_at || new Date().toISOString(),
    updated_at: dbEmployee.created_at || new Date().toISOString()
  };
}

/**
 * Maps a domain Employee model to database format for insert/update
 * @param employee - Employee form data
 * @returns Employee data in database format
 */
export function mapEmployeeToDb(employee: EmployeeFormData): Omit<DbEmployee, 'id' | 'created_at'> {
  // Combine first and last name
  const name = `${employee.first_name} ${employee.last_name}`;
  
  // Combine email and phone into contact string
  const contact = `${employee.email}|${employee.phone}`;
  
  // Store department info in status field if not general
  // The database status field is a string type that can hold both status values
  // and department information using our own convention
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
    status
  };
} 