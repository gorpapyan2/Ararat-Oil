import * as React from "react";
import { format, isValid } from "date-fns";
import {
  Calendar,
  type DateRange as CalendarDateRange,
} from "@/core/components/ui/primitives/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/core/components/ui/popover";
import { Button } from "@/core/components/ui/button";
import { cn } from "@/utils/cn";
import { Input } from "@/core/components/ui/primitives/input";

/**
 * DateRange type for from/to date selection
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * StandardDatePicker component props with base shared props
 */
interface BaseDatePickerProps {
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;

  /**
   * Format string for displaying the date
   * @default "PPP" (e.g., "April 29, 2021") for single date
   * @default "PP" (e.g., "Apr 29, 2021") for date range
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

  /**
   * Mode for the date picker - single date or date range
   * @default "single"
   */
  mode?: "single" | "range";
}

/**
 * Props specific to single date picker mode
 */
interface SingleDatePickerProps extends BaseDatePickerProps {
  mode?: "single";
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

/**
 * Props specific to date range picker mode
 */
interface RangeDatePickerProps extends BaseDatePickerProps {
  mode: "range";
  value?: DateRange;
  onChange?: (dateRange: DateRange | undefined) => void;
  separator?: string;
  numberOfMonths?: number;
}

/**
 * Union type for all possible props configurations
 */
export type StandardDatePickerProps =
  | SingleDatePickerProps
  | RangeDatePickerProps;

/**
 * StandardDatePicker component that can function as both a single date picker
 * and a date range picker based on the mode prop
 *
 * @example Single date mode
 * ```tsx
 * <StandardDatePicker value={date} onChange={setDate} />
 * ```
 *
 * @example Date range mode
 * ```tsx
 * <StandardDatePicker mode="range" value={dateRange} onChange={setDateRange} />
 * ```
 */
export function StandardDatePicker(props: StandardDatePickerProps) {
  const {
    placeholder = props.mode === "range" ? "Select date range" : "Select date",
    dateFormat = props.mode === "range" ? "PP" : "PPP",
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
    mode = "single",
  } = props;

  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const fieldId = id || generatedId;

  // For single date mode
  const handleSingleDateSelect = (date: Date | undefined) => {
    if (mode === "single" && "onChange" in props && props.onChange) {
      (props.onChange as (date: Date | undefined) => void)(date);
      setOpen(false);
    }
  };

  // For date range mode
  const handleRangeSelect = (range: CalendarDateRange | undefined) => {
    if (mode === "range" && "onChange" in props && props.onChange) {
      const dateRange: DateRange = range
        ? { from: range.from, to: range.to }
        : {};
      (props.onChange as (dateRange: DateRange | undefined) => void)(dateRange);

      // Only close popover when both dates are selected
      if (range?.to) {
        setOpen(false);
      }
    }
  };

  // Handle clearing the date(s)
  const handleClear = () => {
    if (mode === "single" && "onChange" in props && props.onChange) {
      (props.onChange as (date: Date | undefined) => void)(undefined);
    } else if (mode === "range" && "onChange" in props && props.onChange) {
      (props.onChange as (dateRange: DateRange | undefined) => void)({});
    }

    setOpen(false);

    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format the display value based on mode
  const displayValue = React.useMemo(() => {
    if (mode === "single") {
      const singleValue = props.value as Date | undefined;
      return singleValue && isValid(singleValue)
        ? format(singleValue, dateFormat)
        : "";
    } else {
      const rangeValue = (props as RangeDatePickerProps).value || {};
      const separator = (props as RangeDatePickerProps).separator || " - ";

      if (!rangeValue.from) return "";

      if (!rangeValue.to) {
        return format(rangeValue.from, dateFormat);
      }

      return `${format(rangeValue.from, dateFormat)}${separator}${format(rangeValue.to, dateFormat)}`;
    }
  }, [props.value, dateFormat, mode]);

  const hasValue =
    mode === "single"
      ? Boolean(props.value)
      : Boolean(
          (props as RangeDatePickerProps).value?.from ||
            (props as RangeDatePickerProps).value?.to
        );

  // Determine number of months to display in the calendar
  const numberOfMonths =
    mode === "range" ? (props as RangeDatePickerProps).numberOfMonths || 2 : 1;

  // Icon for the calendar
  const calendarIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            error && "text-destructive"
          )}
        >
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </label>
      )}

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <div className="flex items-center">
              <Input
                ref={inputRef}
                id={fieldId}
                name={name}
                placeholder={placeholder}
                value={displayValue}
                className={cn(
                  "w-full cursor-pointer pr-10",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                readOnly
                disabled={disabled}
                onClick={() => !disabled && setOpen(true)}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-controls={open ? `date-picker-${fieldId}` : undefined}
              />
              <div className="absolute right-3 pointer-events-none">
                {calendarIcon}
              </div>
            </div>

            {/* Add a clear button if a date is selected */}
            {hasValue && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-0 right-8 h-full px-2 py-1"
                aria-label="Clear date"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          id={`date-picker-${fieldId}`}
          className="w-auto p-0"
          align="start"
        >
          {mode === "single" ? (
            <Calendar
              mode="single"
              selected={props.value as Date | undefined}
              onSelect={handleSingleDateSelect}
              initialFocus
              minDate={minDate}
              maxDate={maxDate}
            />
          ) : (
            <Calendar
              mode="range"
              selected={
                (props as RangeDatePickerProps).value &&
                (props as RangeDatePickerProps).value?.from
                  ? ({
                      from: (props as RangeDatePickerProps).value!.from!,
                      to: (props as RangeDatePickerProps).value?.to,
                    } as CalendarDateRange)
                  : undefined
              }
              onSelect={handleRangeSelect}
              numberOfMonths={numberOfMonths}
              initialFocus
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        </PopoverContent>
      </Popover>

      {error && errorMessage && (
        <p className="text-sm font-medium text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
