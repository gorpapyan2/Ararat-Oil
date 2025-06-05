import { DeleteConfirmDialog } from "@/core/components/ui/dialog";
import { Sale } from "@/types";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { useEffect, useState } from "react";
import { PriceAndEmployeeInputs } from "./form/PriceAndEmployeeInputs";
import { FillingSystemSelect } from "./form/FillingSystemSelect";
import { FormDialog } from "@/shared/components/common/dialog/FormDialog";
import { toast } from "sonner";
import { Employee } from "@/core/api";
import { useWatch } from "react-hook-form";
import { UpdateSaleRequest } from '../types';
import { Control } from "react-hook-form";

// Extend the Sale type to include the properties needed by SalesFormStandardized
interface ExtendedSale extends Sale {
  quantity: number;
  total_sales: number;
  shift_id: string;
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  date: string;
  unit_price?: number;
  comments?: string;
}

interface SalesDialogsProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (open: boolean) => void;
  selectedSale: Sale | null;
  updateSale: (data: UpdateSaleRequest) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  confirmDelete: () => void;
  isLoading?: boolean;
  employees?: Employee[];
}

export function SalesDialogsStandardized({
  isEditDialogOpen,
  setIsEditDialogOpen,
  selectedSale,
  updateSale,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  confirmDelete,
  isLoading = false,
  employees,
}: SalesDialogsProps) {
  const { t } = useTranslation();
  const [totalSales, setTotalSales] = useState<number>(0);

  // Define the form schema using zod
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
    quantity: (selectedSale as ExtendedSale)?.quantity || 0,
    unit_price: (selectedSale as ExtendedSale)?.unit_price || 0,
    total_sales: (selectedSale as ExtendedSale)?.total_sales || 0,
    shift_id: (selectedSale as ExtendedSale)?.shift_id || "",
    filling_system_id: (selectedSale as ExtendedSale)?.filling_system_id || "",
    meter_start: (selectedSale as ExtendedSale)?.meter_start || 0,
    meter_end: (selectedSale as ExtendedSale)?.meter_end || 0,
    date: (selectedSale as ExtendedSale)?.date || new Date().toISOString(),
    comments: (selectedSale as ExtendedSale)?.comments || "",
  };

  // Handler for form submission
  const handleSubmit = async (data: SalesFormData) => {
    try {
      // Calculate total sales
      const submissionData = {
        ...data,
        total_sales: data.quantity * data.unit_price,
      };

      if (selectedSale?.id) {
        // Update existing sale
        updateSale({
          id: selectedSale.id,
          ...submissionData,
        });

        toast.success(t("sales.updated", "Sale updated."));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error(t("sales.updateError", "Failed to update sale"));
      return false;
    }
  };

  return (
    <>
      <FormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        title={
          selectedSale
            ? t("sales.editSale", "Edit Sale")
            : t("sales.addSale", "Add Sale")
        }
        schema={salesFormSchema}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isLoading}
        size="lg"
      >
        {({ control }) => (
          <SalesFormContent 
            control={control} 
            employees={employees} 
            totalSales={totalSales}
            setTotalSales={setTotalSales}
          />
        )}
      </FormDialog>

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Sale Record"
        description="This will delete the sale record and restore the fuel to the tank. This action cannot be undone."
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  );
}

// Separate component to handle the form content with hooks
interface SalesFormContentProps {
  control: Control<{
    quantity: number;
    unit_price: number;
    total_sales?: number;
    shift_id: string;
    filling_system_id: string;
    meter_start: number;
    meter_end: number;
    date?: string;
    comments?: string;
  }>;
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
          employees={employees}
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
          {t("sales.totalSales", "Total Sales")}:{" "}
          {totalSales.toFixed(2)} ֏
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
}
