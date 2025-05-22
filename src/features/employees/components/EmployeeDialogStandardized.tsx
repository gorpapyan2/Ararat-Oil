import React from "react";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { toast as sonnerToast } from "sonner";
import { Employee } from "@/features/employees/types/employees.types";
import { Control, FieldValues } from "react-hook-form";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";

/**
 * Create a schema for employee form validation
 */
const createEmployeeSchema = () => {
  const { t } = useTranslation();
  
  return z.object({
    first_name: z.string().min(1, t("employees.firstNameRequired", "First name is required")),
    last_name: z.string().min(1, t("employees.lastNameRequired", "Last name is required")),
    position: z.string().min(1, t("employees.positionRequired", "Position is required")),
    department: z.string().optional(),
    hire_date: z.string().optional(),
    email: z.string().email(t("employees.invalidEmail", "Invalid email address")).optional(),
    phone: z.string().optional(),
    status: z.enum(["active", "inactive", "on_leave"]).default("active"),
    salary: z.number().optional(),
    notes: z.string().optional(),
  });
};

// Export the type for reuse in other components
export type EmployeeFormValues = z.infer<ReturnType<typeof createEmployeeSchema>>;

interface EmployeeDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee?: Employee;
  onSubmit: (data: EmployeeFormValues) => Promise<boolean>;
  isLoading?: boolean;
}

function EmployeeDialogStandardized({
  open,
  onOpenChange,
  employee,
  onSubmit,
  isLoading = false,
}: EmployeeDialogStandardizedProps) {
  const { t } = useTranslation();
  const isEditing = Boolean(employee);
  const employeeSchema = createEmployeeSchema();
  
  // Set up default values
  const defaultValues: Partial<EmployeeFormValues> = {
    first_name: employee?.first_name || "",
    last_name: employee?.last_name || "",
    position: employee?.position || "",
    department: employee?.department || "",
    hire_date: employee?.hire_date ? new Date(employee.hire_date).toISOString().split('T')[0] : "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    status: employee?.status || "active",
    salary: employee?.salary || 0,
    notes: employee?.notes || "",
  };

  // Handle form submission
  const handleSubmit = async (data: EmployeeFormValues) => {
    try {
      const success = await onSubmit(data);
      
      if (success) {
        sonnerToast.success(
          isEditing 
            ? t("employees.updateSuccess", "Employee updated successfully") 
            : t("employees.createSuccess", "Employee created successfully")
        );
        return true;
      }
      return false;
    } catch (error) {
      sonnerToast.error(t("employees.saveError", "Failed to save employee"));
      return false;
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing 
        ? t("employees.editEmployee", "Edit Employee") 
        : t("employees.addEmployee", "Add Employee")
      }
      schema={employeeSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={isLoading
        ? t("common.saving", "Saving...")
        : isEditing
        ? t("common.save", "Save")
        : t("common.create", "Create")
      }
      isSubmitting={isLoading}
      size="lg"
    >
      {({ control }) => (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control as Control<FieldValues>}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.firstName", "First Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control as Control<FieldValues>}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.lastName", "Last Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control as Control<FieldValues>}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("employees.position", "Position")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control as Control<FieldValues>}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("employees.department", "Department")}</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control as Control<FieldValues>}
              name="hire_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.hireDate", "Hire Date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control as Control<FieldValues>}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("employees.status", "Status")}</FormLabel>
                  <FormControl>
                    <select 
                      className="w-full px-3 py-2 border rounded-md" 
                      {...field}
                    >
                      <option value="active">{t("employees.statusActive", "Active")}</option>
                      <option value="inactive">{t("employees.statusInactive", "Inactive")}</option>
                      <option value="on_leave">{t("employees.statusOnLeave", "On Leave")}</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control as Control<FieldValues>}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.email", "Email")}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control as Control<FieldValues>}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.phone", "Phone")}</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control as Control<FieldValues>}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common.notes", "Notes")}</FormLabel>
                <FormControl>
                  <textarea 
                    className="w-full h-20 px-3 py-2 border rounded-md resize-none" 
                    {...field} 
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </FormDialog>
  );
}

export { EmployeeDialogStandardized };
export default EmployeeDialogStandardized; 