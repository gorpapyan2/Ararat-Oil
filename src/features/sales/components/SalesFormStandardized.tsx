import React, { useEffect, useState } from "react";
import { Button } from "@/core/components/ui/primitives/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { Textarea } from "@/core/components/ui/primitives/textarea";
import { z } from "zod";
import { useToast } from "@/hooks";
import { Sale } from "@/types";
import { Employee } from "@/core/api/types";
import {
  FormCurrencyInput,
  FormSelect,
} from "@/core/components/ui/composed/form-fields";
import { PriceAndEmployeeInputs } from "@/shared/components/form/PriceAndEmployeeInputs";
import { FillingSystemSelect } from "./form/FillingSystemSelect";
import { useTranslation } from "react-i18next";
import { StandardForm } from "@/core/components/ui/composed/base-form";
import { toast as sonnerToast } from "sonner";
import { Control, FieldValues, useWatch, UseFormReturn } from "react-hook-form";
import { SalesFormData, FuelTypeCode, PaymentMethod, PaymentStatus } from "@/features/sales/types";

// Base schema - aligned with SalesFormData interface
export const baseSalesFormSchema = z.object({
  amount: z
    .number()
    .min(0.01, "Amount must be greater than 0"),
  quantityLiters: z
    .number()
    .min(0.01, "Quantity must be greater than 0"),
  unitPrice: z
    .number()
    .min(0.01, "Unit price must be greater than 0"),
  saleDate: z.date(),
  fuelType: z.enum(["diesel", "gas", "petrol_regular", "petrol_premium"] as const),
  customerName: z.string().optional(),
  paymentMethod: z.enum(["cash", "credit_card", "debit_card", "mobile_payment", "card", "bank_transfer", "other"] as const),
  paymentStatus: z.enum(["pending", "completed", "cancelled", "paid", "failed", "refunded"] as const),
  notes: z.string().optional(),
  employeeId: z.string().optional(),
  fillingSystemId: z.string().min(1, "Filling system is required"),
});

// Define a proper interface for the Sales form that includes all needed fields
interface SaleFormModel {
  id?: string;
  fuelType?: FuelTypeCode;
  quantityLiters: number;
  unitPrice: number;
  amount: number;
  saleDate: Date;
  fillingSystemId: string;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  employeeId?: string;
}

interface SalesFormStandardizedProps {
  sale?: SaleFormModel;
  onSubmit: (data: SalesFormData) => Promise<boolean>;
  employees?: Employee[];
}

export function SalesFormStandardized({
  sale,
  onSubmit,
  employees,
}: SalesFormStandardizedProps) {
  const { t } = useTranslation();
  const [totalSales, setTotalSales] = useState<number>(0);
  
  // Create schema inside the component where hooks can be called
  const salesFormSchema = baseSalesFormSchema;

  // Use the refined schema type
  type FormDataType = z.infer<typeof salesFormSchema>;

  // Prepare default values
  const defaultValues: Partial<FormDataType> = {
    quantityLiters: sale?.quantityLiters || 0,
    unitPrice: sale?.unitPrice || 0,
    amount: sale?.amount || 0,
    saleDate: sale?.saleDate || new Date(),
    fillingSystemId: sale?.fillingSystemId || "",
    fuelType: sale?.fuelType || "petrol_regular",
    customerName: sale?.customerName || "",
    paymentMethod: sale?.paymentMethod || "cash",
    paymentStatus: sale?.paymentStatus || "pending",
    notes: sale?.notes || "",
    employeeId: sale?.employeeId || "",
  };

  // Handler for form submission
  const handleSubmit = async (data: FormDataType) => {
    // Calculate total sales
    const submissionData: SalesFormData = {
      ...data,
      amount: data.quantityLiters * data.unitPrice,
    };

    const success = await onSubmit(submissionData);

    if (success) {
      sonnerToast.success(
        sale
          ? t("sales.updated", "Sale updated.")
          : t("sales.created", "Sale created.")
      );
    }

    return success;
  };

  return (
    <StandardForm
      schema={salesFormSchema}
      defaultValues={defaultValues as FormDataType}
      onSubmit={handleSubmit}
      submitText={
        sale ? t("common.update", "Update") : t("common.create", "Create")
      }
      className="space-y-4"
    >
      {(methods) => (
        <SalesFormContent 
          control={methods.control}
          form={methods}
          employees={employees} 
          totalSales={totalSales}
          setTotalSales={setTotalSales}
        />
      )}
    </StandardForm>
  );
}

// Separate component to handle form content with hooks
interface SalesFormContentProps {
  control: Control<any>;
  form: UseFormReturn<any>;
  employees?: Employee[];
  totalSales: number;
  setTotalSales: (value: number) => void;
}

function SalesFormContent({ control, form, employees, totalSales, setTotalSales }: SalesFormContentProps) {
  const { t } = useTranslation();

  // Watch for changes to calculate derived values
  const unitPrice = useWatch({ control, name: "unitPrice" });
  const quantityLiters = useWatch({ control, name: "quantityLiters" });

  // Calculate total sales when quantity or unit price changes
  useEffect(() => {
    // Calculate total sales
    const calculatedTotal = quantityLiters * unitPrice;
    setTotalSales(calculatedTotal || 0);
  }, [quantityLiters, unitPrice, setTotalSales]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="saleDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.date", "Sale Date")}</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.fuelType", "Fuel Type")}</FormLabel>
              <FormControl>
                <FormSelect
                  form={form}
                  placeholder={t("sales.selectFuelType", "Select fuel type")}
                  options={[
                    { value: "diesel", label: "Diesel" },
                    { value: "gas", label: "Gas" },
                    { value: "petrol_regular", label: "Petrol Regular" },
                    { value: "petrol_premium", label: "Petrol Premium" },
                  ]}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FillingSystemSelect control={control} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="quantityLiters"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.quantity", "Quantity (Liters)")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.unitPrice", "Unit Price")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("sales.amount", "Total Amount")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.01"
                {...field}
                value={totalSales}
                readOnly
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.customerName", "Customer Name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.paymentMethod", "Payment Method")}</FormLabel>
              <FormControl>
                <FormSelect
                  form={form}
                  placeholder={t("sales.selectPaymentMethod", "Select payment method")}
                  options={[
                    { value: "cash", label: "Cash" },
                    { value: "credit_card", label: "Credit Card" },
                    { value: "debit_card", label: "Debit Card" },
                    { value: "mobile_payment", label: "Mobile Payment" },
                    { value: "card", label: "Card" },
                    { value: "bank_transfer", label: "Bank Transfer" },
                    { value: "other", label: "Other" },
                  ]}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("sales.notes", "Notes")}</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
