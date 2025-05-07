import {
  FormCurrencyInput,
  FormSelect
} from "@/components/ui/composed/form-fields";
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
    onError: (error) => {
      console.error("Error fetching employees:", error);
      toast.error(t("common.error"), {
        description: t("common.errorMessage", { message: String(error) }),
      });
    }
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
        loading={isLoading}
        disabled={isLoading || employeeOptions.length === 0}
      />
    </div>
  );
}
