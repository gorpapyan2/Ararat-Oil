import { useCallback, useRef } from 'react';
import { useEntityDialog } from '@/shared/hooks/base';
import type { Employee } from '../types/employees.types';
import { useToast } from '@/shared/hooks/ui';

/**
 * Options for the employee dialog hook
 */
export interface UseEmployeeDialogOptions {
  /**
   * Callback when an employee is successfully created
   */
  onCreateSuccess?: (employee: Employee) => void;
  
  /**
   * Callback when an employee is successfully updated
   */
  onUpdateSuccess?: (employee: Employee) => void;
}

/**
 * Custom hook for managing employee dialog state and operations
 * 
 * This hook builds on the base entity dialog hook to provide
 * employee-specific functionality while eliminating code duplication.
 */
export function useEmployeeDialog(options?: UseEmployeeDialogOptions) {
  // Use the shared toast hook
  const { toast } = useToast();
  // Use the base entity dialog hook for common functionality
  const dialog = useEntityDialog<Employee>({
    entityName: 'employee',
    onCreateSuccess: options?.onCreateSuccess,
    onUpdateSuccess: options?.onUpdateSuccess,
  });
  
  // Keep a reference to the trigger element for positioning
  const triggerRef = useRef<HTMLElement>(null);
  
  /**
   * Handle form submission for employee creation or update
   */
  const handleSubmit = useCallback(
    async (formData: Partial<Employee>) => {
      try {
        dialog.setIsSubmitting(true);
        
        if (dialog.entity) {
          // Update existing employee
          const updatedEmployee = {
            ...dialog.entity,
            ...formData,
            updated_at: new Date().toISOString(),
          };
          
          // Here you would typically make an API call to update the employee
          // const result = await updateEmployee(updatedEmployee);
          
          toast({
            title: "Employee updated",
            description: `Successfully updated ${updatedEmployee.first_name} ${updatedEmployee.last_name}.`,
          });
          
          // Notify parent components of the update
          dialog.handleUpdateSuccess(updatedEmployee as Employee);
        } else {
          // Create new employee
          const newEmployee = {
            id: `temp-${Date.now()}`, // This would be replaced by the database
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...formData,
          } as Employee;
          
          // Here you would typically make an API call to create the employee
          // const result = await createEmployee(newEmployee);
          
          toast({
            title: "Employee created",
            description: `Successfully added ${newEmployee.first_name} ${newEmployee.last_name}.`,
          });
          
          // Notify parent components of the creation
          dialog.handleCreateSuccess(newEmployee);
        }
      } catch (error) {
        console.error('Error submitting employee data:', error);
        toast({
          title: "Error",
          description: "Failed to save employee. Please try again.",
          variant: "destructive",
        });
        
        // Handle the error with the base hook
        dialog.handleError(error as Error);
      } finally {
        dialog.setIsSubmitting(false);
      }
    },
    [dialog, toast]
  );
  
  return {
    // Re-export everything from the base dialog
    ...dialog,
    
    // Add/override with employee-specific properties
    selectedEmployee: dialog.entity,
    triggerRef,
    handleSubmit,
  };
}
