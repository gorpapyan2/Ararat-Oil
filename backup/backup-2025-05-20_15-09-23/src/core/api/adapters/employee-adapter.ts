import { ApiEmployee } from '../types/employee-types';
import { Employee, EmployeeStatus } from '@/types';

/**
 * Converts API employee data format to the application's employee data format
 */
function fromApiData(data: ApiEmployee): Employee;
function fromApiData(data: ApiEmployee[]): Employee[];
function fromApiData(data: ApiEmployee | ApiEmployee[]): Employee | Employee[] {
  if (Array.isArray(data)) {
    return data.map(item => fromApiData(item));
  }

  return {
    id: data.id,
    name: data.name,
    position: data.position,
    contact: data.contact,
    salary: data.salary,
    hire_date: data.hire_date,
    status: data.status as EmployeeStatus,
    created_at: data.created_at,
    updated_at: data.updated_at || null
  };
}

/**
 * Converts application's employee data format to the API employee data format
 */
function toApiData(data: Employee): ApiEmployee;
function toApiData(data: Employee[]): ApiEmployee[];
function toApiData(data: Employee | Employee[]): ApiEmployee | ApiEmployee[] {
  if (Array.isArray(data)) {
    return data.map(item => toApiData(item));
  }

  return {
    id: data.id,
    name: data.name,
    position: data.position,
    contact: data.contact,
    salary: data.salary,
    hire_date: data.hire_date,
    status: data.status,
    department: '',
    created_at: data.created_at,
    updated_at: data.updated_at || null
  };
}

export const employeeAdapter = {
  fromApiData,
  toApiData
};

// Export old function names for backward compatibility
export const adaptApiEmployeeToAppEmployee = fromApiData;
export const adaptAppEmployeeToApiEmployee = toApiData; 