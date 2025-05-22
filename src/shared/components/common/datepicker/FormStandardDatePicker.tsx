import * as React from 'react';
import { useController, FieldValues, UseControllerProps } from 'react-hook-form';
import { StandardDatePicker, DateRange, StandardDatePickerProps } from './StandardDatePicker';

/**
 * Base props for FormStandardDatePicker
 */
interface FormStandardDatePickerBaseProps<
  TFieldValues extends FieldValues,
  TName extends keyof TFieldValues
> extends Omit<StandardDatePickerProps, 'value' | 'onChange' | 'error' | 'errorMessage' | 'name'>,
  UseControllerProps<TFieldValues, TName> {
  /**
   * Custom error message to override the one from form validation
   */
  customErrorMessage?: string;
}

/**
 * Props for FormStandardDatePicker in single date mode
 */
export interface FormSingleDatePickerProps<
  TFieldValues extends FieldValues,
  TName extends string
> extends FormStandardDatePickerBaseProps<TFieldValues, TName> {
  mode?: 'single';
}

/**
 * Props for FormStandardDatePicker in date range mode
 */
export interface FormRangeDatePickerProps<
  TFieldValues extends FieldValues,
  TName extends string
> extends FormStandardDatePickerBaseProps<TFieldValues, TName> {
  mode: 'range';
  separator?: string;
  numberOfMonths?: number;
}

/**
 * Union type for FormStandardDatePicker props
 */
export type FormStandardDatePickerProps<
  TFieldValues extends FieldValues,
  TName extends string
> = FormSingleDatePickerProps<TFieldValues, TName> | FormRangeDatePickerProps<TFieldValues, TName>;

/**
 * Form field wrapper for StandardDatePicker to work with react-hook-form
 * 
 * @example Single date mode
 * ```tsx
 * <FormStandardDatePicker
 *   control={control}
 *   name="birthDate"
 *   label="Birth Date"
 *   required
 * />
 * ```
 * 
 * @example Date range mode
 * ```tsx
 * <FormStandardDatePicker
 *   mode="range"
 *   control={control}
 *   name="stayPeriod"
 *   label="Stay Period"
 *   required
 * />
 * ```
 */
export function FormStandardDatePicker<
  TFieldValues extends FieldValues,
  TName extends string
>({
  control,
  name,
  rules,
  defaultValue,
  shouldUnregister,
  customErrorMessage,
  mode = 'single',
  ...rest
}: FormStandardDatePickerProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error }
  } = useController({
    name,
    control,
    rules,
    defaultValue,
    shouldUnregister
  });

  // For single date mode
  const handleSingleDateChange = (date: Date | undefined) => {
    if (mode === 'single') {
      field.onChange(date);
    }
  };
  
  // For date range mode
  const handleRangeChange = (dateRange: DateRange | undefined) => {
    if (mode === 'range') {
      field.onChange(dateRange);
    }
  };

  // Determine which props to pass based on mode
  const datePickerProps = {
    ...rest,
    mode,
    id: field.name,
    name: field.name,
    error: !!error,
    errorMessage: customErrorMessage || error?.message,
    onBlur: field.onBlur,
    ref: field.ref,
  };

  // Render the appropriate date picker based on mode
  if (mode === 'range') {
    return (
      <StandardDatePicker
        {...datePickerProps}
        mode="range"
        value={field.value as DateRange}
        onChange={handleRangeChange}
        separator={(rest as FormRangeDatePickerProps<TFieldValues, TName>).separator}
        numberOfMonths={(rest as FormRangeDatePickerProps<TFieldValues, TName>).numberOfMonths}
      />
    );
  }

  return (
    <StandardDatePicker
      {...datePickerProps}
      value={field.value as Date}
      onChange={handleSingleDateChange}
    />
  );
} 