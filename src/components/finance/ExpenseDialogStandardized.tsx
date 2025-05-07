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
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpense, updateExpense } from "@/services/expenses";
import { Expense, ExpenseCategory,  PaymentStatus } from "@/types";

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  payment_status: z.string().min(1, "Payment status is required"),
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
  const queryClient = useQueryClient();
  const isEditing = !!expense;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: expense?.date || new Date().toISOString().split("T")[0],
      description: expense?.description || "",
      category: expense?.category || "",
      amount: expense?.amount || 0,
      payment_status: expense?.payment_status || "pending",
    },
  });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(t("finance.expenses.createSuccess", "Expense created successfully"));
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(t("finance.expenses.createError", "Failed to create expense"));
      console.error("Error creating expense:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Expense> }) =>
      updateExpense(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success(t("finance.expenses.updateSuccess", "Expense updated successfully"));
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(t("finance.expenses.updateError", "Failed to update expense"));
      console.error("Error updating expense:", error);
    },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    if (isEditing && expense) {
      updateMutation.mutate({ 
        id: expense.id, 
        data: {
          date: data.date,
          description: data.description,
          category: data.category as ExpenseCategory,
          amount: data.amount,
          payment_status: data.payment_status as PaymentStatus
        }
      });
    } else {
      createMutation.mutate({
        date: data.date,
        description: data.description,
        category: data.category as ExpenseCategory,
        amount: data.amount,
        payment_status: data.payment_status as PaymentStatus
      });
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
                      <SelectItem value="salaries">{t("finance.expenseCategories.salaries", "Salaries")}</SelectItem>
                      <SelectItem value="maintenance">{t("finance.expenseCategories.maintenance", "Maintenance")}</SelectItem>
                      <SelectItem value="supplies">{t("finance.expenseCategories.supplies", "Supplies")}</SelectItem>
                      <SelectItem value="taxes">{t("finance.expenseCategories.taxes", "Taxes")}</SelectItem>
                      <SelectItem value="insurance">{t("finance.expenseCategories.insurance", "Insurance")}</SelectItem>
                      <SelectItem value="other">{t("finance.expenseCategories.other", "Other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.paymentStatus", "Payment Status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("finance.expenses.selectPaymentStatus", "Select payment status")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">{t("finance.paymentStatus.pending", "Pending")}</SelectItem>
                      <SelectItem value="completed">{t("finance.paymentStatus.completed", "Completed")}</SelectItem>
                      <SelectItem value="failed">{t("finance.paymentStatus.failed", "Failed")}</SelectItem>
                      <SelectItem value="refunded">{t("finance.paymentStatus.refunded", "Refunded")}</SelectItem>
                    </SelectContent>
                  </Select>
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
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