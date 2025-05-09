import {
  FormCurrencyInput,
  FormSelect,
  CustomFormField
} from "@/components/ui/composed/form-fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShift } from "@/hooks/useShift";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface PriceAndEmployeeInputsProps {
  control: Control<any>;
  employees?: Employee[];
}

export function PriceAndEmployeeInputs({
  control,
  employees: propEmployees,
}: PriceAndEmployeeInputsProps) {
  const { t } = useTranslation();
  const { activeShift } = useShift();

  // Fetch employees if not provided as props
  const { data: fetchedEmployees, isLoading, isError } = useQuery({
    queryKey: ["employees"],
    queryFn: () => fetchEmployees({ status: "active" }),
    enabled: !propEmployees, // Only fetch if employees are not provided as props
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  // Use employees from props if provided, otherwise use fetched employees
  const employees = propEmployees || fetchedEmployees || [];

  // Show notification for offline mode
  useEffect(() => {
    if (!navigator.onLine && Array.isArray(employees) && employees.length > 0 && !propEmployees) {
      toast.warning(t("common.warning"), {
        description: "Using offline mode with sample employee data",
        duration: 5000,
      });
    }
  }, [employees, propEmployees, t]);

  // Create employee options for the select dropdown
  const employeeOptions = Array.isArray(employees) 
    ? employees.map(employee => ({
        value: employee.id,
        label: employee.name
      }))
    : [];

  return (
    <div className="space-y-4">
      <FormCurrencyInput
        name="unit_price"
        label={t("sales.unitPrice")}
        form={{ control } as any}
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
            {t("sales.noActiveShift", "No active shift found. Please start a shift first.")}
          </AlertDescription>
        </Alert>
      )}
      
      <FormSelect
        name="employee_id"
        label={t("sales.employee")}
        form={{ control } as any}
        options={employeeOptions}
        placeholder={t("common.selectAnOption")}
      />
    </div>
  );
}
