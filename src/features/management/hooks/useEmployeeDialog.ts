import { useState, useCallback, useRef } from "react";
import { Employee } from "../types/employees.types";
import { useToast } from "@/hooks";

/**
 * Custom hook for managing EmployeeDialog state and data handling
 */
export function useEmployeeDialog(options?: {
  onCreateSuccess?: (employee: Employee) => void;
  onUpdateSuccess?: (employee: Employee) => void;
}) {
  const { toast } = useToast();
  
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  /**
   * Open dialog to create a new employee
   */
  const openCreate = useCallback(() => {
    setSelectedEmployee(null);
    setIsOpen(true);
  }, []);

  /**
   * Open dialog to edit an existing employee
   */
  const openEdit = useCallback((employee: Employee) => {
    setSelectedEmployee(employee);
    setIsOpen(true);
  }, []);

  /**
   * Close the dialog
   */
  const close = useCallback(() => {
    setIsOpen(false);
    // Optional: Reset selected employee after a delay to avoid UI flicker
    setTimeout(() => {
      setSelectedEmployee(null);
    }, 300);
  }, []);

  /**
   * Handle dialog open state change
   */
  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Optional: Reset selected employee after a delay to avoid UI flicker
      setTimeout(() => {
        setSelectedEmployee(null);
      }, 300);
    }
  }, []);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (formData: Partial<Employee>) => {
      try {
        setIsSubmitting(true);

        if (selectedEmployee) {
          // Update existing employee
          const updatedEmployee = {
            ...selectedEmployee,
            ...formData,
          };

          // Here you would typically make an API call to update the employee
          // await updateEmployee(updatedEmployee);

          const displayName = `${updatedEmployee.first_name} ${updatedEmployee.last_name}`;
          toast({
            title: "Employee updated",
            description: `Successfully updated ${displayName}.`,
          });

          if (options?.onUpdateSuccess) {
            options.onUpdateSuccess(updatedEmployee as Employee);
          }
        } else {
          // Create new employee
          const newEmployee = {
            id: `temp-${Date.now()}`, // This would be replaced by the database
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...formData,
          } as Employee;

          // Here you would typically make an API call to create the employee
          // await createEmployee(newEmployee);

          const displayName = `${newEmployee.first_name} ${newEmployee.last_name}`;
          toast({
            title: "Employee created",
            description: `Successfully added ${displayName}.`,
          });

          if (options?.onCreateSuccess) {
            options.onCreateSuccess(newEmployee);
          }
        }

        // Close dialog
        setIsOpen(false);

        // Optional: Reset selected employee after a delay
        setTimeout(() => {
          setSelectedEmployee(null);
        }, 300);

        return true;
      } catch (error) {
        console.error("Error submitting employee form:", error);

        toast({
          title: "Error",
          description: `Failed to ${selectedEmployee ? "update" : "create"} employee.`,
          variant: "destructive",
        });

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [selectedEmployee, options, toast]
  );

  return {
    isOpen,
    setIsOpen,
    selectedEmployee,
    setSelectedEmployee,
    isSubmitting,
    openCreate,
    openEdit,
    close,
    onOpenChange,
    handleSubmit,
    triggerRef,
  };
}
