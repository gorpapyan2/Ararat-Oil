import { fetchFromFunction, ApiResponse } from '../client';
import type { Employee } from '../types';

/**
 * Get all employees with optional filtering
 * @param filters Optional filters for employee data
 * @returns ApiResponse with array of employees
 */
export async function getEmployees(filters?: { status?: string }): Promise<ApiResponse<Employee[]>> {
  return fetchFromFunction('employees', { queryParams: filters });
}

/**
 * Get a specific employee by ID
 * @param id The employee ID
 * @returns ApiResponse with the employee data
 */
export async function getEmployeeById(id: string): Promise<ApiResponse<Employee>> {
  return fetchFromFunction(`employees/${id}`);
}

/**
 * Get all active employees
 * @returns ApiResponse with array of active employees
 */
export async function getActiveEmployees(): Promise<ApiResponse<Employee[]>> {
  return fetchFromFunction('employees/active');
}

/**
 * Create a new employee
 * @param data The employee data to create
 * @returns ApiResponse with the created employee
 */
export async function createEmployee(data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Employee>> {
  return fetchFromFunction('employees', { method: 'POST', body: data });
}

/**
 * Update an existing employee
 * @param id The employee ID to update
 * @param data The updated employee data
 * @returns ApiResponse with the updated employee
 */
export async function updateEmployee(id: string, data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Employee>> {
  return fetchFromFunction(`employees/${id}`, { method: 'PUT', body: data });
}

/**
 * Delete an employee
 * @param id The employee ID to delete
 * @returns ApiResponse with success status
 */
export async function deleteEmployee(id: string): Promise<ApiResponse<void>> {
  return fetchFromFunction(`employees/${id}`, { method: 'DELETE' });
}

/**
 * Employees API functions for managing employee data
 */
export const employeesApi = {
  getEmployees,
  getEmployeeById,
  getActiveEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee
}; 