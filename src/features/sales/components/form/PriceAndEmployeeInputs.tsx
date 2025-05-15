import {
  FormCurrencyInput,
  FormSelect,
  CustomFormField
} from "@/components/ui/composed/form-fields";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Employee } from "@/core/api";
import type { Control, UseFormSetValue } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "@/core/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useShift } from "@/hooks/useShift";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { useFormContext, useWatch } from "react-hook-form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

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

  const { data: employees, isLoading: employeesLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await employeesApi.getAll({ status: "active" });
      if (response.error) {
        toast.error("Failed to fetch employees");
        return [];
      }
      return response.data || [];
    },
  });

  // Use employees from props if provided, otherwise use fetched employees
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
        name="shift_id"
        label={t("sales.shift")}
        form={{ control } as any}
        options={employeeOptions}
        placeholder={t("common.selectAnOption")}
      />
    </div>
  );
} 