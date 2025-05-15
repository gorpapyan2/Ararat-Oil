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
import { Switch } from "@/components/ui/switch";
import { useFinance } from "../hooks/useFinance";
import type { Transaction, PaymentMethod, PaymentStatus } from "../types/finance.types";

const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
  payment_method: z.string().min(1, "Payment method is required"),
  payment_status: z.string().min(1, "Payment status is required"),
  employee_id: z.string().min(1, "Employee is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

export function TransactionDialogStandardized({
  open,
  onOpenChange,
  transaction,
}: TransactionDialogStandardizedProps) {
  const { t } = useTranslation();
  const { createTransaction, updateTransaction } = useFinance();
  const isEditing = !!transaction;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      description: transaction?.description || "",
      payment_method: transaction?.payment_method || "",
      payment_status: transaction?.payment_status || "pending",
      employee_id: transaction?.employee_id || "",
    },
  });

  const onSubmit = (data: TransactionFormValues) => {
    if (isEditing && transaction) {
      updateTransaction.mutate(
        { 
          id: transaction.id, 
          data: {
            ...data,
            payment_method: data.payment_method as PaymentMethod,
          } as Partial<Transaction> 
        },
        {
          onSuccess: () => {
            toast.success(t("finance.transactions.updateSuccess", "Transaction updated successfully"));
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(t("finance.transactions.updateError", "Failed to update transaction"));
            console.error("Error updating transaction:", error);
          },
        }
      );
    } else {
      createTransaction.mutate(
        {
          amount: data.amount,
          description: data.description,
          payment_method: data.payment_method as PaymentMethod,
          payment_status: data.payment_status as PaymentStatus,
          employee_id: data.employee_id,
        },
        {
          onSuccess: () => {
            toast.success(t("finance.transactions.createSuccess", "Transaction created successfully"));
            onOpenChange(false);
          },
          onError: (error) => {
            toast.error(t("finance.transactions.createError", "Failed to create transaction"));
            console.error("Error creating transaction:", error);
          },
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title={isEditing
      ? t("finance.transactions.edit", "Edit Transaction")
      : t("finance.transactions.create", "Create Transaction")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("finance.transactions.edit", "Edit Transaction")
              : t("finance.transactions.create", "Create Transaction")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.transactions.amount", "Amount")}</FormLabel>
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
                  <FormLabel>{t("finance.transactions.description", "Description")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.transactions.paymentMethod", "Payment Method")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("finance.transactions.selectPaymentMethod", "Select payment method")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">{t("finance.paymentMethods.cash", "Cash")}</SelectItem>
                      <SelectItem value="card">{t("finance.paymentMethods.card", "Card")}</SelectItem>
                      <SelectItem value="bank_transfer">{t("finance.paymentMethods.bankTransfer", "Bank Transfer")}</SelectItem>
                      <SelectItem value="mobile_payment">{t("finance.paymentMethods.mobilePayment", "Mobile Payment")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.transactions.paymentStatus", "Payment Status")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("finance.transactions.selectPaymentStatus", "Select payment status")} />
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
              <Button type="submit" disabled={createTransaction.isPending || updateTransaction.isPending}>
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