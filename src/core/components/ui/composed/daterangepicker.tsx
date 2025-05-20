import * as React from 'react';
import { format, isValid } from 'date-fns';
import { Calendar } from "@/core/components/ui/primitives/calendar";
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { Button } from "@/core/components/ui/button";
import { cn } from '@/utils/cn';
import { Input } from "@/core/components/ui/primitives/input";

/**
 * DateRange type for from/to date selection
 */
export interface DateRange {
  from?: Date;
  to?: Date;
}

/**
 * DateRangePicker component props
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
 */
const DateRangePicker = ({ 
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
}: DateRangePickerProps) {
  const [dateRange, setDateRange] = React.useState<DateRange>(value || {});
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  
  // Sync with parent state
  React.useEffect(() => {
    setDateRange(value || {});
  }, [value]);
  
  // Handle date selection
  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range || {});
    
    // Only close popover when both dates are selected
    if (range?.to) {
      setOpen(false);
    }
    
    if (onChange) {
      onChange(range);
    }
  };
  
  // Clear the date range
  const handleClear = () => {
    setDateRange({});
    if (onChange) {
      onChange(undefined);
    }
    setOpen(false);
    
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Format the display value
  const displayValue = React.useMemo(() => {
    if (!dateRange.from) return "";
    
    if (!dateRange.to) {
      return format(dateRange.from, dateFormat);
    }
    
    return `${format(dateRange.from, dateFormat)}${separator}${format(dateRange.to, dateFormat)}`;
  }, [dateRange, dateFormat, separator]);
  
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
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Input
              ref={inputRef}
              id={fieldId}
              name={name}
              placeholder={placeholder}
              value={displayValue}
              className={cn(
                "w-full cursor-pointer",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              readOnly
              disabled={disabled}
              onClick={() => !disabled && setOpen(true)}
              // Add a calendar icon to the right
              endIcon={(
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
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              )}
            />
            
            {/* Add a clear button if a date range is selected */}
            {(dateRange.from || dateRange.to) && !disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="absolute top-0 right-8 h-full px-2 py-1"
                aria-label="Clear date range"
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
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          <div className="flex flex-col space-y-3 p-3">
            <div className="space-y-1.5">
              <div className="flex items-center text-sm">
                <div className="font-medium">
                  {dateRange.from ? format(dateRange.from, "MMMM yyyy") : "Select start date"}
                </div>
                {dateRange.from && dateRange.to && (
                  <div className="ml-auto font-medium">
                    {format(dateRange.to, "MMMM yyyy")}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {dateRange.from && dateRange.to ? (
                  <>
                    {format(dateRange.from, "EEEE, MMMM d")} - {format(dateRange.to, "EEEE, MMMM d")}
                  </>
                ) : dateRange.from ? (
                  <>
                    {format(dateRange.from, "EEEE, MMMM d")} - Select end date
                  </>
                ) : (
                  "Please select a start and end date"
                )}
              </div>
            </div>
            
            <div className="flex">
              <Calendar
                mode="range"
                selected={dateRange.from ? { from: dateRange.from, to: dateRange.to } : undefined}
                onSelect={(date) => {
                  if (date) {
                    handleSelect({ 
                      from: date.from as Date, 
                      to: date.to as Date 
                    });
                  } else {
                    handleSelect(undefined);
                  }
                }}
                initialFocus={true}
                minDate={minDate}
                maxDate={maxDate}
                numberOfMonths={numberOfMonths}
                className="border-0"
              />
            </div>
            
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (dateRange.from && dateRange.to) {
                    setOpen(false);
                  }
                }}
                disabled={!dateRange.from || !dateRange.to}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      {error && errorMessage && (
        <p className="text-xs text-destructive">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

/**
 * DateRangePicker component with all its subcomponents
 */
export { DateRangePicker };
