import * as React from 'react';

import { cn } from '@/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Icon displayed at the start of the input
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon displayed at the end of the input
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the input is in an error state
   */
  error?: boolean;
  
  /**
   * Error message to show
   */
  errorMessage?: string;
}

/**
 * Input component for text input
 * 
 * @example
 * ```tsx
 * <Input placeholder="Enter your name" />
 * ```
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, error, errorMessage, ...props }, ref) => {
    const inputClasses = cn(
      "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      error ? "border-destructive" : "border-input",
      (startIcon || endIcon) && "px-10",
      className
    );
    
    // Create a wrapper for the input with potential icons
    const renderInput = () => {
      if (startIcon || endIcon) {
        return (
          <div className="relative">
            {startIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {startIcon}
              </div>
            )}
            <input type={type} className={inputClasses} ref={ref} {...props} />
            {endIcon && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {endIcon}
              </div>
            )}
          </div>
        );
      }
      
      return <input type={type} className={inputClasses} ref={ref} {...props} />;
    };
    
    return (
      <div className="w-full">
        {renderInput()}
        {error && errorMessage && (
          <p className="mt-1 text-xs text-destructive">{errorMessage}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
