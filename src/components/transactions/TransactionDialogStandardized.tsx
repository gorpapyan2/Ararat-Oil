import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Transaction, PaymentMethod, PaymentStatus } from "@/types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StandardDialog } from "@/components/ui/composed/dialog";

// Define the form schema
const transactionSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  payment_method: z.enum(["cash", "card", "bank_transfer", "mobile_payment"], {
    required_error: "Payment method is required"
  }),
  payment_status: z.enum(["pending", "completed", "failed", "refunded"], {
    required_error: "Payment status is required"
  }),
  shift_id: z.string().min(1, "Shift is required"),
  description: z.string().optional(),
  payment_reference: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionDialogStandardizedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onSubmit: (id: string, data: Partial<Omit<Transaction, "id">>) => void;
  onClose: () => void;
  currentShiftId: string;
}

export function TransactionDialogStandardized({
  open,
  onOpenChange,
  transaction,
  onSubmit,
  onClose,
  currentShiftId,
}: TransactionDialogStandardizedProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      payment_method: "cash" as PaymentMethod,
      payment_status: "pending" as PaymentStatus,
      description: "",
      payment_reference: "",
      shift_id: currentShiftId,
    },
  });

  // Update form when transaction data changes
  useEffect(() => {
    if (transaction) {
      form.reset({
        amount: transaction.amount,
        payment_method: transaction.payment_method,
        payment_status: transaction.payment_status,
        description: transaction.description || "",
        payment_reference: transaction.payment_reference || "",
        shift_id: transaction.shift_id,
      });
    }
  }, [transaction, form]);

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    if (transaction?.id) {
      onSubmit(transaction.id, data);
      onOpenChange(false);
    }
  });

  return (
    <StandardDialog
      open={open}
      onOpenChange={(isOpen) => {
        onOpenChange(isOpen);
        if (!isOpen) onClose();
      }}
      title="Edit Transaction"
      description="Update transaction details"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    {...field}
                  />
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
                <FormLabel>Payment Method</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_payment">Mobile Payment</SelectItem>
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
                <FormLabel>Payment Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="payment_reference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reference</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter payment reference"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      </Form>
    </StandardDialog>
  );
}
