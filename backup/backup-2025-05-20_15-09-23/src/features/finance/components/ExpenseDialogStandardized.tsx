import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/core/components/ui/dialog';
import { Button } from '@/core/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/form';
import { Input } from '@/core/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/core/components/ui/select';
import { useFinance } from "../hooks/useFinance";
import type { Expense } from "../types/finance.types";

const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  employee_id: z.string().min(1, "Employee is required"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: Expense | null;
}

export function ExpenseDialogStandardized({
  open,
  onOpenChange,
  expense,
}: ExpenseDialogStandardizedProps) {
  const { t } = useTranslation();
  const { createExpense, updateExpense } = useFinance();
  const isEditing = !!expense;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense?.amount || 0,
      description: expense?.description || "",
      category: expense?.category || "",
      date: expense?.date || new Date().toISOString().split('T')[0],
      employee_id: expense?.employee_id || "",
    },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    if (isEditing && expense) {
      updateExpense.mutate(
        { 
          id: expense.id, 
          data: data as Partial<Expense>
        },
        {
          onSuccess: () => {
            toast.success(t("finance.expenses.updateSuccess", "Expense updated successfully"));
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(t("finance.expenses.updateError", "Failed to update expense"));
            console.error("Error updating expense:", error);
          },
        }
      );
    } else {
      createExpense.mutate(
        data as Omit<Expense, "id" | "created_at" | "updated_at">,
        {
          onSuccess: () => {
            toast.success(t("finance.expenses.createSuccess", "Expense created successfully"));
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(t("finance.expenses.createError", "Failed to create expense"));
            console.error("Error creating expense:", error);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={isEditing
      ? t("finance.expenses.edit", "Edit Expense")
      : t("finance.expenses.create", "Create Expense")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("finance.expenses.edit", "Edit Expense")
              : t("finance.expenses.create", "Create Expense")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.amount", "Amount")}</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.description", "Description")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.category", "Category")}</FormLabel>
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

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.date", "Date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" disabled={createExpense.isPending || updateExpense.isPending}>
                {isEditing
                  ? t("common.save", "Save")
                  : t("common.create", "Create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 