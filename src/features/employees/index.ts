/**
 * Employees Feature - Public API
 * 
 * This module exports types and services related to employee management.
 * Only expose what's needed by other features to minimize dependencies.
 */

// Export service for CRUD operations
export { employeesService } from './services/employeesService';

// Export domain types
export type { 
  Employee,
  EmployeeFormData, 
  EmployeeFilters,
  EmployeeSummary
} from './types/employees.types';

// Don't export mappers or internal utilities unless needed by other features

export * from './components/EmployeeManagerStandardized';
export * from './components/EmployeeDialogStandardized';
export * from './components/DeleteConfirmDialogStandardized';
export * from './components/EmployeesTable';
export * from './hooks/useEmployees'; 