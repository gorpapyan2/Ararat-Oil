import * as React from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/core/components/ui/primitives/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/core/components/ui/popover';
import { Button } from "@/core/components/ui/primitives/button";
import { cn } from '@/utils/cn';
import { Input } from "@/core/components/ui/primitives/input";

/**
 * DatePicker component props
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
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const generatedId = React.useId();
  const fieldId = id || generatedId;
  
  // Sync with parent state
  React.useEffect(() => {
    setDate(value);
  }, [value]);
  
  // Handle date selection
  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    if (onChange) {
      onChange(selectedDate);
    }
  };
  
  // Clear the date
  const handleClear = () => {
    setDate(undefined);
    if (onChange) {
      onChange(undefined);
    }
    setOpen(false);
    
    // Focus the input after clearing
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
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
              value={date ? format(date, dateFormat) : ""}
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
            
            {/* Add a clear button if a date is selected */}
            {date && !disabled && (
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
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            minDate={minDate}
            maxDate={maxDate}
          />
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
 * DatePicker component with all its subcomponents
 */
export { DatePicker };
