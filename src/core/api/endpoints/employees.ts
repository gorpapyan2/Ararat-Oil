import { fetchFromFunction, ApiResponse } from '../client';
import type { Employee } from '../types';

/**
 * Employees API functions for managing employee data
 */
export const employeesApi = {
  /**
   * Get all employees with optional filtering
   * @param filters Optional filters for employee data
   * @returns ApiResponse with array of employees
   */
  getAll: (filters?: { status?: string }): Promise<ApiResponse<Employee[]>> => 
    fetchFromFunction('employees', { queryParams: filters }),
  
  /**
   * Get a specific employee by ID
   * @param id The employee ID
   * @returns ApiResponse with the employee data
   */
  getById: (id: string): Promise<ApiResponse<Employee>> => 
    fetchFromFunction(`employees/${id}`),
  
  /**
   * Get all active employees
   * @returns ApiResponse with array of active employees
   */
  getActive: (): Promise<ApiResponse<Employee[]>> => 
    fetchFromFunction('employees/active'),
  
  /**
   * Create a new employee
   * @param data The employee data to create
   * @returns ApiResponse with the created employee
   */
  create: (data: Omit<Employee, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Employee>> => 
    fetchFromFunction('employees', { method: 'POST', body: data }),
  
  /**
   * Update an existing employee
   * @param id The employee ID to update
   * @param data The updated employee data
   * @returns ApiResponse with the updated employee
   */
  update: (id: string, data: Partial<Omit<Employee, 'id' | 'created_at' | 'updated_at'>>): Promise<ApiResponse<Employee>> => 
    fetchFromFunction(`employees/${id}`, { method: 'PUT', body: data }),
  
  /**
   * Delete an employee
   * @param id The employee ID to delete
   * @returns ApiResponse with success status
   */
  delete: (id: string): Promise<ApiResponse<void>> => 
    fetchFromFunction(`employees/${id}`, { method: 'DELETE' }),
}; 