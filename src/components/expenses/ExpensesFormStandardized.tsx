import * as React from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { 
  FormInput, 
  FormSelect, 
  FormTextarea, 
  FormDatePicker,
  FormCurrencyInput 
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/useZodForm";
import { Expense } from "@/types";

// Define the form schema using Zod
const expenseSchema = z.object({
  date: z.date({ required_error: "Expense date is required" }),
  category: z.string().min(1, "Category required"),
  description: z.string().min(2, "Description required"),
  amount: z.coerce
    .number()
    .positive("Positive value")
    .finite("Must be a number"),
  payment_method: z.string().min(1, "Payment method required"),
  invoice_number: z.string().optional(),
  notes: z.string().optional(),
});

// Type for the form values from the schema
type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpensesFormStandardizedProps {
  categories: string[];
  expense?: Expense | null;
  onSubmit: (data: ExpenseFormValues) => void;
  onCancel: () => void;
}

export function ExpensesFormStandardized({
  categories,
  expense,
  onSubmit,
  onCancel,
}: ExpensesFormStandardizedProps) {
  // Payment methods
  const paymentMethods = [
    { value: "cash", label: "CASH" },
    { value: "card", label: "CARD" },
    { value: "bank_transfer", label: "BANK TRANSFER" },
    { value: "mobile_payment", label: "MOBILE PAYMENT" },
  ];

  // Initialize form with the schema and default values
  const form = useZodForm({
    schema: expenseSchema,
    defaultValues: {
      date: expense?.date ? new Date(expense.date) : new Date(),
      category: expense?.category ?? "",
      description: expense?.description ?? "",
      amount: Number(expense?.amount || 0),
      payment_method: expense?.payment_method || paymentMethods[0].value,
      invoice_number: expense?.invoice_number || "",
      notes: expense?.notes || "",
    },
  });

  // Form submission handler with loading state
  const { handleSubmit, isSubmitting } = useFormSubmitHandler<ExpenseFormValues>(
    (data) => {
      onSubmit(data);
      form.reset();
    }
  );

  // Create category options for the select component
  const categoryOptions = categories.map(category => ({
    value: category,
    label: category,
  }));

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Date Picker */}
      <FormDatePicker
        name="date"
        label="Expense Date"
        form={form}
        placeholder="Pick a date"
        disabled={(date) => date > new Date()}
      />

      {/* Category */}
      <FormSelect
        name="category"
        label="Category"
        form={form}
        options={categoryOptions}
        placeholder="Select category"
      />

      {/* Description */}
      <FormInput
        name="description"
        label="Description"
        form={form}
        placeholder="Expense description"
        autoComplete="off"
      />

      {/* Amount */}
      <FormCurrencyInput
        name="amount"
        label="Amount (AMD)"
        form={form}
        placeholder="0"
      />

      {/* Payment Method */}
      <FormSelect
        name="payment_method"
        label="Payment Method"
        form={form}
        options={paymentMethods}
        placeholder="Select payment method"
      />

      {/* Invoice Number */}
      <FormInput
        name="invoice_number"
        label="Invoice Number (Optional)"
        form={form}
        placeholder="Invoice number"
        autoComplete="off"
      />

      {/* Notes */}
      <FormTextarea
        name="notes"
        label="Notes (Optional)"
        form={form}
        placeholder="Additional notes"
        rows={2}
      />

      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : expense
            ? "Update Expense"
            : "Add Expense"}
        </Button>
      </div>
    </form>
  );
} 