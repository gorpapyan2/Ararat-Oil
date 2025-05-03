import { useEffect, useState } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { fetchFillingSystems } from "@/services/filling-systems";
import { fetchLatestSale } from "@/services/sales";
import { Sale } from "@/types";
import { useShift } from "@/hooks/useShift";
import { useTranslation } from "react-i18next";

// UI Components
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Form Components
import {
  FormInput,
  FormSelect,
  FormCurrencyInput
} from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

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
}).refine(data => data.meter_end >= data.meter_start, {
  message: "Meter end must be greater than or equal to meter start",
  path: ["meter_end"],
});

// Type based on schema
type SaleFormValues = z.infer<typeof saleSchema>;

interface SalesFormStandardizedProps {
  onSubmit: (data: SaleFormValues) => void;
  sale?: Sale | null;
}

export function SalesFormStandardized({ onSubmit, sale }: SalesFormStandardizedProps) {
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
        }
      : {
          filling_system_id: "",
          meter_start: 0,
          meter_end: 0,
          unit_price: 0,
          employee_id: "",
        },
  });

  // Fetch data
  const { data: employees } = useQuery({
    queryKey: ["employees"],
    queryFn: fetchEmployees,
  });

  const { data: fillingSystems } = useQuery({
    queryKey: ["filling-systems"],
    queryFn: fetchFillingSystems,
  });

  const { data: latestSale, isSuccess: latestSaleLoaded } = useQuery({
    queryKey: ["latest-sale", selectedFillingSystem],
    queryFn: () =>
      selectedFillingSystem ? fetchLatestSale(selectedFillingSystem) : null,
    enabled: !!selectedFillingSystem && !sale?.id, // Only fetch latest sale if no sale id is provided
  });

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
      });

      setSelectedFillingSystem(sale.filling_system_id);
    }
  }, [sale, form]);

  // Create select options for filling systems
  const fillingSystemOptions = fillingSystems?.map(system => ({
    value: system.id,
    label: `${system.name}${system.tank?.fuel_type ? ` (${system.tank.fuel_type})` : ""}`
  })) || [];

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!activeShift && !isSaleWithId && (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t("common.error")}</AlertTitle>
          <AlertDescription>{t("shifts.noActiveShift")}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <FormSelect
          name="filling_system_id"
          label="Filling System"
          form={form}
          options={fillingSystemOptions}
          placeholder="Select a filling system"
          onChange={handleFillingSystemChange}
        />

        <FormInput
          name="meter_start"
          label="Meter Start"
          form={form}
          type="number"
          inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          autoComplete="off"
        />

        <FormInput
          name="meter_end"
          label="Meter End"
          form={form}
          type="number"
          inputClassName="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          autoComplete="off"
        />

        <FormCurrencyInput
          name="unit_price"
          label={t("sales.unitPrice")}
          form={form}
          placeholder="0"
          symbol="֏"
        />

        <FormSelect
          name="employee_id"
          label={t("sales.employee")}
          form={form}
          options={employeeOptions}
          placeholder={t("common.selectAnOption")}
        />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isSaleWithId ? "Update Sale" : "Create Sale"}
        </Button>
      </DialogFooter>
    </form>
  );
} 