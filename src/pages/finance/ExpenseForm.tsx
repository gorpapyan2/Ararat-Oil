import React from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Ban } from "lucide-react";

// UI components
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/form";
import { Input } from "@/core/components/ui/primitives/input";
import { Button } from "@/core/components/ui/button";
import { Textarea } from "@/core/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/primitives/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/core/components/ui/alert-dialog";

// Types
import { Expense } from "@/types";

// Schema for expense validation
const expenseSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  amount: z.coerce
    .number()
    .min(0.01, { message: "Amount must be greater than 0" }),
  category: z.string().min(1, { message: "Category is required" }),
  payment_status: z.enum(["pending", "completed", "failed", "refunded"], {
    required_error: "Payment status is required",
  }),
  payment_method: z.string().optional(),
  notes: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onSubmit: (data: ExpenseFormValues) => void;
  isSubmitting: boolean;
  defaultValues?: Partial<Expense>;
  onConfirm: () => void;
  onConfirmCancel: () => void;
  isConfirmOpen: boolean;
}

export function ExpenseForm({
  onSubmit,
  isSubmitting,
  defaultValues,
  onConfirm,
  onConfirmCancel,
  isConfirmOpen,
}: ExpenseFormProps) {
  const { t } = useTranslation();

  // Initialize the form with default values and resolver
  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      date: defaultValues?.date || new Date().toISOString().split("T")[0],
      description: defaultValues?.description || "",
      amount: defaultValues?.amount || 0,
      category: defaultValues?.category || "",
      payment_status: defaultValues?.payment_status || "pending",
      payment_method: defaultValues?.payment_method || "",
      notes: defaultValues?.notes || "",
    },
  });

  // Expense category options
  const expenseCategories = [
    "salaries",
    "rent",
    "utilities",
    "maintenance",
    "supplies",
    "taxes",
    "insurance",
    "advertising",
    "fuel",
    "miscellaneous",
  ];

  // Payment method options
  const paymentMethods = ["cash", "bank_transfer", "card", "check", "other"];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          noValidate
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Field */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.date")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount Field */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.amount")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t(
                      "finance.expenses.amountDesc",
                      "Enter the expense amount"
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.category")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "finance.expenses.selectCategory",
                            "Select a category"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {t(
                            `finance.expenses.categories.${category}`,
                            category
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Status Field */}
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.paymentStatus")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "finance.expenses.selectStatus",
                            "Select status"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">
                        {t("finance.paymentStatus.pending", "Pending")}
                      </SelectItem>
                      <SelectItem value="completed">
                        {t("finance.paymentStatus.completed", "Completed")}
                      </SelectItem>
                      <SelectItem value="failed">
                        {t("finance.paymentStatus.failed", "Failed")}
                      </SelectItem>
                      <SelectItem value="refunded">
                        {t("finance.paymentStatus.refunded", "Refunded")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Method Field */}
            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("finance.expenses.paymentMethod")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t(
                            "finance.expenses.selectMethod",
                            "Select payment method"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {t(`finance.expenses.methods.${method}`, method)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field - Full Width */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("common.description")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "finance.expenses.descriptionPlaceholder",
                        "Enter expense description"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes Field - Full Width */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>{t("common.notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        "finance.expenses.notesPlaceholder",
                        "Additional notes (optional)"
                      )}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onConfirmCancel}
              disabled={isSubmitting}
            >
              <Ban className="mr-2 h-4 w-4" />
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {t("common.save")}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={onConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("finance.expenses.confirmTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t(
                "finance.expenses.confirmDescription",
                "Are you sure you want to save this expense? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
