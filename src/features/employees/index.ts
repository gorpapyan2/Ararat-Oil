/**
 * Employees Feature - Public API
 *
 * This module exports types and services related to employee management.
 * Only expose what's needed by other features to minimize dependencies.
 */

// Page Components
export { EmployeesPage } from "./pages";

// Export services for CRUD operations
export * from "./services";

// Export domain types
export type {
  Employee,
  EmployeeFormData,
  EmployeeFilters,
  EmployeeSummary,
} from "./types/employees.types";

// Only export components that actually exist
// TODO: Verify these exist and remove if they don't:
// export * from "./components/EmployeeManagerStandardized";
// export * from "./components/EmployeeDialogStandardized";
// export * from "./components/DeleteConfirmDialogStandardized";
// export * from "./components/EmployeesTable";
// export * from "./hooks/useEmployees";
