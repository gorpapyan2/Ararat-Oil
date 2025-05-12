import { employeesApi } from "@/services/api";
import { Employee, EmployeeStatus } from "@/types";

export interface CreateEmployeeRequest {
  name: string;
  position: string;
  contact: string;
  salary: number;
  hire_date: string;
  status: EmployeeStatus;
}

export interface UpdateEmployeeRequest {
  name?: string;
  position?: string;
  contact?: string;
  salary?: number;
  hire_date?: string;
  status?: EmployeeStatus;
}

export const fetchEmployees = async (options?: { status?: EmployeeStatus }): Promise<Employee[]> => {
  try {
    const { data, error } = await employeesApi.getAll(options);

    if (error) {
      console.error("Error fetching employees:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch employees:", err);
    throw err;
  }
};

export const fetchActiveEmployees = async (): Promise<Employee[]> => {
  try {
    const { data, error } = await employeesApi.getActive();

    if (error) {
      console.error("Error fetching active employees:", error);
      throw new Error(error);
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch active employees:", err);
    throw err;
  }
};

export const fetchEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data, error } = await employeesApi.getById(id);

    if (error) {
      console.error(`Error fetching employee with ID ${id}:`, error);
      throw new Error(error);
    }

    return data || null;
  } catch (err) {
    console.error(`Failed to fetch employee with ID ${id}:`, err);
    throw err;
  }
};

export const createEmployee = async (
  employee: CreateEmployeeRequest
): Promise<Employee> => {
  try {
    const { data, error } = await employeesApi.create(employee);

    if (error) {
      console.error("Error creating employee:", error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error("Failed to create employee:", err);
    throw err;
  }
};

export const updateEmployee = async (
  id: string,
  employee: UpdateEmployeeRequest
): Promise<Employee> => {
  try {
    const { data, error } = await employeesApi.update(id, employee);

    if (error) {
      console.error(`Error updating employee with ID ${id}:`, error);
      throw new Error(error);
    }

    return data;
  } catch (err) {
    console.error(`Failed to update employee with ID ${id}:`, err);
    throw err;
  }
};

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    const { error } = await employeesApi.delete(id);

    if (error) {
      console.error(`Error deleting employee with ID ${id}:`, error);
      throw new Error(error);
    }
  } catch (err) {
    console.error(`Failed to delete employee with ID ${id}:`, err);
    throw err;
  }
};
