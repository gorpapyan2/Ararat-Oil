import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "@/services/employees";
import { EmployeeList } from "./EmployeeList";
import { EmployeeHeader } from "./EmployeeHeader";
import { EmployeeDialogStandardized } from "./EmployeeDialogStandardized";
import { Employee } from "@/core/api";
import { useToast } from "@/hooks";
import { useEmployeeDialog } from "@/hooks/useEmployeeDialog";

export function EmployeeManagerStandardized() {
  // Hooks
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee created successfully",
      });
    },
    onUpdateSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee updated successfully",
      });
    },
  });

  // Data fetching
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees as any,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    },
  });

  // Event handlers
  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <div className="space-y-6">
      <EmployeeHeader onAdd={employeeDialog.openCreate} />
      <EmployeeList
        employees={employees || []}
        isLoading={isLoading}
        onEdit={employeeDialog.openEdit}
        onDelete={handleDelete}
      />
      <EmployeeDialogStandardized
        open={employeeDialog.isOpen}
        onOpenChange={employeeDialog.onOpenChange}
        employee={employeeDialog.selectedEmployee}
        onSubmit={employeeDialog.handleSubmit}
      />
    </div>
  );
} 