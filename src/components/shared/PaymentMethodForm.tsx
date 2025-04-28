import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PaymentMethod } from "@/types";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

const paymentSchema = z.object({
  payment_method: z.enum([
    "cash",
    "card",
    "bank_transfer",
    "mobile_payment",
  ] as const),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentMethodFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isSubmitting?: boolean;
  amount: number;
  title?: string;
  description?: string;
  referenceLabel?: string;
  entityDetails?: {
    id: string;
    type: string;
    date: string;
    employee?: string;
  };
}

export function PaymentMethodForm({
  onSubmit,
  isSubmitting = false,
  amount,
  title = "Payment Details",
  description = "Complete payment information below",
  referenceLabel = "Payment Reference",
  entityDetails,
}: PaymentMethodFormProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      payment_method: "cash",
      payment_reference: "",
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <Card className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        {entityDetails && (
          <CardContent className="pt-0 pb-3">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice #:</p>
                  <p className="font-medium">
                    {entityDetails.id.substring(0, 8)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date:</p>
                  <p className="font-medium">
                    {new Date(entityDetails.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Type:</p>
                  <p className="font-medium capitalize">{entityDetails.type}</p>
                </div>
                {entityDetails.employee && (
                  <div>
                    <p className="text-muted-foreground">Processed by:</p>
                    <p className="font-medium">{entityDetails.employee}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="mobile_payment">
                        Mobile Payment
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{referenceLabel}</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={`Enter ${referenceLabel.toLowerCase()}`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Additional payment notes" autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator className="my-4" />

            <div className="flex justify-between items-center pt-2">
              <div className="text-lg font-semibold">Total Amount:</div>
              <div className="text-lg font-bold">{formatCurrency(amount)}</div>
            </div>

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Complete Payment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
