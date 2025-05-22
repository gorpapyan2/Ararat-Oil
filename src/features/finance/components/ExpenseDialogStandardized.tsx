import { useTranslation } from "react-i18next";
import { z } from "zod";
import { toast } from "sonner";

import {
  FormField,
  FormControl,
  FormItem,
  FormMessage,
  FormRow,
} from "@/core/components/ui/composed/base-form";
import { Input } from "@/core/components/ui/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import { useFinance } from "../hooks/useFinance";
import type { Expense } from "../types/finance.types";

/**
 * Schema for expense form validation
 */
const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  employee_id: z.string().min(1, "Employee is required"),
});

/**
 * Type for expense form values
 */
type ExpenseFormValues = z.infer<typeof expenseSchema>;

/**
 * Props for the ExpenseDialogStandardized component
 */
interface ExpenseDialogStandardizedProps {
  /** Is the dialog open */
  open: boolean;
  /** Handler for dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Expense data for editing, null for create mode */
  expense: Expense | null;
}

/**
 * Standardized expense dialog component using FormDialog
 */
export function ExpenseDialogStandardized({
  open,
  onOpenChange,
  expense,
}: ExpenseDialogStandardizedProps) {
  const { t } = useTranslation();
  const { createExpense, updateExpense } = useFinance();
  const isEditing = !!expense;

  const defaultValues: ExpenseFormValues = {
    amount: expense?.amount || 0,
    description: expense?.description || "",
    category: expense?.category || "",
    date: expense?.date || new Date().toISOString().split('T')[0],
    employee_id: expense?.employee_id || "",
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: ExpenseFormValues) => {
    try {
      if (isEditing && expense) {
        await updateExpense.mutateAsync({ 
          id: expense.id, 
          data: data as Partial<Expense>
        });
        toast.success(t("finance.expenses.updateSuccess", "Expense updated successfully"));
        return true;
      } else {
        await createExpense.mutateAsync(
          data as Omit<Expense, "id" | "created_at" | "updated_at">
        );
        toast.success(t("finance.expenses.createSuccess", "Expense created successfully"));
        return true;
      }
    } catch (error) {
      toast.error(
        isEditing 
          ? t("finance.expenses.updateError", "Failed to update expense") 
          : t("finance.expenses.createError", "Failed to create expense")
      );
      console.error("Error with expense:", error);
      return false;
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing
        ? t("finance.expenses.edit", "Edit Expense")
        : t("finance.expenses.create", "Create Expense")
      }
      schema={expenseSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      isSubmitting={createExpense.isPending || updateExpense.isPending}
      submitText={isEditing ? t("common.save", "Save") : t("common.create", "Create")}
      cancelText={t("common.cancel", "Cancel")}
    >
      {({ control }) => (
        <>
          <FormRow label={t("finance.expenses.amount", "Amount")} required>
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow label={t("finance.expenses.description", "Description")} required>
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow label={t("finance.expenses.category", "Category")} required>
            <FormField
              control={control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("finance.expenses.selectCategory", "Select category")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="utilities">{t("finance.expenseCategories.utilities", "Utilities")}</SelectItem>
                      <SelectItem value="rent">{t("finance.expenseCategories.rent", "Rent")}</SelectItem>
                      <SelectItem value="supplies">{t("finance.expenseCategories.supplies", "Supplies")}</SelectItem>
                      <SelectItem value="maintenance">{t("finance.expenseCategories.maintenance", "Maintenance")}</SelectItem>
                      <SelectItem value="other">{t("finance.expenseCategories.other", "Other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>

          <FormRow label={t("finance.expenses.date", "Date")} required>
            <FormField
              control={control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FormRow>
        </>
      )}
    </FormDialog>
  );
} 