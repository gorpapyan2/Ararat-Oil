import * as React from "react";
import { cn } from "@/shared/utils";
import { Button, ButtonProps, buttonVariants } from "@/core/components/ui/primitives/button";
import { VariantProps } from "class-variance-authority";

/**
 * Props for the IconButton component
 */
export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  /**
   * The icon to display inside the button
   * Should be a React component like a Lucide icon
   */
  icon: React.ReactNode;
  
  /**
   * Accessible label for the button (for screen readers)
   * Required for accessibility when there's no visible text
   */
  ariaLabel: string;
}

/**
 * IconButton component for icon-only buttons
 * Provides proper accessibility with aria-label
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ 
    className, 
    icon, 
    ariaLabel, 
    variant = "ghost", 
    size = "icon",
    ...props 
  }, ref) => {
    return (
      <Button
        className={className}
        ref={ref}
        variant={variant}
        size={size}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton"; 