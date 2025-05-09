import {
  FormCurrencyInput,
  FormSelect,
  CustomFormField
} from "@/components/ui/composed/form-fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/types";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchEmployees } from "@/services/employees";
import { useEffect } from "react";
import { toast } from "sonner";

interface PriceAndEmployeeInputsProps {
  control: Control<any>;
  employees?: Employee[];
}

export function PriceAndEmployeeInputs({
  control,
  employees: propEmployees,
}: PriceAndEmployeeInputsProps) {
  const { t } = useTranslation();

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
