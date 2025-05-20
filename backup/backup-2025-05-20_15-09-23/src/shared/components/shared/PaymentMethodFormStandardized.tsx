import { z } from "zod";
import { PaymentMethod } from "@/types";
import { Button } from '@/core/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/core/components/ui/card';
import { Separator } from '@/core/components/ui/separator';
import { formatCurrency } from "@/shared/utils";
import { 
  FormInput, 
  FormSelect,
  FormTextarea 
} from '@/core/components/ui/composed/form-fields';
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

const paymentSchema = z.object({
  payment_method: z.enum([
    "cash",
    "card",
    "bank_transfer",
    "mobile_payment",
  ] as const, {
    required_error: "Payment method is required"
  }),
  payment_reference: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentMethodFormStandardizedProps {
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

export function PaymentMethodFormStandardized({
  onSubmit,
  isSubmitting = false,
  amount,
  title = "Payment Details",
  description = "Complete payment information below",
  referenceLabel = "Payment Reference",
  entityDetails,
}: PaymentMethodFormStandardizedProps) {
  const form = useZodForm({
    schema: paymentSchema,
    defaultValues: {
      payment_method: "cash",
      payment_reference: "",
      notes: "",
    },
  });

  const { isSubmitting: isFormSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<PaymentFormData>(
    form,
    onSubmit
  );

  const paymentMethodOptions = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "bank_transfer", label: "Bank Transfer" },
    { value: "mobile_payment", label: "Mobile Payment" },
  ];

  return (
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormSelect
            name="payment_method"
            label="Payment Method"
            form={form}
            options={paymentMethodOptions}
            placeholder="Select payment method"
          />

          <FormInput
            name="payment_reference"
            label={referenceLabel}
            form={form}
            placeholder={`Enter ${referenceLabel.toLowerCase()}`}
          />

          <FormInput
            name="notes"
            label="Notes (Optional)"
            form={form}
            placeholder="Additional payment notes"
            autoComplete="off"
          />

          <Separator className="my-4" />

          <div className="flex justify-between items-center pt-2">
            <div className="text-lg font-semibold">Total Amount:</div>
            <div className="text-lg font-bold">{formatCurrency(amount)}</div>
          </div>

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={isSubmitting || isFormSubmitting}
          >
            {isSubmitting || isFormSubmitting ? "Processing..." : "Complete Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 