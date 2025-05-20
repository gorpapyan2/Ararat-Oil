import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useEmployees } from '../useEmployees';

// Mock the services
vi.mock('../../services', () => ({
  getEmployees: vi.fn(),
  getEmployeeById: vi.fn(),
  createEmployee: vi.fn(),
  updateEmployee: vi.fn(),
  deleteEmployee: vi.fn(),
  getEmployeeSummary: vi.fn()
}));

import { 
  getEmployees, 
  getEmployeeById, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  getEmployeeSummary 
} from '../../services';

// Create a wrapper for the QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Employees Hooks', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('useEmployees', () => {
    it('should fetch employees successfully', async () => {
      const mockEmployees = [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', position: 'Manager', is_active: true, created_at: '2023-01-01', updated_at: '2023-01-01' },
        { id: '2', first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', position: 'Cashier', is_active: true, created_at: '2023-01-02', updated_at: '2023-01-02' }
      ];
      
      (getEmployees as any).mockResolvedValue(mockEmployees);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      expect(result.current.isLoading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.employees).toEqual(mockEmployees);
      expect(getEmployees).toHaveBeenCalledTimes(1);
    });
    
    it('should fetch employees with filters', async () => {
      const filters = { search: 'John', position: 'Manager' };
      const mockEmployees = [
        { id: '1', first_name: 'John', last_name: 'Doe', email: 'john@example.com', position: 'Manager', is_active: true, created_at: '2023-01-01', updated_at: '2023-01-01' }
      ];
      
      (getEmployees as any).mockResolvedValue(mockEmployees);
      
      const { result } = renderHook(() => useEmployees(filters), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      expect(result.current.employees).toEqual(mockEmployees);
      expect(getEmployees).toHaveBeenCalledWith(filters);
    });
    
    it('should handle employee fetch error', async () => {
      const mockError = new Error('Failed to fetch employees');
      (getEmployees as any).mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeTruthy();
      });
    });
    
    it('should fetch employee summary successfully', async () => {
      const mockSummary = {
        total: 10,
        active: 8,
        new_last_30_days: 3
      };
      
      (getEmployeeSummary as any).mockResolvedValue(mockSummary);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      await waitFor(() => {
        expect(result.current.summaryIsLoading).toBe(false);
      });
      
      expect(result.current.summary).toEqual(mockSummary);
      expect(getEmployeeSummary).toHaveBeenCalledTimes(1);
    });
    
    it('should fetch a single employee by ID', async () => {
      const mockEmployee = {
        id: '1', 
        first_name: 'John', 
        last_name: 'Doe', 
        email: 'john@example.com', 
        position: 'Manager', 
        is_active: true, 
        created_at: '2023-01-01', 
        updated_at: '2023-01-01'
      };
      
      (getEmployeeById as any).mockResolvedValue(mockEmployee);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      let fetchedEmployee;
      
      await act(async () => {
        fetchedEmployee = await result.current.fetchEmployeeById('1');
      });
      
      expect(fetchedEmployee).toEqual(mockEmployee);
      expect(getEmployeeById).toHaveBeenCalledWith('1');
    });
    
    it('should create an employee successfully', async () => {
      const newEmployee = {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice@example.com',
        position: 'Supervisor',
        is_active: true
      };
      
      const createdEmployee = {
        id: '3',
        ...newEmployee,
        created_at: '2023-01-03',
        updated_at: '2023-01-03'
      };
      
      (createEmployee as any).mockResolvedValue(createdEmployee);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.createEmployee.mutate(newEmployee);
      });
      
      await waitFor(() => {
        expect(result.current.createEmployee.isSuccess).toBe(true);
        expect(result.current.createEmployee.data).toEqual(createdEmployee);
      });
      
      expect(createEmployee).toHaveBeenCalledWith(newEmployee);
    });
    
    it('should update an employee successfully', async () => {
      const employeeId = '1';
      const updateData = {
        first_name: 'Johnny',
        position: 'Senior Manager'
      };
      
      const updatedEmployee = {
        id: employeeId,
        first_name: 'Johnny',
        last_name: 'Doe',
        email: 'john@example.com',
        position: 'Senior Manager',
        is_active: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-04'
      };
      
      (updateEmployee as any).mockResolvedValue(updatedEmployee);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.updateEmployee.mutate({ id: employeeId, data: updateData });
      });
      
      await waitFor(() => {
        expect(result.current.updateEmployee.isSuccess).toBe(true);
        expect(result.current.updateEmployee.data).toEqual(updatedEmployee);
      });
      
      expect(updateEmployee).toHaveBeenCalledWith(employeeId, updateData);
    });
    
    it('should delete an employee successfully', async () => {
      const employeeId = '2';
      
      (deleteEmployee as any).mockResolvedValue(true);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: createWrapper()
      });
      
      await act(async () => {
        result.current.deleteEmployee.mutate(employeeId);
      });
      
      await waitFor(() => {
        expect(result.current.deleteEmployee.isSuccess).toBe(true);
        expect(result.current.deleteEmployee.data).toBe(true);
      });
      
      expect(deleteEmployee).toHaveBeenCalledWith(employeeId);
    });
    
    it('should invalidate queries after successful mutations', async () => {
      // Setup a mock query client to spy on invalidateQueries
      const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } }
      });
      
      const spyInvalidateQueries = vi.spyOn(queryClient, 'invalidateQueries');
      
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      );
      
      const newEmployee = {
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob@example.com',
        position: 'Assistant',
        is_active: true
      };
      
      const createdEmployee = {
        id: '4',
        ...newEmployee,
        created_at: '2023-01-05',
        updated_at: '2023-01-05'
      };
      
      (createEmployee as any).mockResolvedValue(createdEmployee);
      
      const { result } = renderHook(() => useEmployees(), {
        wrapper: customWrapper
      });
      
      await act(async () => {
        result.current.createEmployee.mutate(newEmployee);
      });
      
      await waitFor(() => {
        expect(result.current.createEmployee.isSuccess).toBe(true);
      });
      
      // Should invalidate the employees query and the summary query
      expect(spyInvalidateQueries).toHaveBeenCalledWith(['employees']);
      expect(spyInvalidateQueries).toHaveBeenCalledWith(['employeeSummary']);
    });
  });
}); 