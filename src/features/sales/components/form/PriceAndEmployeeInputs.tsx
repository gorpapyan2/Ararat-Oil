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
import { useShift } from "@/hooks/useShift";
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { Info } from "lucide-react";

// Define the form data structure for sales
interface SalesFormData {
  quantity: number;
  unit_price: number;
  total_sales?: number;
  shift_id: string;
  filling_system_id: string;
  meter_start: number;
  meter_end: number;
  date?: string;
  comments?: string;
}

interface PriceAndEmployeeInputsProps {
  control: Control<SalesFormData>;
  employees?: Employee[];
}

export function PriceAndEmployeeInputs({
  control,
  employees: propEmployees,
}: PriceAndEmployeeInputsProps) {
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
  });

  // Use employees from props if provided, otherwise use fetched employees
  const employeeOptions = Array.isArray(employees)
    ? employees.map((employee) => ({
        value: employee.id,
        label: employee.name,
      }))
    : [];

  // Create a proper mock form object that matches UseFormReturn interface
  const mockForm: UseFormReturn<FieldValues> = {
    control: control as Control<FieldValues>,
    register: () => ({
      onChange: () => {},
      onBlur: () => {},
      name: "",
      ref: () => {},
    }),
    handleSubmit: () => () => {},
    watch: (name?: string | string[]) => {
      if (typeof name === "string") return undefined;
      if (Array.isArray(name)) return [];
      return {};
    },
    formState: { 
      errors: {},
      isDirty: false,
      isSubmitted: false,
      isSubmitting: false,
      isValid: false,
      isValidating: false,
      submitCount: 0,
      touchedFields: {},
      dirtyFields: {},
    },
    setValue: () => {},
    getValues: () => ({}),
    reset: () => {},
    clearErrors: () => {},
    setError: () => {},
    trigger: () => Promise.resolve(true),
    getFieldState: () => ({ invalid: false, isTouched: false, isDirty: false }),
    resetField: () => {},
    setFocus: () => {},
    unregister: () => {},
    subscribe: () => ({ unsubscribe: () => {} }),
  };

  return (
    <div className="space-y-4">
      <SimpleFormCurrencyInput
        name="unit_price"
        label={t("sales.unitPrice")}
        form={mockForm}
        placeholder="0"
        symbol="֏"
      />

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

      <SimpleFormSelect
        name="shift_id"
        label={t("sales.shift")}
        form={mockForm}
        options={employeeOptions}
        placeholder={t("common.selectAnOption")}
      />
    </div>
  );
}
