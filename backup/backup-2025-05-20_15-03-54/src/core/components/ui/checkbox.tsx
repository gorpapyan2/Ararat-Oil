import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { cn } from '@/utils/cn';

/**
 * Checkbox component props
 */
export interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /**
   * Label to display next to checkbox
   */
  label?: string;
  
  /**
   * Description text to display below checkbox
   */
  description?: string;
  
  /**
   * Error message to display when invalid
   */
  error?: string;
}

/**
 * Checkbox component for selecting a boolean value
 * 
 * @example
 * ```tsx
 * <Checkbox />
 * <Checkbox label="Accept terms" />
 * <Checkbox checked={isChecked} onCheckedChange={setIsChecked} />
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ 
  className, 
  label, 
  description, 
  error,
  ...props 
}, ref) => {
  const id = React.useId();
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <CheckboxPrimitive.Root
          id={id}
          ref={ref}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-input ring-offset-background",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            error && "border-destructive",
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator
            className={cn("flex items-center justify-center text-current")}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5 3.5L4.5 9.5L1.5 6.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
              error && "text-destructive"
            )}
          >
            {label}
          </label>
        )}
      </div>
      
      {description && (
        <p className="text-xs text-muted-foreground pl-6">
          {description}
        </p>
      )}
      
      {error && (
        <p className="text-xs text-destructive pl-6">
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
