import React, { useCallback } from 'react';
import { Button } from '@core/components/ui/primitives/button';
import { Plus } from 'lucide-react';
import { useEmployeeDialog } from '../hooks/useEmployeeDialog';
import { Employee } from '../types/employees.types';
import EmployeeDialogStandardized, { EmployeeFormValues } from './EmployeeDialogStandardized';

interface EmployeeManagerProps {
  /**
   * Callback when an employee is created
   */
  onEmployeeCreated?: (employee: Employee) => void;
  
  /**
   * Callback when an employee is updated
   */
  onEmployeeUpdated?: (employee: Employee) => void;
}

/**
 * Employee management component that demonstrates using the refactored hooks
 * 
 * This component shows how to use the new hooks architecture to manage employee operations
 * with significantly less boilerplate code.
 */
export function EmployeeManager({ onEmployeeCreated, onEmployeeUpdated }: EmployeeManagerProps) {
  // Use our new hook with much less boilerplate
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: onEmployeeCreated,
    onUpdateSuccess: onEmployeeUpdated
  });
  
  // Handler for form submission - now much simpler with our new hook
  const handleSubmit = useCallback(async (data: EmployeeFormValues) => {
    try {
      await employeeDialog.handleSubmit(data);
      return true;
    } catch (error) {
      console.error('Error submitting employee form:', error);
      return false;
    }
  }, [employeeDialog]);
  
  return (
    <div>
      {/* Add employee button */}
      <Button 
        onClick={employeeDialog.openCreate}
        className="mb-4"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>
      
      {/* Employee dialog using our new hook */}
      <EmployeeDialogStandardized
        open={employeeDialog.isOpen}
        onOpenChange={employeeDialog.onOpenChange}
        employee={employeeDialog.selectedEmployee as Employee}
        onSubmit={handleSubmit}
        isLoading={employeeDialog.isSubmitting}
      />
    </div>
  );
}

export default EmployeeManager;
