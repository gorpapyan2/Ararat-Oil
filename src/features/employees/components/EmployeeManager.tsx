
import React, { useCallback } from "react";
import { Button } from "@/core/components/ui/primitives/button";
import { Plus } from "lucide-react";
import { useEmployeeDialog } from "../../management/hooks/useEmployeeDialog";
import { Employee } from "../../management/types/employees.types";
import EmployeeDialogStandardized, {
  EmployeeFormValues,
} from "../../management/components/EmployeeDialogStandardized";

interface EmployeeManagerProps {
  onEmployeeCreated?: (employee: Employee) => void;
  onEmployeeUpdated?: (employee: Employee) => void;
}

/**
 * Employee management component - simplified version that uses the management feature hooks
 */
export function EmployeeManager({
  onEmployeeCreated,
  onEmployeeUpdated,
}: EmployeeManagerProps) {
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: onEmployeeCreated,
    onUpdateSuccess: onEmployeeUpdated,
  });

  const handleSubmit = useCallback(
    async (data: EmployeeFormValues) => {
      try {
        await employeeDialog.handleSubmit(data);
        return true;
      } catch (error) {
        console.error("Error submitting employee form:", error);
        return false;
      }
    },
    [employeeDialog]
  );

  return (
    <div>
      <Button onClick={employeeDialog.openCreate} className="mb-4">
        <Plus className="mr-2 h-4 w-4" />
        Add Employee
      </Button>

      <EmployeeDialogStandardized
        open={employeeDialog.isOpen}
        onOpenChange={employeeDialog.onOpenChange}
        employee={employeeDialog.selectedEmployee}
        onSubmit={handleSubmit}
        isLoading={employeeDialog.isSubmitting}
      />
    </div>
  );
}

export default EmployeeManager;
