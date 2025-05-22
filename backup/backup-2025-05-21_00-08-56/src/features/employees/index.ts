/**
 * Employees Feature - Public API
 * 
 * This module exports types and services related to employee management.
 * Only expose what's needed by other features to minimize dependencies.
 */

// Export services for CRUD operations
export * from './services';

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