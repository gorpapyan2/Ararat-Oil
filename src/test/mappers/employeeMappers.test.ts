import { describe, it, expect } from "vitest";
import { DbEmployee } from "@/features/employees/types/employees.types";
import {
  mapDbToEmployee,
  mapEmployeeToDb,
  extractDepartment,
  normalizeStatus,
} from "@/features/employees/utils/employeeMappers";

describe("Employee Mappers", () => {
  describe("extractDepartment", () => {
    it("should extract department from status field", () => {
      expect(extractDepartment("dept:sales")).toBe("sales");
      expect(extractDepartment("dept:marketing")).toBe("marketing");
    });

    it("should return general if no department is found", () => {
      expect(extractDepartment("active")).toBe("general");
      expect(extractDepartment("inactive")).toBe("general");
    });
  });

  describe("normalizeStatus", () => {
    it("should return active for department status", () => {
      expect(normalizeStatus("dept:sales")).toBe("active");
    });

    it("should return the status if it is a known value", () => {
      expect(normalizeStatus("active")).toBe("active");
      expect(normalizeStatus("inactive")).toBe("inactive");
      expect(normalizeStatus("on_leave")).toBe("on_leave");
    });

    it("should return active as default for unknown status", () => {
      expect(normalizeStatus("unknown")).toBe("active");
    });
  });

  describe("mapDbToEmployee", () => {
    it("should transform a database employee to a domain model", () => {
      const dbEmployee: DbEmployee = {
        id: "123",
        name: "John Doe",
        contact: "john.doe@example.com|555-1234",
        position: "Manager",
        hire_date: "2023-01-15",
        salary: 60000,
        status: "active",
        created_at: "2023-01-15T10:00:00Z",
      };

      const result = mapDbToEmployee(dbEmployee);

      expect(result).toEqual({
        id: "123",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "555-1234",
        position: "Manager",
        department: "general",
        hire_date: "2023-01-15",
        salary: 60000,
        status: "active",
        notes: "",
        created_at: "2023-01-15T10:00:00Z",
        updated_at: "2023-01-15T10:00:00Z",
      });
    });

    it("should handle employee with department info in status", () => {
      const dbEmployee: DbEmployee = {
        id: "456",
        name: "Jane Smith",
        contact: "jane.smith@example.com|555-5678",
        position: "Developer",
        hire_date: "2023-02-15",
        salary: 75000,
        status: "dept:engineering",
        created_at: "2023-02-15T10:00:00Z",
      };

      const result = mapDbToEmployee(dbEmployee);

      expect(result).toEqual({
        id: "456",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "555-5678",
        position: "Developer",
        department: "engineering",
        hire_date: "2023-02-15",
        salary: 75000,
        status: "active",
        notes: "",
        created_at: "2023-02-15T10:00:00Z",
        updated_at: "2023-02-15T10:00:00Z",
      });
    });

    it("should handle incomplete data gracefully", () => {
      const dbEmployee: DbEmployee = {
        id: "789",
        name: "Alice",
        contact: "alice@example.com|",
        position: "Intern",
        hire_date: "2023-03-15",
        salary: 30000,
        status: "on_leave",
        created_at: null,
      };

      const result = mapDbToEmployee(dbEmployee);

      expect(result.first_name).toBe("Alice");
      expect(result.last_name).toBe("");
      expect(result.email).toBe("alice@example.com");
      expect(result.phone).toBe("");
      expect(result.status).toBe("on_leave");
      expect(result.created_at).not.toBe(null);
    });
  });

  describe("mapEmployeeToDb", () => {
    it("should transform a domain employee to database format", () => {
      const employee = {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        phone: "555-1234",
        position: "Manager",
        department: "general",
        hire_date: "2023-01-15",
        salary: 60000,
        status: "active" as const,
        notes: "Some notes",
      };

      const result = mapEmployeeToDb(employee);

      expect(result).toEqual({
        name: "John Doe",
        contact: "john.doe@example.com|555-1234",
        position: "Manager",
        hire_date: "2023-01-15",
        salary: 60000,
        status: "active",
      });
    });

    it("should handle department info correctly", () => {
      const employee = {
        first_name: "Jane",
        last_name: "Smith",
        email: "jane.smith@example.com",
        phone: "555-5678",
        position: "Developer",
        department: "engineering",
        hire_date: "2023-02-15",
        salary: 75000,
        status: "active" as const,
        notes: "",
      };

      const result = mapEmployeeToDb(employee);

      expect(result.status).toBe("dept:engineering");
    });
  });
});
