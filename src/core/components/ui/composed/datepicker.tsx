import * as React from "react";
import { StandardDatePicker } from "@/shared/components/common/datepicker";
import { cn } from "@/shared/utils/cn";

/**
 * DatePicker component props
 * @deprecated Use StandardDatePicker instead
 */
export interface DatePickerProps {
  /**
   * Selected date value
   */
  value?: Date;

  /**
   * Callback when date changes
   */
  onChange?: (date: Date | undefined) => void;

  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;

  /**
   * Format string for displaying the date
   * @default "PPP" (e.g., "April 29, 2021")
   */
  dateFormat?: string;

  /**
   * Disabled state
   */
  disabled?: boolean;

  /**
   * Whether the field is required
   */
  required?: boolean;

  /**
   * Custom CSS class
   */
  className?: string;

  /**
   * Error state
   */
  error?: boolean;

  /**
   * Error message to display
   */
  errorMessage?: string;

  /**
   * Label for the date picker
   */
  label?: string;

  /**
   * Description text
   */
  description?: string;

  /**
   * ID for the input field
   */
  id?: string;

  /**
   * Name for the input field
   */
  name?: string;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;
}

/**
 * DatePicker component that combines a Calendar with a Popover
 *
 * @example
 * ```tsx
 * <DatePicker value={date} onChange={setDate} />
 * <DatePicker label="Birth date" required placeholder="Select your birth date" />
 * ```
 * @deprecated Use StandardDatePicker instead
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  dateFormat = "PPP",
  disabled = false,
  required = false,
  className,
  error = false,
  errorMessage,
  label,
  description,
  id,
  name,
  minDate,
  maxDate,
}: DatePickerProps) {
  // Log deprecation warning
  React.useEffect(() => {
    console.warn(
      "DatePicker is deprecated and will be removed in a future version. " +
        "Please use StandardDatePicker from @/shared/components/common/datepicker instead."
    );
  }, []);

  return (
    <StandardDatePicker
      mode="single"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      dateFormat={dateFormat}
      disabled={disabled}
      required={required}
      className={cn(className)}
      error={error}
      errorMessage={errorMessage}
      label={label}
      description={description}
      id={id}
      name={name}
      minDate={minDate}
      maxDate={maxDate}
    />
  );
}
