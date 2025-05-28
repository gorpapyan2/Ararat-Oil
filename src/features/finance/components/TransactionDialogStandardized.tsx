import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/core/components/ui/dialog";
import { Button } from "@/core/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/primitives/input";
import { useToast } from "@/hooks";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import { Transaction } from '../types/finance.types';

// Schema for transaction form
const transactionSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

// Component props
interface TransactionDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: Transaction; // Properly typed transaction
  onSubmit: (data: TransactionFormValues) => Promise<void>;
  categories?: { id: string; name: string; type: string }[];
  isLoading?: boolean;
}

function TransactionDialogStandardized({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  categories = [],
  isLoading = false,
}: TransactionDialogStandardizedProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isEditing = Boolean(transaction);

  // Form setup with default values
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: transaction?.amount || 0,
      type: transaction?.type || "income",
      category: transaction?.category || "",
      description: transaction?.description || "",
      date: transaction?.date
        ? new Date(transaction.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  // Get the current transaction type from form
  const transactionType = form.watch("type");

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType || category.type === "all"
  );

  // Form submission handler
  const handleSubmit = async (data: TransactionFormValues) => {
    try {
      await onSubmit(data);
      toast({
        title: "Success",
        description: isEditing
          ? "Transaction updated successfully"
          : "Transaction created successfully",
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing
              ? t("finance.editTransaction", "Edit Transaction")
              : t("finance.newTransaction", "New Transaction")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("finance.transactionType", "Transaction Type")}
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("finance.selectType", "Select type")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">
                        {t("finance.income", "Income")}
                      </SelectItem>
                      <SelectItem value="expense">
                        {t("finance.expense", "Expense")}
                      </SelectItem>
                      <SelectItem value="transfer">
                        {t("finance.transfer", "Transfer")}
                      </SelectItem>
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
                  <FormLabel>{t("finance.amount", "Amount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
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
                  <FormLabel>{t("finance.category", "Category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "finance.selectCategory",
                            "Select category"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
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
                  <FormLabel>{t("common.date", "Date")}</FormLabel>
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
                  <FormLabel>
                    {t("common.description", "Description")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "finance.transactionDescription",
                        "Enter description..."
                      )}
                      className="resize-none"
                      {...field}
                    />
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
                disabled={isLoading}
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? t("common.saving", "Saving...")
                  : isEditing
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

export { TransactionDialogStandardized };
export default TransactionDialogStandardized;
