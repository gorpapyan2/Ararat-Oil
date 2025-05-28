import { employeesApi } from '../core/api/endpoints/employees';
import type { Employee } from '../core/api/types';

export interface CreateEmployeeRequest {
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: "active" | "inactive" | "on_leave";
  department?: string;
}

export interface UpdateEmployeeRequest {
  name?: string;
  position?: string;
  contact?: string;
  salary?: number;
  hire_date?: string;
  status?: "active" | "inactive" | "on_leave";
  department?: string;
}

export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await employeesApi.getEmployees();

    if (response.error) {
      console.error('Error fetching employees:', response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch employees:', err);
    throw err;
  }
};

export const fetchActiveEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await employeesApi.getActiveEmployees();

    if (response.error) {
      console.error('Error fetching active employees:', response.error);
      throw new Error(response.error.message);
    }

    return response.data || [];
  } catch (err) {
    console.error('Failed to fetch active employees:', err);
    throw err;
  }
};

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const response = await employeesApi.getEmployeeById(id);

    if (response.error) {
      console.error(`Error fetching employee with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data || null;
  } catch (err) {
    console.error(`Failed to fetch employee with ID ${id}:`, err);
    throw err;
  }
};

export const createEmployee = async (employee: CreateEmployeeRequest): Promise<Employee> => {
  try {
    const response = await employeesApi.createEmployee(employee);

    if (response.error) {
      console.error('Error creating employee:', response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error('Failed to create employee:', err);
    throw err;
  }
};

export const updateEmployee = async (id: string, updates: UpdateEmployeeRequest): Promise<Employee> => {
  try {
    const response = await employeesApi.updateEmployee(id, updates);

    if (response.error) {
      console.error(`Error updating employee with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }

    return response.data!;
  } catch (err) {
    console.error(`Failed to update employee with ID ${id}:`, err);
    throw err;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const response = await employeesApi.deleteEmployee(id);

    if (response.error) {
      console.error(`Error deleting employee with ID ${id}:`, response.error);
      throw new Error(response.error.message);
    }
  } catch (err) {
    console.error(`Failed to delete employee with ID ${id}:`, err);
    throw err;
  }
};
