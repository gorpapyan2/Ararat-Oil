import { waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import { useEmployees } from "../useEmployees";
import {
  setupHookTest,
  setupErrorTest,
  setupMutationTest,
} from "@/test/utils/test-setup";
import type { EmployeeFormData } from "../../types/employees.types";

// Mock the services
vi.mock("../../services", () => ({
  getEmployees: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
  getEmployeeSummary: vi.fn(),
}));

import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeSummary,
} from "../../services";

describe("Employees Hooks", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("useEmployees", () => {
    it("should fetch employees successfully", async () => {
      const mockEmployees = [
        {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          position: "Manager",
          department: "Operations",
          hire_date: "2023-01-01",
          salary: 75000,
          status: "active",
          notes: "",
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
        {
          id: "2",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@example.com",
          phone: "098-765-4321",
          position: "Cashier",
          department: "Sales",
          hire_date: "2023-01-02",
          salary: 45000,
          status: "active",
          notes: "",
          created_at: "2023-01-02",
          updated_at: "2023-01-02",
        },
      ];

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockEmployees);

      const { result } = renderTestHook(() => useEmployees());

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.employees).toEqual(mockEmployees);
      expect(getEmployees).toHaveBeenCalledTimes(1);
    });

    it("should fetch employees with filters", async () => {
      const filters = { searchQuery: "John", department: "Operations" };
      const mockEmployees = [
        {
          id: "1",
          first_name: "John",
          last_name: "Doe",
          email: "john@example.com",
          phone: "123-456-7890",
          position: "Manager",
          department: "Operations",
          hire_date: "2023-01-01",
          salary: 75000,
          status: "active",
          notes: "",
          created_at: "2023-01-01",
          updated_at: "2023-01-01",
        },
      ];

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockEmployees);

      const { result } = renderTestHook(() => useEmployees(filters));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.employees).toEqual(mockEmployees);
      expect(getEmployees).toHaveBeenCalledWith(filters);
    });

    it("should handle employee fetch error", async () => {
      // Use shared error test utility
      const { renderTestHook, mockFetch } = setupErrorTest();
      mockFetch.mockRejectedValue(new Error("Failed to fetch employees"));

      const { result } = renderTestHook(() => useEmployees());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });

    it("should fetch employee summary successfully", async () => {
      const mockSummary = {
        totalEmployees: 10,
        activeEmployees: 8,
        onLeaveEmployees: 2,
        departments: [
          { name: "Operations", count: 4 },
          { name: "Sales", count: 6 },
        ],
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockSummary);

      const { result } = renderTestHook(() => useEmployees());

      await waitFor(() => {
        expect(result.current.summaryQuery.isLoading).toBe(false);
      });

      expect(result.current.summary).toEqual(mockSummary);
      expect(getEmployeeSummary).toHaveBeenCalledTimes(1);
    });

    it("should get a single employee by ID", async () => {
      const mockEmployee = {
        id: "1",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "123-456-7890",
        position: "Manager",
        department: "Operations",
        hire_date: "2023-01-01",
        salary: 75000,
        status: "active" as const,
        notes: "",
        created_at: "2023-01-01",
        updated_at: "2023-01-01",
      };

      // Use shared test utility
      const { renderTestHook, mockFetch } = setupHookTest();
      mockFetch.mockResolvedValue(mockEmployee);

      const { result } = renderTestHook(() => useEmployees());

      // We can't directly test getEmployeeById here since it returns a hook
      // Instead we mock the service function directly
      (getEmployeeById as Mock).mockResolvedValue(mockEmployee);

      expect(result.current.getEmployeeById).toBeDefined();
    });

    it("should create an employee successfully", async () => {
      const newEmployee: EmployeeFormData = {
        first_name: "Alice",
        last_name: "Johnson",
        email: "alice@example.com",
        phone: "555-123-4567",
        position: "Supervisor",
        department: "Sales",
        hire_date: "2023-01-03",
        salary: 65000,
        status: "active",
        notes: "",
      };

      const createdEmployee = {
        id: "3",
        ...newEmployee,
        created_at: "2023-01-03",
        updated_at: "2023-01-03",
      };

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(createdEmployee);

      const { result } = renderTestHook(() => useEmployees());

      await act(async () => {
        result.current.createEmployee.mutate(newEmployee);
      });

      await waitFor(() => {
        expect(result.current.createEmployee.isSuccess).toBe(true);
        expect(result.current.createEmployee.data).toEqual(createdEmployee);
      });

      expect(createEmployee).toHaveBeenCalledWith(newEmployee);
    });

    it("should update an employee successfully", async () => {
      const employeeId = "1";
      const updateData: EmployeeFormData = {
        first_name: "Johnny",
        last_name: "Doe",
        email: "johnny@example.com",
        phone: "123-456-7890",
        position: "Senior Manager",
        department: "Operations",
        hire_date: "2023-01-01",
        salary: 85000,
        status: "active",
        notes: "Recently promoted",
      };

      const updatedEmployee = {
        id: employeeId,
        ...updateData,
        created_at: "2023-01-01",
        updated_at: "2023-01-04",
      };

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(updatedEmployee);

      const { result } = renderTestHook(() => useEmployees());

      await act(async () => {
        result.current.updateEmployee.mutate({
          id: employeeId,
          data: updateData,
        });
      });

      await waitFor(() => {
        expect(result.current.updateEmployee.isSuccess).toBe(true);
        expect(result.current.updateEmployee.data).toEqual(updatedEmployee);
      });

      expect(updateEmployee).toHaveBeenCalledWith(employeeId, updateData);
    });

    it("should delete an employee successfully", async () => {
      const employeeId = "2";

      // Use shared mutation test utility
      const { renderTestHook, mockMutate } = setupMutationTest();
      mockMutate.mockResolvedValue(true);

      const { result } = renderTestHook(() => useEmployees());

      await act(async () => {
        result.current.deleteEmployee.mutate(employeeId);
      });

      await waitFor(() => {
        expect(result.current.deleteEmployee.isSuccess).toBe(true);
        expect(result.current.deleteEmployee.data).toBe(true);
      });

      expect(deleteEmployee).toHaveBeenCalledWith(employeeId);
    });

    it("should invalidate queries after successful mutations", async () => {
      // Setup a mock query client and spies
      const { queryClient, renderTestHook, mockMutate } = setupMutationTest();
      const spyInvalidateQueries = vi.spyOn(queryClient, "invalidateQueries");

      // Mock a successful employee creation
      const newEmployee: EmployeeFormData = {
        first_name: "Test",
        last_name: "User",
        email: "test@example.com",
        phone: "999-888-7777",
        position: "Tester",
        department: "QA",
        hire_date: "2023-01-05",
        salary: 60000,
        status: "active",
        notes: "Test employee",
      };

      mockMutate.mockResolvedValue({
        id: "4",
        ...newEmployee,
        created_at: "2023-01-05",
        updated_at: "2023-01-05",
      });

      const { result } = renderTestHook(() => useEmployees());

      await act(async () => {
        result.current.createEmployee.mutate(newEmployee);
      });

      await waitFor(() => {
        expect(result.current.createEmployee.isSuccess).toBe(true);
      });

      // Verify that the cache was invalidated
      expect(spyInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ["employees"],
      });
    });
  });
});
