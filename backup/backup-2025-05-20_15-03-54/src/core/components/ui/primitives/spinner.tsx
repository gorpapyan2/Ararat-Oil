import * as React from "react";
import { cn } from "@/lib/utils";
import { LoadingSpinnerPrimitive } from '@/core/components/ui/primitives/button';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner
   * @default "default"
   */
  size?: "sm" | "default" | "lg";

  /**
   * Whether to use the current text color for the spinner
   * @default false
   */
  useCurrentColor?: boolean;
}

/**
 * Loading spinner component
 */
export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = "default", useCurrentColor = false, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-3 w-3 border-2",
      default: "h-4 w-4 border-2",
      lg: "h-6 w-6 border-3",
    };

    return (
      <LoadingSpinnerPrimitive
        ref={ref}
        className={cn(
          "animate-spin rounded-full",
          useCurrentColor 
            ? "border-current border-t-transparent" 
            : "border-primary/30 border-t-primary",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

/**
 * Spinner with text label
 */
export interface SpinnerWithTextProps extends SpinnerProps {
  /**
   * The text to display next to the spinner
   * @default "Loading..."
   */
  text?: string;
  
  /**
   * The position of the text relative to the spinner
   * @default "right"
   */
  textPosition?: "left" | "right";
}

export const SpinnerWithText = React.forwardRef<HTMLDivElement, SpinnerWithTextProps>(
  ({ className, text = "Loading...", textPosition = "right", ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          "inline-flex items-center gap-2",
          textPosition === "left" && "flex-row-reverse",
          className
        )}
      >
        <Spinner {...props} />
        <span className="text-sm">{text}</span>
      </div>
    );
  }
);
SpinnerWithText.displayName = "SpinnerWithText"; 