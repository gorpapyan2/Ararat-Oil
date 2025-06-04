// Import centralized services from core API
import { 
  employeesApi,
  type Employee as CentralizedEmployee
} from "@/core/api";
import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  EmployeeSummary,
} from "../types/employees.types";
import { extractDepartment, normalizeStatus } from "../utils/employeeMappers";

// Helper function to adapt centralized employee to feature type
function adaptCentralizedToFeatureType(centralizedEmployee: CentralizedEmployee): Employee {
  // Parse name into first and last name (assuming format "First Last")
  const nameParts = centralizedEmployee.name.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Parse contact string (assuming format "email|phone")
  const contactParts = (centralizedEmployee.contact || "").split("|");
  const email = contactParts[0] || "";
  const phone = contactParts[1] || "";

  return {
    id: centralizedEmployee.id,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    position: centralizedEmployee.position,
    department: extractDepartment(centralizedEmployee.status || ""),
    hire_date: centralizedEmployee.hire_date || "",
    salary: centralizedEmployee.salary || 0,
    status: normalizeStatus(centralizedEmployee.status || ""),
    notes: "",
    created_at: centralizedEmployee.created_at || "",
    updated_at: centralizedEmployee.updated_at || "",
  };
}

// Helper function to adapt feature type to centralized request for creation/update
function adaptFeatureTypeToCentralizedRequest(employee: EmployeeFormData) {
  // Combine first and last name
  const name = `${employee.first_name} ${employee.last_name}`;

  // Combine email and phone into contact string
  const contact = `${employee.email}|${employee.phone}`;

  // Store department info in status field if not general, but map to valid status values
  let status: "active" | "inactive" | "on_leave" = employee.status;
  
  // Map department info but ensure we use valid status values
  if (employee.department !== "general" && employee.status === "active") {
    // We'll store department separately if the API supports it, otherwise use status
    status = "active"; // Keep the main status valid
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
 * Get all employees with optional filters using core API
 */
export async function getEmployees(
  filters?: EmployeeFilters
): Promise<Employee[]> {
  try {
    const response = await employeesApi.getEmployees(filters);
    const centralizedEmployees = response.data || [];
    let employees = centralizedEmployees.map(adaptCentralizedToFeatureType);

    // Apply client-side filtering if filters provided
    if (filters) {
      if (filters.status) {
        employees = employees.filter((e) => e.status === filters.status);
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        employees = employees.filter(
          (e) =>
            e.first_name.toLowerCase().includes(query) ||
            e.last_name.toLowerCase().includes(query) ||
            e.position.toLowerCase().includes(query)
        );
      }

      if (filters.department) {
        employees = employees.filter((e) => e.department === filters.department);
      }
    }

    return employees;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch employees');
  }
}

/**
 * Get an employee by ID using core API
 */
export async function getEmployeeById(id: string): Promise<Employee | null> {
  try {
    const response = await employeesApi.getEmployeeById(id);
    
    if (!response.data) {
      return null;
    }

    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    console.error("Error fetching employee:", error);
    return null;
  }
}

/**
 * Create a new employee using core API
 */
export async function createEmployee(
  employeeData: EmployeeFormData
): Promise<Employee | null> {
  try {
    const centralizedData = adaptFeatureTypeToCentralizedRequest(employeeData);
    const response = await employeesApi.createEmployee(centralizedData);
    
    if (!response.data) {
      return null;
    }
    
    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    console.error("Error creating employee:", error);
    return null;
  }
}

/**
 * Update an existing employee using core API
 */
export async function updateEmployee(
  id: string,
  employeeData: EmployeeFormData
): Promise<Employee | null> {
  try {
    const centralizedData = adaptFeatureTypeToCentralizedRequest(employeeData);
    const response = await employeesApi.updateEmployee(id, centralizedData);
    
    if (!response.data) {
      return null;
    }
    
    return adaptCentralizedToFeatureType(response.data);
  } catch (error) {
    console.error("Error updating employee:", error);
    return null;
  }
}

/**
 * Delete an employee using core API
 */
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await employeesApi.deleteEmployee(id);
    return true;
  } catch (error) {
    console.error("Error deleting employee:", error);
    return false;
  }
}

/**
 * Get employees by department
 */
export async function getEmployeesByDepartment(
  department: string
): Promise<Employee[]> {
  const allEmployees = await getEmployees();
  return allEmployees.filter((employee) => employee.department === department);
}

/**
 * Get employee summary statistics using core API
 */
export async function getEmployeeSummary(): Promise<EmployeeSummary | null> {
  try {
    const employees = await getEmployees();

    const departmentCounts = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const summary: EmployeeSummary = {
      totalEmployees: employees.length,
      activeEmployees: employees.filter(e => e.status === 'active').length,
      onLeaveEmployees: employees.filter(e => e.status === 'on_leave').length,
      departments: Object.entries(departmentCounts).map(([name, count]) => ({ name, count })),
    };

    return summary;
  } catch (error) {
    console.error("Error getting employee summary:", error);
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
  getEmployeeSummary,
};
