import React from "react";
import { useController, Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CurrencyInput } from "@/components/ui/currency-input";

interface CurrencyFieldProps {
  name: string;
  control: Control<any>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  symbol?: string;
  className?: string;
  min?: number;
  max?: number;
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  name,
  control,
  label,
  placeholder,
  required = false,
  disabled = false,
  symbol = "֏",
  className,
  min,
  max,
}) => {
  const rules = {
    required: required ? "This field is required" : false,
    ...(min !== undefined && {
      min: {
        value: min,
        message: `Value should be at least ${min}`,
      },
    }),
    ...(max !== undefined && {
      max: {
        value: max,
        message: `Value should not exceed ${max}`,
      },
    }),
  };

  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <FormItem className={className}>
          {label && (
            <FormLabel className="text-base font-medium">{label}</FormLabel>
          )}
          <FormControl>
            <CurrencyInput
              value={field.value}
              onChange={field.onChange}
              disabled={disabled}
              placeholder={placeholder}
              symbol={symbol}
              onBlur={field.onBlur}
              name={field.name}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
