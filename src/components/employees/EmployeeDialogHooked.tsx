import { useEffect } from "react";
import { z } from "zod";
import { StandardDialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Employee } from "@/types";
import {
  FormInput,
  FormSelect,
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { useEmployeeDialog } from "@/hooks/useEmployeeDialog";

// Define the employee status options
const employeeStatusOptions = [
  { value: "active", label: "Active" },
  { value: "on_leave", label: "On Leave" },
  { value: "terminated", label: "Terminated" },
];

// Define the Zod schema for validation
const employeeSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  position: z
    .string({ required_error: "Position is required" })
    .min(2, "Position must be at least 2 characters"),
  contact: z
    .string({ required_error: "Contact is required" })
    .min(5, "Contact must be at least 5 characters"),
  hire_date: z
    .string({ required_error: "Hire date is required" }),
  salary: z.coerce
    .number({ required_error: "Salary is required" })
    .nonnegative("Salary must be a positive number or zero"),
  status: z.enum(["active", "on_leave", "terminated"] as const, {
    required_error: "Status is required",
  }),
});

// Type based on schema
type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeDialogHookedProps {
  onCreateSuccess?: (employee: Employee) => void;
  onUpdateSuccess?: (employee: Employee) => void;
}

export function EmployeeDialogHooked({
  onCreateSuccess,
  onUpdateSuccess,
}: EmployeeDialogHookedProps) {
  // Use the custom hook for dialog state management
  const employeeDialog = useEmployeeDialog({
    onCreateSuccess,
    onUpdateSuccess,
  });
  
  // Initialize form with Zod validation
  const form = useZodForm({
    schema: employeeSchema,
    defaultValues: {
      name: "",
      position: "",
      contact: "",
      hire_date: new Date().toISOString().split("T")[0],
      salary: 0,
      status: "active" as const,
    },
  });

  // Set form values when employee prop changes
  useEffect(() => {
    if (employeeDialog.selectedEmployee) {
      form.reset({
        name: employeeDialog.selectedEmployee.name,
        position: employeeDialog.selectedEmployee.position,
        contact: employeeDialog.selectedEmployee.contact,
        hire_date: employeeDialog.selectedEmployee.hire_date,
        salary: employeeDialog.selectedEmployee.salary,
        status: employeeDialog.selectedEmployee.status,
      });
    } else {
      form.reset({
        name: "",
        position: "",
        contact: "",
        hire_date: new Date().toISOString().split("T")[0],
        salary: 0,
        status: "active" as const,
      });
    }
  }, [employeeDialog.selectedEmployee, form]);

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<EmployeeFormData>(
    form,
    (data) => {
      return employeeDialog.handleSubmit(data);
    }
  );

  // Create form actions
  const formActions = (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="outline"
        onClick={employeeDialog.close}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={isSubmitting} form="employee-form">
        {isSubmitting 
          ? "Processing..." 
          : employeeDialog.selectedEmployee ? "Update" : "Save"} Employee
      </Button>
    </div>
  );

  return (
    <>
      {/* This component doesn't render buttons to trigger the dialog - those would be in the parent component */}
      <StandardDialog
        open={employeeDialog.isOpen}
        onOpenChange={employeeDialog.onOpenChange}
        triggerRef={employeeDialog.triggerRef}
        title={employeeDialog.selectedEmployee ? "Edit Employee" : "Add New Employee"}
        description={employeeDialog.selectedEmployee 
          ? "Update the employee's information in the system."
          : "Add a new employee to the system."}
        maxWidth="sm:max-w-[425px]"
        actions={formActions}
      >
        <form id="employee-form" onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            name="name"
            label="Name"
            form={form}
            placeholder="John Doe"
            autoComplete="name"
          />
          
          <FormInput
            name="position"
            label="Position"
            form={form}
            placeholder="Manager"
            autoComplete="organization-title"
          />
          
          <FormInput
            name="contact"
            label="Contact"
            form={form}
            placeholder="Email or Phone"
            autoComplete="email"
          />
          
          <FormInput
            name="hire_date"
            label="Hire Date"
            form={form}
            type="date"
            autoComplete="date"
          />
          
          <FormInput
            name="salary"
            label="Salary"
            form={form}
            type="number"
            placeholder="50000"
            inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          
          <FormSelect
            name="status"
            label="Status"
            form={form}
            options={employeeStatusOptions}
            placeholder="Select employee status"
          />
        </form>
      </StandardDialog>
    </>
  );
}

// Export the dialog with the hook for convenience
export { useEmployeeDialog }; 