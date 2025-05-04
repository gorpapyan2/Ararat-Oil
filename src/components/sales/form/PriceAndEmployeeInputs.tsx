import {
  FormCurrencyInput,
  FormSelect
} from "@/components/ui/composed/form-fields";
import type { Employee } from "@/types";
import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface PriceAndEmployeeInputsProps {
  control: Control<any>;
  employees?: Employee[];
}

export function PriceAndEmployeeInputs({
  control,
  employees,
}: PriceAndEmployeeInputsProps) {
  const { t } = useTranslation();

  const employeeOptions = employees?.map(employee => ({
    value: employee.id,
    label: employee.name
  })) || [];

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
