import { useState, useEffect } from "react";
import * as z from "zod";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/primitives/input";
import { Separator } from "@/core/components/ui/separator";
import { FormLabel } from "@/core/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/core/components/ui/primitives/select";
import { CurrencyInput } from "@/core/components/ui/currency-input";
import { Plus, X, AlertTriangle, Info, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";
import { formatCurrency } from "@/shared/utils";
import { FormProvider } from "react-hook-form";
import { Alert, AlertDescription } from "@/core/components/ui/alert";

// Define standard payment method schema (non-zero amounts)
const paymentMethodItemSchema = z.object({
  payment_method: z.enum(
    ["cash", "card", "bank_transfer", "mobile_payment"] as const,
    {
      required_error: "Payment method is required",
    }
  ),
  amount: z
    .number()
    .min(0.01, "Amount must be greater than zero")
    .nonnegative("Amount cannot be negative"),
  reference: z.string().optional(),
});

// Define zero-total payment method schema (allows zero amounts)
const zeroTotalPaymentMethodSchema = z.object({
  payment_method: z.enum(
    ["cash", "card", "bank_transfer", "mobile_payment"] as const,
    {
      required_error: "Payment method is required",
    }
  ),
  amount: z.number().nonnegative("Amount cannot be negative"),
  reference: z.string().optional(),
});

// Standard multi-payment schema with validation
const multiPaymentSchema = z.object({
  paymentMethods: z
    .array(paymentMethodItemSchema)
    .min(1, "At least one payment method is required")
    .refine((methods) => methods.every((m) => m.amount > 0), {
      message: "All payment methods must have an amount greater than zero",
    }),
});

// Zero-total multi-payment schema with relaxed validation
const zeroTotalMultiPaymentSchema = z.object({
  paymentMethods: z.array(zeroTotalPaymentMethodSchema),
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
  const isZeroTotal = Math.abs(totalAmount) < 0.01;

  // Reset form when total amount changes
  const [formPaymentMethods, setFormPaymentMethods] = useState<
    PaymentMethodItem[]
  >([
    {
      payment_method: "cash",
      amount: isZeroTotal ? 0 : totalAmount,
      reference: "",
    },
  ]);
  const [formError, setFormError] = useState<string | null>(null);

  // Use useEffect to reset form payment methods when totalAmount changes
  useEffect(() => {
    setFormPaymentMethods([
      {
        payment_method: "cash",
        amount: isZeroTotal ? 0 : totalAmount,
        reference: "",
      },
    ]);
  }, [totalAmount, isZeroTotal]);

  // Use the appropriate schema based on whether totalAmount is zero
  const form = useZodForm({
    schema: isZeroTotal ? zeroTotalMultiPaymentSchema : multiPaymentSchema,
    defaultValues: {
      paymentMethods: formPaymentMethods,
    },
  });

  // Update form values when formPaymentMethods changes
  useEffect(() => {
    form.setValue("paymentMethods", formPaymentMethods);
  }, [formPaymentMethods, form]);

  // Calculate the current total from all payment methods
  const currentTotal = formPaymentMethods.reduce(
    (sum, method) => sum + (method.amount || 0),
    0
  );
  const remainingAmount = totalAmount - currentTotal;
  const isBalanced = Math.abs(remainingAmount) < 0.01; // Use a small epsilon for floating-point comparison

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
    setFormError(null);
  };

  // Function to remove a payment method
  const removePaymentMethod = (index: number) => {
    if (formPaymentMethods.length === 1) return; // Don't remove the last one

    const updatedMethods = formPaymentMethods.filter((_, i) => i !== index);
    setFormPaymentMethods(updatedMethods);
    form.setValue("paymentMethods", updatedMethods);
    setFormError(null);
  };

  // Update a specific payment method
  const updatePaymentMethod = <K extends keyof PaymentMethodItem>(
    index: number,
    field: K,
    value: PaymentMethodItem[K]
  ) => {
    const updatedMethods = [...formPaymentMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: value,
    };
    setFormPaymentMethods(updatedMethods);
    form.setValue("paymentMethods", updatedMethods);
    setFormError(null);
  };

  // Create form submission handler with useFormSubmitHandler
  const { isSubmitting: formSubmitting, onSubmit: handleSubmit } =
    useFormSubmitHandler(form, (data) => {
      try {
        // Skip validation for zero total amounts
        if (isZeroTotal) {
          console.log(
            "Zero total amount, submitting without validation:",
            data
          );
          onSubmit(data);
          return true;
        }

        // Additional validation before submission
        const total = data.paymentMethods.reduce(
          (sum, method) => sum + (method.amount || 0),
          0
        );
        console.log(
          "Form validation - form total:",
          total,
          "expected total:",
          totalAmount
        );

        // Check if total matches expected amount
        if (Math.abs(total - totalAmount) >= 0.01) {
          console.log("Total mismatch:", total, "vs", totalAmount);
          setFormError(
            t(
              "paymentMethods.totalMismatch",
              "Total amount must match the required total"
            )
          );
          return false;
        }

        // Check if all payment methods have a valid payment_method and amount
        const invalidMethods = data.paymentMethods.filter(
          (method) => !method.payment_method || method.amount <= 0
        );

        if (invalidMethods.length > 0) {
          console.log("Invalid payment methods:", invalidMethods);
          setFormError(
            t(
              "paymentMethods.invalidMethods",
              "All payment methods must have a valid payment type and amount"
            )
          );
          return false;
        }

        // If all validation passes, submit the form
        console.log("Form validation passed, submitting:", data);
        onSubmit(data);
        return true;
      } catch (err) {
        console.error("Error during form validation:", err);
        setFormError(
          t("common.unexpectedError", "An unexpected error occurred")
        );
        return false;
      }
    });

  return (
    <div className="space-y-4">
      <FormProvider {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {isZeroTotal && (
            <Alert variant="default" className="bg-blue-50 border-blue-100">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                {t(
                  "paymentMethods.zeroTotalMessage",
                  "No sales recorded for this shift. You can close the shift without entering payment methods, or record payment methods with zero amount."
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {formPaymentMethods.map((method, index) => (
              <div
                key={index}
                className="p-4 border rounded-md bg-muted/30 relative"
              >
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
                        updatePaymentMethod(
                          index,
                          "payment_method",
                          value as PaymentMethodItem["payment_method"]
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">
                          {t("paymentMethods.cash")}
                        </SelectItem>
                        <SelectItem value="card">
                          {t("paymentMethods.card")}
                        </SelectItem>
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
                      onChange={(value) =>
                        updatePaymentMethod(index, "amount", value)
                      }
                      placeholder="0"
                    />
                  </div>

                  {/* Reference/Notes */}
                  <div className="space-y-2 md:col-span-2">
                    <FormLabel>
                      {method.payment_method === "cash"
                        ? t("common.notes")
                        : t("common.reference")}
                    </FormLabel>
                    <Input
                      value={method.reference || ""}
                      onChange={(e) =>
                        updatePaymentMethod(index, "reference", e.target.value)
                      }
                      placeholder={
                        method.payment_method === "cash"
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
                    <span className="font-medium">
                      {t("common.totalAmount")}:
                    </span>
                    <span className="font-bold">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {t("common.currentTotal")}:
                    </span>
                    <span
                      className={`font-medium ${
                        isBalanced ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {formatCurrency(currentTotal)}
                    </span>
                  </div>
                  {!isBalanced && !isZeroTotal && (
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {remainingAmount > 0
                          ? t("common.remainingAmount")
                          : t("common.overpaymentAmount")}
                        :
                      </span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(Math.abs(remainingAmount))}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Submit button with clear status message */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={
                  isSubmitting ||
                  formSubmitting ||
                  (!isZeroTotal && !isBalanced)
                }
              >
                {isSubmitting || formSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  t("common.confirm")
                )}
              </Button>

              {!isBalanced && !isZeroTotal && (
                <p className="text-sm text-center mt-2 text-red-500">
                  {remainingAmount > 0
                    ? t(
                        "paymentMethods.totalTooLow",
                        "Total is less than required amount"
                      )
                    : t(
                        "paymentMethods.totalTooHigh",
                        "Total exceeds required amount"
                      )}
                </p>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
