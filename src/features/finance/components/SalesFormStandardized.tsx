import { Button } from "@/core/components/ui/primitives/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { useToast } from "@/hooks";
import { useEffect, useState } from "react";
import { Sale } from "@/types";
import { Employee } from "@/core/api";
import {
  FormCurrencyInput,
  FormSelect,
} from "@/core/components/ui/composed/form-fields";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import { FillingSystemSelect } from "./form/FillingSystemSelect";
import { useTranslation } from "react-i18next";
import { StandardForm } from "@/core/components/ui/composed/base-form";
import { Control, useWatch } from 'react-hook-form';

// Export the base schema to derive the type
const baseSalesFormSchema = z.object({
  quantity: z.number().min(0.01),
  unit_price: z.number().min(1),
  total_sales: z.number().optional(),
  shift_id: z.string(),
  filling_system_id: z.string(),
  meter_start: z.number().nonnegative(),
  meter_end: z.number().nonnegative(),
  date: z.string().optional(),
  comments: z.string().optional(),
}).refine((data) => data.meter_end >= data.meter_start, {
  path: ["meter_end"],
});

// Export the type for use in other components
export type SalesFormData = z.infer<typeof baseSalesFormSchema>;

// Define a proper interface for the Sales form that includes all needed fields
interface SaleFormModel {
  id?: string;
  quantity: number;
  price_per_unit: number;
  total_sales: number;
  shift_id: string;
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  date?: string;
  comments?: string;
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
  const salesFormSchema = z
    .object({
      quantity: z
        .number({
          required_error: t("sales.quantityRequired", "Quantity is required."),
        })
        .min(
          0.01,
          t("sales.quantityPositive", "Quantity must be greater than 0")
        ),
      unit_price: z
        .number({
          required_error: t("sales.priceRequired", "Unit price is required."),
        })
        .min(1, t("sales.priceMinimum", "Price must be at least 1")),
      total_sales: z.number().optional(),
      shift_id: z.string({
        required_error: t("sales.shiftRequired", "Shift is required"),
      }),
      filling_system_id: z.string({
        required_error: t(
          "sales.fillingSystemRequired",
          "Please select a filling system."
        ),
      }),
      meter_start: z
        .number({
          required_error: t(
            "sales.meterStartRequired",
            "Starting meter reading is required."
          ),
        })
        .nonnegative(
          t(
            "sales.meterStartPositive",
            "Starting meter reading must be a positive number"
          )
        ),
      meter_end: z
        .number({
          required_error: t(
            "sales.meterEndRequired",
            "Ending meter reading is required."
          ),
        })
        .nonnegative(
          t(
            "sales.meterEndPositive",
            "Ending meter reading must be a positive number"
          )
        ),
      date: z.string().optional(),
      comments: z.string().optional(),
    })
    .refine((data) => data.meter_end >= data.meter_start, {
      message: t(
        "sales.meterEndGreater",
        "Ending meter reading must be greater than or equal to starting meter reading"
      ),
      path: ["meter_end"],
    });

  // Create and export the type for use in other components
  type SalesFormData = z.infer<typeof salesFormSchema>;

  // Prepare default values
  const defaultValues: Partial<SalesFormData> = {
    quantity: sale?.quantity || 0,
    unit_price: sale?.price_per_unit || 0,
    total_sales: sale?.total_sales || 0,
    shift_id: sale?.shift_id || "",
    filling_system_id: sale?.filling_system_id || "",
    meter_start: sale?.meter_start || 0,
    meter_end: sale?.meter_end || 0,
    date: sale?.date || new Date().toISOString(),
    comments: sale?.comments || "",
  };

  // Handler for form submission
  const handleSubmit = async (data: SalesFormData) => {
    // Calculate total sales
    const submissionData = {
      ...data,
      total_sales: data.quantity * data.unit_price,
      id: sale?.id,
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
      defaultValues={defaultValues as SalesFormData}
      onSubmit={handleSubmit}
      submitText={
        sale ? t("common.update", "Update") : t("common.create", "Create")
      }
      className="space-y-4"
    >
      {(methods) => (
        <SalesFormContent 
          control={methods.control as unknown as Control<SalesFormData>} 
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
  control: Control<SalesFormData>;
  employees?: Employee[];
  totalSales: number;
  setTotalSales: (value: number) => void;
}

function SalesFormContent({ control, employees, totalSales, setTotalSales }: SalesFormContentProps) {
  const { t } = useTranslation();

  // Watch for changes to calculate derived values
  const unitPrice = useWatch({ control, name: "unit_price" });
  const meterStart = useWatch({ control, name: "meter_start" });
  const meterEnd = useWatch({ control, name: "meter_end" });

  // Calculate quantity and total sales when meter values or unit price changes
  useEffect(() => {
    // Calculate quantity from meter readings
    const calculatedQuantity = Math.max(0, meterEnd - meterStart);

    // Calculate total sales
    const calculatedTotal = calculatedQuantity * unitPrice;
    setTotalSales(calculatedTotal || 0);
  }, [meterStart, meterEnd, unitPrice, setTotalSales]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("sales.quantity", "Quantity")} (
                {t("common.calculated", "Calculated")})
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0"
                  {...field}
                  value={field.value}
                  disabled
                  className="bg-muted"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <PriceAndEmployeeInputs
          control={control}
          employees={employees as Employee[]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="meter_start"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("sales.meterStart", "Meter Start")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t(
                    "sales.startingMeterReading",
                    "Starting meter reading"
                  )}
                  {...field}
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="meter_end"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("sales.meterEnd", "Meter End")}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t(
                    "sales.endingMeterReading",
                    "Ending meter reading"
                  )}
                  {...field}
                  value={field.value || 0}
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Display calculated total sales */}
      <div className="bg-muted/30 p-3 rounded-md text-sm">
        <div className="font-medium">
          {t("sales.totalSales", "Total Sales")}: {totalSales.toFixed(2)} ֏
        </div>
        <div className="text-muted-foreground text-xs">
          {t("sales.calculatedAs", "Calculated as")}{" "}
          {t("sales.quantity", "Quantity")} (
          {(meterEnd - meterStart).toFixed(2)}) × {t("sales.unitPrice", "Unit Price")} ({unitPrice.toFixed(2)})
        </div>
      </div>

      <FillingSystemSelect control={control} />

      <FormField
        control={control}
        name="comments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("common.comments", "Comments")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t("common.comments", "Comments")}
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
