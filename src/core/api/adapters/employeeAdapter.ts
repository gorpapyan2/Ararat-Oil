/**
 * Employee Type Adapter
 *
 * This file provides adapter functions to convert between the core API Employee type
 * and the application's Employee type as defined in src/types/index.ts.
 */

import { Employee as ApiEmployee } from "@/core/api/types";
import { Employee as AppEmployee, EmployeeStatus } from "@/types";

/**
 * Converts a core API Employee to the application Employee type
 */
export function adaptApiEmployeeToAppEmployee(
  apiEmployee: ApiEmployee
): AppEmployee {
  // Map the API status string to the app's EmployeeStatus enum
  let status: EmployeeStatus = "active";

  if (apiEmployee.status === "on_leave") {
    status = "on_leave";
  } else if (
    apiEmployee.status === "inactive" ||
    apiEmployee.status === "terminated"
  ) {
    status = "inactive";
  }

  return {
    id: apiEmployee.id,
    name: apiEmployee.name,
    position: apiEmployee.position,
    contact: apiEmployee.contact,
    salary: apiEmployee.salary,
    hire_date: apiEmployee.hire_date,
    status: status,
    created_at: apiEmployee.created_at,
  };
}

/**
 * Converts an array of core API Employees to application Employee types
 */
export function adaptApiEmployeesToAppEmployees(
  apiEmployees: ApiEmployee[]
): AppEmployee[] {
  return apiEmployees.map(adaptApiEmployeeToAppEmployee);
}

/**
 * Converts an application Employee to the core API Employee type
 */
export function adaptAppEmployeeToApiEmployee(
  appEmployee: AppEmployee
): Omit<ApiEmployee, "created_at" | "updated_at"> {
  // Map the app's EmployeeStatus enum to the API status string
  let status: string = "active";

  if (appEmployee.status === "on_leave") {
    status = "on_leave";
  } else if (appEmployee.status === "inactive") {
    status = "inactive";
  }

  return {
    id: appEmployee.id,
    name: appEmployee.name,
    position: appEmployee.position,
    contact: appEmployee.contact,
    salary: appEmployee.salary,
    hire_date: appEmployee.hire_date,
    status: status,
    department: "", // Default department
  };
}

/**
 * Converts an array of application Employees to core API Employee types
 */
export function adaptAppEmployeesToApiEmployees(
  appEmployees: AppEmployee[]
): Omit<ApiEmployee, "created_at" | "updated_at">[] {
  return appEmployees.map(adaptAppEmployeeToApiEmployee);
}
