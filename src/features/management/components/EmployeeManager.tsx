
import React, { useCallback } from "react";
import { Button } from "@/core/components/ui/primitives/button";
import { Plus } from "lucide-react";
import { useEmployeeDialog } from "../hooks/useEmployeeDialog";
import { Employee } from "../types/employees.types";
import EmployeeDialogStandardized, {
  EmployeeFormValues,
} from "./EmployeeDialogStandardized";

interface EmployeeManagerProps {
  onEmployeeCreated?: (employee: Employee) => void;
  onEmployeeUpdated?: (employee: Employee) => void;
}

/**
 * Employee management component that demonstrates using the refactored hooks
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
        employee={employeeDialog.selectedEmployee || undefined}
        onSubmit={handleSubmit}
        isLoading={employeeDialog.isSubmitting}
      />
    </div>
  );
}

export default EmployeeManager;
