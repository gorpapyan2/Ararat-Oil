import * as React from 'react';
import { StandardDatePicker, DateRange as StandardDateRange } from '@/shared/components/common/datepicker';
import { cn } from '@/utils/cn';

/**
 * DateRange type for from/to date selection
 * @deprecated Use DateRange from '@/shared/components/common/datepicker' instead
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * DateRangePicker component props
 * @deprecated Use StandardDatePicker with mode="range" instead
 */
export interface DateRangePickerProps {
  /**
   * Selected date range value
   */
  value?: DateRange;
  
  /**
   * Callback when date range changes
   */
  onChange?: (dateRange: DateRange | undefined) => void;
  
  /**
   * Placeholder text when no date range is selected
   */
  placeholder?: string;
  
  /**
   * Format string for displaying each date
   * @default "PP" (e.g., "Apr 29, 2021")
   */
  dateFormat?: string;
  
  /**
   * Format string for the separator between dates
   * @default " - " (space, dash, space)
   */
  separator?: string;
  
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
   * Label for the date range picker
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
  
  /**
   * Number of months to display
   * @default 2
   */
  numberOfMonths?: number;
}

/**
 * DateRangePicker component for selecting a range of dates
 * 
 * @example
 * ```tsx
 * <DateRangePicker value={dateRange} onChange={setDateRange} />
 * <DateRangePicker label="Stay period" required placeholder="Select check-in and check-out dates" />
 * ```
 * @deprecated Use StandardDatePicker with mode="range" instead
 */
export const DateRangePicker = ({ 
  value,
  onChange,
  placeholder = "Select date range",
  dateFormat = "PP",
  separator = " - ",
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
  numberOfMonths = 2,
}: DateRangePickerProps) => {
  // Log deprecation warning
  React.useEffect(() => {
    console.warn(
      'DateRangePicker is deprecated and will be removed in a future version. ' +
      'Please use StandardDatePicker with mode="range" from @/shared/components/common/datepicker instead.'
    );
  }, []);

  return (
    <StandardDatePicker
      mode="range"
      value={value as StandardDateRange}
      onChange={(dateRange) => onChange?.(dateRange as DateRange)}
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
      numberOfMonths={numberOfMonths}
    />
  );
}
