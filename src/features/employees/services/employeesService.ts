import { supabase } from "@/services/supabase";
import type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  EmployeeSummary,
} from "../types/employees.types";
import { mapDbToEmployee, mapEmployeeToDb } from "../utils/employeeMappers";

export const employeesService = {
  async getEmployees(filters?: EmployeeFilters): Promise<Employee[]> {
    let query = supabase.from("employees").select("*");

    // Apply filters if provided
    if (filters) {
      if (filters.status) {
        query = query.eq("status", filters.status);
      }

      if (filters.searchQuery) {
        query = query.ilike("name", `%${filters.searchQuery}%`);
      }

      if (filters.department) {
        // Search for department info in status field
        query = query.ilike("status", `dept:${filters.department}%`);
      }
    }

    // Order by name
    query = query.order("name");

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching employees:", error);
      return [];
    }

    // Use the mapper to transform database records to domain models
    return data.map(mapDbToEmployee);
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching employee:", error);
      return null;
    }

    // Use the mapper for a single record
    return mapDbToEmployee(data);
  },

  async createEmployee(
    employeeData: EmployeeFormData
  ): Promise<Employee | null> {
    // Convert from domain model to database format
    const dbEmployee = mapEmployeeToDb(employeeData);

    const { data, error } = await supabase
      .from("employees")
      .insert(dbEmployee)
      .select()
      .single();

    if (error) {
      console.error("Error creating employee:", error);
      return null;
    }

    return mapDbToEmployee(data);
  },

  async updateEmployee(
    id: string,
    employeeData: EmployeeFormData
  ): Promise<Employee | null> {
    // Convert from domain model to database format
    const dbEmployee = mapEmployeeToDb(employeeData);

    const { data, error } = await supabase
      .from("employees")
      .update(dbEmployee)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating employee:", error);
      return null;
    }

    return mapDbToEmployee(data);
  },

  async deleteEmployee(id: string): Promise<boolean> {
    const { error } = await supabase.from("employees").delete().eq("id", id);

    if (error) {
      console.error("Error deleting employee:", error);
      return false;
    }

    return true;
  },

  async getEmployeesByDepartment(department: string): Promise<Employee[]> {
    const { data, error } = await supabase.from("employees").select("*");

    if (error) {
      console.error("Error fetching employees by department:", error);
      return [];
    }

    // Map to domain model first, then filter by department
    return data
      .map(mapDbToEmployee)
      .filter((employee) => employee.department === department);
  },

  async getEmployeeSummary(): Promise<EmployeeSummary | null> {
    const { data: employees, error } = await supabase
      .from("employees")
      .select("*");

    if (error) {
      console.error("Error fetching employee summary:", error);
      return null;
    }

    // Map DB employees to our format first
    const mappedEmployees = employees.map(mapDbToEmployee);

    const summary: EmployeeSummary = {
      totalEmployees: mappedEmployees.length,
      activeEmployees: mappedEmployees.filter((e) => e.status === "active")
        .length,
      onLeaveEmployees: mappedEmployees.filter((e) => e.status === "on_leave")
        .length,
      departments: Object.entries(
        mappedEmployees.reduce(
          (acc, emp) => {
            acc[emp.department] = (acc[emp.department] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        )
      ).map(([name, count]) => ({ name, count })),
    };

    return summary;
  },
};
