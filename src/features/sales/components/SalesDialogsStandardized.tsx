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
import { UpdateSaleRequest, SalesFormData } from '../types';
import { Control } from "react-hook-form";
import { FuelTypeCode, PaymentMethod, PaymentStatus } from "@/core/types";

// Extend the Sale type to include the properties needed by SalesFormStandardized
interface ExtendedSale extends Sale {
  amount: number;
  quantityLiters: number;
  unitPrice: number;
  saleDate: Date;
  fuelType: FuelTypeCode;
  customerName?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
  employeeId?: string;
  fillingSystemId?: string;
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

  // Define the form schema using zod that matches SalesFormData structure
  const salesFormSchema = z
    .object({
      amount: z
        .number({
          required_error: t("sales.amountRequired", "Amount is required."),
        })
        .min(
          0.01,
          t("sales.amountPositive", "Amount must be greater than 0")
        ),
      quantityLiters: z
        .number({
          required_error: t("sales.quantityRequired", "Quantity is required."),
        })
        .min(
          0.01,
          t("sales.quantityPositive", "Quantity must be greater than 0")
        ),
      unitPrice: z
        .number({
          required_error: t("sales.priceRequired", "Unit price is required."),
        })
        .min(1, t("sales.priceMinimum", "Price must be at least 1")),
      saleDate: z.union([z.date(), z.string().transform(val => new Date(val))], {
        required_error: t("sales.dateRequired", "Sale date is required"),
      }),
      fuelType: z.enum(["diesel", "gas", "petrol_regular", "petrol_premium"], {
        required_error: t("sales.fuelTypeRequired", "Fuel type is required"),
      }),
      customerName: z.string().optional(),
      paymentMethod: z.enum(["cash", "credit_card", "debit_card", "mobile_payment", "card", "bank_transfer", "other"]),
      paymentStatus: z.enum(["pending", "completed", "cancelled", "paid", "failed", "refunded"]).optional(),
      notes: z.string().optional(),
      employeeId: z.string().optional(),
      fillingSystemId: z.string().optional(),
      vehiclePlate: z.string().optional(),
      meterStart: z.number().optional(),
      meterEnd: z.number().optional(),
      shiftId: z.string().optional(),
    });

  // Use the schema type for internal consistency
  type FormSchemaType = z.infer<typeof salesFormSchema>;

  // Convert selectedSale to proper date format
  const convertSaleDate = (sale: Sale | null): Date => {
    if (!sale) return new Date();
    const saleDate = (sale as ExtendedSale).saleDate;
    if (saleDate instanceof Date) return saleDate;
    if (typeof saleDate === 'string') return new Date(saleDate);
    return new Date();
  };

  // Prepare default values with proper typing
  const defaultValues: Partial<FormSchemaType> = {
    amount: (selectedSale as ExtendedSale)?.amount || 0,
    quantityLiters: (selectedSale as ExtendedSale)?.quantityLiters || 0,
    unitPrice: (selectedSale as ExtendedSale)?.unitPrice || 0,
    saleDate: convertSaleDate(selectedSale),
    fuelType: (selectedSale as ExtendedSale)?.fuelType || "petrol_regular",
    customerName: (selectedSale as ExtendedSale)?.customerName || "",
    paymentMethod: (selectedSale as ExtendedSale)?.paymentMethod || "cash",
    paymentStatus: (selectedSale as ExtendedSale)?.paymentStatus || "completed",
    notes: (selectedSale as ExtendedSale)?.notes || "",
    employeeId: (selectedSale as ExtendedSale)?.employeeId || "",
    fillingSystemId: (selectedSale as ExtendedSale)?.fillingSystemId || "",
  };

  // Handler for form submission
  const handleSubmit = async (data: FormSchemaType): Promise<boolean> => {
    try {
      // Convert schema data to SalesFormData format
      const submissionData: SalesFormData = {
        amount: data.quantityLiters * data.unitPrice,
        quantityLiters: data.quantityLiters,
        unitPrice: data.unitPrice,
        saleDate: data.saleDate,
        fuelType: data.fuelType as FuelTypeCode,
        customerName: data.customerName,
        paymentMethod: data.paymentMethod as PaymentMethod,
        paymentStatus: data.paymentStatus as PaymentStatus,
        notes: data.notes,
        employeeId: data.employeeId,
        fillingSystemId: data.fillingSystemId,
        vehiclePlate: data.vehiclePlate,
        meterStart: data.meterStart,
        meterEnd: data.meterEnd,
        shiftId: data.shiftId,
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
            control={control as Control<SalesFormData>} 
            employees={employees} 
            totalSales={totalSales}
            setTotalSales={setTotalSales}
          />
        )}
      </FormDialog>

      <DeleteConfirmDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        itemName="this sale"
        onConfirm={confirmDelete}
        isSubmitting={isLoading}
      />
    </>
  );
}

// Separate component to handle the form content with hooks
interface SalesFormContentProps {
  control: Control<SalesFormData>;
  employees?: Employee[];
  totalSales: number;
  setTotalSales: (value: number) => void;
}

function SalesFormContent({ control, employees, totalSales, setTotalSales }: SalesFormContentProps) {
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
          name="quantityLiters"
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
          form={{ control } as any}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="unitPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("sales.price", "Unit Price")}
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t(
                    "sales.unitPricePlaceholder",
                    "Unit price"
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
        name="notes"
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
