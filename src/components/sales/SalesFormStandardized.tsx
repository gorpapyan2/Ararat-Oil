import { useEffect, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { fetchFillingSystems } from "@/services/filling-systems";
import { fetchLatestSale } from "@/services/sales";
import { Sale, FuelType } from "@/types";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";
import { FormProvider } from "react-hook-form";

// UI Components
import { DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Form Components
import {
  FormInput,
  FormSelect,
  FormCurrencyInput,
  FormTextarea
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define custom styles for the filling system dropdown
const fillingSystemSelectStyles = {
  trigger: "bg-slate-800 text-white font-semibold border-slate-600 shadow-sm",
  content: "bg-slate-800 border border-slate-600 shadow-lg"
};

// Add custom styles for the dropdown items
const selectItemStyle = "text-white hover:bg-slate-700 hover:text-white data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground";

// Define fuel type color indicators for the filling system options
const fuelTypeColors: Record<FuelType, string> = {
  petrol: "text-red-400",
  diesel: "text-green-400",
  gas: "text-blue-400",
  kerosene: "text-amber-400",
  cng: "text-purple-400"
};

// Define validation schema with Zod
const saleSchema = z.object({
  filling_system_id: z.string({ 
    required_error: "Filling system is required" 
  }),
  meter_start: z.coerce
    .number({ required_error: "Meter start is required" })
    .nonnegative("Meter start must be a positive number or zero"),
  meter_end: z.coerce
    .number({ required_error: "Meter end is required" })
    .nonnegative("Meter end must be a positive number or zero"),
  unit_price: z.coerce
    .number({ required_error: "Unit price is required" })
    .positive("Unit price must be greater than zero"),
  employee_id: z.string({ 
    required_error: "Employee is required" 
  }),
  comments: z.string().optional(),
}).refine(data => data.meter_end >= data.meter_start, {
  message: "Meter end must be greater than or equal to meter start",
  path: ["meter_end"],
});

// Type based on schema
type SaleFormValues = z.infer<typeof saleSchema>;

interface SalesFormStandardizedProps {
  onSubmit: (data: SaleFormValues) => void;
  sale?: Sale | null;
  actionButton?: React.ReactNode;
  showDialogFooter?: boolean;
}

export function SalesFormStandardized({ 
  onSubmit, 
  sale, 
  actionButton,
  showDialogFooter = true
}: SalesFormStandardizedProps) {
  const { t } = useTranslation();
  const [selectedFillingSystem, setSelectedFillingSystem] = useState<string>(
    sale?.filling_system_id || ""
  );
  const { activeShift } = useShift();

  // Initialize form with Zod validation
  const form = useZodForm({
    schema: saleSchema,
    defaultValues: sale?.id
      ? {
          filling_system_id: sale.filling_system_id,
          meter_start: sale.meter_start,
          meter_end: sale.meter_end,
          unit_price: sale.price_per_unit,
          employee_id: sale.employee_id,
          comments: sale.comments || "",
        }
      : {
          filling_system_id: "",
          meter_start: 0,
          meter_end: 0,
          unit_price: 0,
          employee_id: "",
          comments: "",
        },
  });

  // Fetch data
  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: fillingSystems, isLoading: systemsLoading } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: fetchFillingSystems,
  });

  const { data: latestSale, isSuccess: latestSaleLoaded } = useQuery({
    queryKey: ["latest-sale", selectedFillingSystem],
    queryFn: () =>
      selectedFillingSystem ? fetchLatestSale(selectedFillingSystem) : null,
    enabled: !!selectedFillingSystem && !sale?.id, // Only fetch latest sale if no sale id is provided
  });

  // Calculate total amount
  const meterStart = form.watch("meter_start") || 0;
  const meterEnd = form.watch("meter_end") || 0;
  const unitPrice = form.watch("unit_price") || 0;
  
  const quantity = Math.max(0, meterEnd - meterStart);
  const totalAmount = quantity * unitPrice;

  // Update form values when filling system changes or latest sale is loaded
  useEffect(() => {
    if (latestSale && !sale?.id && latestSaleLoaded && selectedFillingSystem) {
      form.setValue("meter_start", latestSale.meter_end);
      form.setValue("unit_price", latestSale.price_per_unit);
    }
  }, [latestSale, form, sale, latestSaleLoaded, selectedFillingSystem]);

  // Set initial values if sale prop is provided
  useEffect(() => {
    if (sale?.id) {
      form.reset({
        filling_system_id: sale.filling_system_id,
        meter_start: sale.meter_start,
        meter_end: sale.meter_end,
        unit_price: sale.price_per_unit,
        employee_id: sale.employee_id,
        comments: sale.comments || "",
      });

      setSelectedFillingSystem(sale.filling_system_id);
    }
  }, [sale, form]);

  // Create select options for filling systems with color-coded fuel types
  const fillingSystemOptions = fillingSystems?.map(system => {
    const fuelType = system.tank?.fuel_type;
    const fuelTypeColor = fuelType ? fuelTypeColors[fuelType] : '';
    
    return {
      value: system.id,
      label: `${system.name}${system.tank?.fuel_type ? ` (${system.tank.fuel_type})` : ""}`,
      colorClass: fuelTypeColor
    };
  }) || [];

  // Create select options for employees
  const employeeOptions = employees?.map(employee => ({
    value: employee.id,
    label: employee.name
  })) || [];

  // Form submission handler
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler<SaleFormValues>(
    form,
    async (data) => {
      await onSubmit(data);
      if (!sale?.id) form.reset(); // Only reset if creating a new sale
      return true;
    }
  );

  const handleFillingSystemChange = (value: string) => {
    setSelectedFillingSystem(value);
  };

  const isSaleWithId = !!sale?.id;
  
  // Show loading state if data is being fetched
  const isLoading = employeesLoading || systemsLoading;

  // Custom render function for filling system options
  const renderFillingSystemOption = (option: { value: string; label: string; colorClass?: string }) => (
    <div>
      {option.colorClass ? (
        <span className={option.colorClass}>{option.label}</span>
      ) : (
        option.label
      )}
    </div>
  );

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <DialogDescription>
          {t("sales.formDescription", "Fill in the details to record a new fuel sale.")}
        </DialogDescription>
        
        {!activeShift && !isSaleWithId && (
          <Alert variant="destructive" className="mt-2 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("common.error")}</AlertTitle>
            <AlertDescription>{t("shifts.noActiveShift")}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="py-4 text-center">Loading form data...</div>
        ) : (
          <div className="space-y-5">
            <FormSelect
              name="filling_system_id"
              label={t("sales.fillingSystem")}
              form={form}
              options={fillingSystemOptions}
              placeholder={t("common.selectAnOption")}
              onChange={handleFillingSystemChange}
              selectClassName={fillingSystemSelectStyles.trigger}
              contentClassName={fillingSystemSelectStyles.content}
              itemClassName={selectItemStyle}
              renderOption={renderFillingSystemOption}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                name="meter_start"
                label={t("sales.meterStart")}
                form={form}
                type="number"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoComplete="off"
              />

              <FormInput
                name="meter_end"
                label={t("sales.meterEnd")}
                form={form}
                type="number"
                inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                autoComplete="off"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FormCurrencyInput
                  name="unit_price"
                  label={t("sales.unitPrice")}
                  form={form}
                  placeholder="0"
                  symbol="֏"
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium mb-2">{t("sales.quantity")}</label>
                <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                  {quantity.toFixed(2)} L
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">{t("sales.totalAmount")}</label>
              <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted flex items-center">
                {totalAmount.toFixed(2)} ֏
              </div>
            </div>

            <FormSelect
              name="employee_id"
              label={t("sales.employee")}
              form={form}
              options={employeeOptions}
              placeholder={t("common.selectAnOption")}
            />
            
            <FormTextarea 
              name="comments"
              label={t("sales.comments")}
              form={form}
              placeholder={t("sales.optionalComments")}
            />
          </div>
        )}

        {showDialogFooter && (
          <DialogFooter>
            {actionButton || (
              <Button 
                type="submit" 
                disabled={isSubmitting || isLoading}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? t("common.saving") : isSaleWithId ? t("sales.updateSale") : t("sales.createSale")}
              </Button>
            )}
          </DialogFooter>
        )}
      </form>
    </FormProvider>
  );
} 