import * as React from "react";
import { useState, useCallback } from "react";
import { Button, ButtonProps } from '@/core/components/ui/button';
import { cn } from "@/lib/utils";

/**
 * Props for the LoadingButton component
 */
export interface LoadingButtonProps extends Omit<ButtonProps, 'isLoading'> {
  /**
   * Function to execute when the button is clicked
   * Will automatically set loading state during execution
   */
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void> | void;
  
  /**
   * Text to display when the button is in loading state
   * @default undefined - will use children
   */
  loadingText?: string;
  
  /**
   * Whether the button is initially in loading state
   * @default false
   */
  initialLoading?: boolean;
}

/**
 * LoadingButton component for async operations
 * 
 * Automatically handles loading state during async operations
 */
export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    className, 
    onClick, 
    loadingText,
    initialLoading = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const [isLoading, setIsLoading] = useState(initialLoading);
    
    const handleClick = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        setIsLoading(true);
        const result = onClick(e);
        
        // If the onClick returns a promise, wait for it to resolve
        if (result instanceof Promise) {
          await result;
        }
      } catch (error) {
        console.error("Error in LoadingButton onClick:", error);
      } finally {
        setIsLoading(false);
      }
    }, [onClick]);
    
    return (
      <Button
        className={className}
        ref={ref}
        onClick={handleClick}
        isLoading={isLoading}
        loadingText={loadingText}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton"; 