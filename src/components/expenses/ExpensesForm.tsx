import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CalendarIcon,
  ChevronDown,
  FileText,
  DollarSign,
  CreditCard,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ExpenseCategory, PaymentMethod, Expense } from "@/types";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { format } from "date-fns";
import { useState } from "react";
import { CurrencyField } from "@/components/form-fields/CurrencyField";

// Types for new/edited expense
const schema = z.object({
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

type FormData = z.infer<typeof schema>;

interface ExpensesFormProps {
  categories: string[];
  expense?: Expense | null;
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
}

export function ExpensesForm({
  categories,
  expense,
  onSubmit,
  onCancel,
}: ExpensesFormProps) {
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    "cash",
    "card",
    "bank_transfer",
    "mobile_payment",
  ];

  const defaultValues: FormData = {
    date: expense?.date ? new Date(expense.date) : new Date(),
    category: expense?.category ?? "",
    description: expense?.description ?? "",
    amount: Number(expense?.amount || ""),
    payment_method: expense?.payment_method || paymentMethods[0],
    invoice_number: expense?.invoice_number || "",
    notes: expense?.notes || "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // UX: focus on Description if not editing
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <Form {...form}>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((data) => {
          onSubmit(data);
          form.reset();
        })}
      >
        {/* Expense Date with DatePicker */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Date</FormLabel>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(d) => {
                      field.onChange(d);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category Dropdown */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Expense description" autoComplete="off" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount with Currency Field */}
        <CurrencyField
          control={form.control}
          name="amount"
          label="Amount (AMD)"
          placeholder="0"
          required
          min={0}
        />

        {/* Payment Method */}
        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Invoice Number */}
        <FormField
          control={form.control}
          name="invoice_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invoice Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Invoice number" autoComplete="off" />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Additional notes" rows={2} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-white">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
