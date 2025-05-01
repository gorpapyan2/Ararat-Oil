import { useState } from "react";
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
import { CurrencyInput } from "@/components/ui/currency-input";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";

// Define the payment method item schema
const paymentMethodItemSchema = z.object({
  payment_method: z.enum([
    "cash",
    "card",
    "bank_transfer", 
    "mobile_payment"
  ] as const),
  amount: z.number().min(1, "Amount must be greater than zero"),
  reference: z.string().optional(),
});

// Define the form schema for multiple payment methods
const multiPaymentSchema = z.object({
  paymentMethods: z.array(paymentMethodItemSchema)
    .min(1, "At least one payment method is required"),
});

export type PaymentMethodItem = z.infer<typeof paymentMethodItemSchema>;
export type MultiPaymentFormData = z.infer<typeof multiPaymentSchema>;

interface MultiPaymentMethodFormProps {
  onSubmit: (data: MultiPaymentFormData) => void;
  isSubmitting?: boolean;
  totalAmount: number;
  showTotal?: boolean;
}

export function MultiPaymentMethodForm({
  onSubmit,
  isSubmitting = false,
  totalAmount,
  showTotal = true,
}: MultiPaymentMethodFormProps) {
  const { t } = useTranslation();
  const [formPaymentMethods, setFormPaymentMethods] = useState<PaymentMethodItem[]>([
    { payment_method: "cash", amount: totalAmount, reference: "" }
  ]);
  
  const form = useForm<MultiPaymentFormData>({
    resolver: zodResolver(multiPaymentSchema),
    defaultValues: {
      paymentMethods: formPaymentMethods,
    },
  });

  // Calculate the current total from all payment methods
  const currentTotal = formPaymentMethods.reduce((sum, method) => sum + (method.amount || 0), 0);
  const remainingAmount = totalAmount - currentTotal;

  // Function to add a new payment method
  const addPaymentMethod = () => {
    const newMethod: PaymentMethodItem = {
      payment_method: "card",
      amount: remainingAmount > 0 ? remainingAmount : 0,
      reference: "",
    };
    
    const updatedMethods = [...formPaymentMethods, newMethod];
    setFormPaymentMethods(updatedMethods);
    form.setValue("paymentMethods", updatedMethods);
  };

  // Function to remove a payment method
  const removePaymentMethod = (index: number) => {
    if (formPaymentMethods.length === 1) return; // Don't remove the last one
    
    const updatedMethods = formPaymentMethods.filter((_, i) => i !== index);
    setFormPaymentMethods(updatedMethods);
    form.setValue("paymentMethods", updatedMethods);
  };

  // Update a specific payment method
  const updatePaymentMethod = (index: number, field: keyof PaymentMethodItem, value: any) => {
    const updatedMethods = [...formPaymentMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value,
    };
    setFormPaymentMethods(updatedMethods);
    form.setValue("paymentMethods", updatedMethods);
  };

  const handleFormSubmit = (data: MultiPaymentFormData) => {
    // Forward the validated form data to the parent component
    onSubmit(data);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
          <div className="space-y-4">
            {formPaymentMethods.map((method, index) => (
              <div key={index} className="p-4 border rounded-md bg-muted/30 relative">
                {/* Remove button */}
                {formPaymentMethods.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removePaymentMethod(index)}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove</span>
                  </Button>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <FormLabel>{t("common.paymentMethod")}</FormLabel>
                    <Select
                      value={method.payment_method}
                      onValueChange={(value) => 
                        updatePaymentMethod(index, "payment_method", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">{t("paymentMethods.cash")}</SelectItem>
                        <SelectItem value="card">{t("paymentMethods.card")}</SelectItem>
                        <SelectItem value="bank_transfer">
                          {t("paymentMethods.bankTransfer")}
                        </SelectItem>
                        <SelectItem value="mobile_payment">
                          {t("paymentMethods.mobilePayment")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Amount */}
                  <div className="space-y-2">
                    <FormLabel>{t("common.amount")}</FormLabel>
                    <CurrencyInput
                      value={method.amount}
                      onChange={(value) => updatePaymentMethod(index, "amount", value)}
                      placeholder="0"
                    />
                  </div>
                  
                  {/* Reference/Notes */}
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel>{method.payment_method === "cash" ? t("common.notes") : t("common.reference")}</FormLabel>
                    <Input
                      value={method.reference || ""}
                      onChange={(e) => updatePaymentMethod(index, "reference", e.target.value)}
                      placeholder={method.payment_method === "cash" 
                        ? t("paymentMethods.cashNotesPlaceholder")
                        : t("paymentMethods.referencePlaceholder")
                      }
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add payment method button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={addPaymentMethod}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("paymentMethods.addAnother")}
            </Button>

            {showTotal && (
              <>
                <Separator className="my-4" />
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">{t("common.totalAmount")}:</div>
                  <div className="text-lg font-bold">{formatCurrency(totalAmount)}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium text-muted-foreground">
                    {t("paymentMethods.enteredAmount")}:
                  </div>
                  <div className={`text-sm font-medium ${
                    currentTotal === totalAmount 
                      ? "text-green-500" 
                      : "text-red-500"
                  }`}>
                    {formatCurrency(currentTotal)}
                  </div>
                </div>
                
                {currentTotal !== totalAmount && (
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium text-muted-foreground">
                      {remainingAmount > 0 
                        ? t("paymentMethods.remaining") 
                        : t("paymentMethods.excess")}:
                    </div>
                    <div className="text-sm font-medium text-red-500">
                      {formatCurrency(Math.abs(remainingAmount))}
                    </div>
                  </div>
                )}
              </>
            )}

            <Button
              type="submit"
              className="w-full mt-4"
              disabled={isSubmitting || currentTotal !== totalAmount}
            >
              {isSubmitting ? t("common.processing") : t("paymentMethods.completePayment")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 