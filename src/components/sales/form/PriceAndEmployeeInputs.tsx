import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Employee } from "@/types";
import type { Control } from "react-hook-form";
import { CurrencyField } from "@/components/form-fields/CurrencyField";
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

  return (
    <div className="space-y-4">
      <CurrencyField
        control={control}
        name="unit_price"
        label={t("sales.unitPrice")}
        placeholder="0"
        required
        min={0}
      />

      <FormField
        control={control}
        name="employee_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              {t("sales.employee")}
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder={t("common.selectAnOption")} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {employees?.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
