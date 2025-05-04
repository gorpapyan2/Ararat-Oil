import { useState } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Plus, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { formatCurrency } from "@/lib/utils";
import { FormProvider } from "react-hook-form";

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

interface MultiPaymentMethodFormStandardizedProps {
  onSubmit: (data: MultiPaymentFormData) => void;
  isSubmitting?: boolean;
  totalAmount: number;
  showTotal?: boolean;
}

export function MultiPaymentMethodFormStandardized({
  onSubmit,
  isSubmitting = false,
  totalAmount,
  showTotal = true,
}: MultiPaymentMethodFormStandardizedProps) {
  const { t } = useTranslation();
  const [formPaymentMethods, setFormPaymentMethods] = useState<PaymentMethodItem[]>([
    { payment_method: "cash", amount: totalAmount, reference: "" }
  ]);
  
  const form = useZodForm({
    schema: multiPaymentSchema,
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

  // Create form submission handler with useFormSubmitHandler
  const { isSubmitting: formSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler(
    form,
    (data) => {
      onSubmit(data);
      return true;
    }
  );

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            
            {/* Show the total if required */}
            {showTotal && (
              <>
                <Separator className="my-4" />
                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("common.totalAmount")}:</span>
                    <span className="font-bold">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{t("common.currentTotal")}:</span>
                    <span className={`font-medium ${
                      currentTotal !== totalAmount ? "text-yellow-600" : "text-green-600"
                    }`}>
                      {formatCurrency(currentTotal)}
                    </span>
                  </div>
                  {currentTotal !== totalAmount && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {remainingAmount > 0 
                          ? t("common.remainingAmount") 
                          : t("common.overpaymentAmount")}:
                      </span>
                      <span className={`font-medium ${
                        remainingAmount > 0 ? "text-red-600" : "text-red-600"
                      }`}>
                        {formatCurrency(Math.abs(remainingAmount))}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {/* Submit button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting || !form.formState.isValid || currentTotal !== totalAmount}
              >
                {isSubmitting ? t("common.saving") : t("common.confirm")}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
} 