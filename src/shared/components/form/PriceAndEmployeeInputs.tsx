/**
 * Centralized Price and Employee Inputs Component
 * 
 * This is a reusable form component for price and employee selection inputs.
 * It replaces the duplicate implementations in sales and finance features.
 */

import {
  SimpleFormCurrencyInput,
  SimpleFormSelect,
} from "@/core/components/ui/composed/form-fields";
import type { Employee } from "@/core/api";
import { Control, FieldValues, UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/core/api";
import { toast } from "sonner";
import { useShift } from "@/features/shifts";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Info } from "lucide-react";

// Generic form data interface - can be extended by specific implementations
interface BaseFormData {
  unit_price: number;
  shift_id: string;
  [key: string]: any; // Allow additional fields
}

interface PriceAndEmployeeInputsProps<T extends BaseFormData = BaseFormData> {
  control: Control<T>;
  form: UseFormReturn<T>;
  employees?: Employee[];
  currencySymbol?: string;
  unitPriceLabel?: string;
  shiftLabel?: string;
  showShiftAlert?: boolean;
  className?: string;
}

export function PriceAndEmployeeInputs<T extends BaseFormData = BaseFormData>({
  control,
  form,
  employees: propEmployees,
  currencySymbol = "֏",
  unitPriceLabel,
  shiftLabel,
  showShiftAlert = true,
  className = "space-y-4",
}: PriceAndEmployeeInputsProps<T>) {
  const { t } = useTranslation();
  const { activeShift } = useShift();

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await employeesApi.getEmployees({ status: "active" });
      if (response.error) {
        toast.error("Failed to fetch employees");
        return [];
      }
      return response.data || [];
    },
    enabled: !propEmployees, // Only fetch if not provided via props
  });

  // Use employees from props if provided, otherwise use fetched employees
  const employeeOptions = (propEmployees || employees || []).map((employee) => ({
    value: employee.id,
    label: employee.name,
  }));

  return (
    <div className={className}>
      <SimpleFormCurrencyInput
        name="unit_price"
        label={unitPriceLabel || t("sales.unitPrice", "Unit Price")}
        form={form as UseFormReturn<FieldValues>}
        placeholder="0"
        symbol={currencySymbol}
      />

      {showShiftAlert && (
        <>
          {activeShift && (
            <Alert className="bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t("shifts.activeShiftRunning", "Active shift is running")}
              </AlertDescription>
            </Alert>
          )}

          {!activeShift && (
            <Alert className="bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t(
                  "sales.noActiveShift",
                  "No active shift found. Please start a shift first."
                )}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}

      <SimpleFormSelect
        name="shift_id"
        label={shiftLabel || t("sales.shift", "Shift")}
        form={form as UseFormReturn<FieldValues>}
        options={employeeOptions}
        placeholder={t("common.selectAnOption", "Select an option")}
        isLoading={employeesLoading}
      />
    </div>
  );
} 