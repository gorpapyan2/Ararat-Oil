
/**
 * Icon Button Component
 *
 * An extension of the base Button component that supports icons.
 * Can render an icon-only button (with accessible label) or an icon with text.
 */

import * as React from "react";
import { cn } from "@/shared/utils";
import { Button, ButtonProps } from "./button";

/**
 * Icon Button Props Interface
 */
export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  /**
   * The icon to display inside the button
   */
  icon: React.ReactNode;
  
  /**
   * Accessible label for the button (for screen readers)
   */
  label?: string;
  
  /**
   * Position of the icon relative to text
   */
  iconPosition?: "start" | "end";
  
  /**
   * Optional children (text content)
   */
  children?: React.ReactNode;
}

/**
 * Icon Button Component
 *
 * An accessible button that includes an icon, with optional text.
 * If no children are provided, it renders as an icon-only button and requires an aria-label.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      children,
      className,
      iconPosition = "start",
      ...props
    },
    ref
  ) => {
    // For icon-only buttons, an aria-label is required for accessibility
    if (!children && !label) {
      console.warn(
        "IconButton: You must provide either children or an aria-label for accessibility"
      );
    }

    return (
      <Button
        ref={ref}
        className={cn(
          // Add gap between icon and text if children exist
          children && "gap-2",
          className
        )}
        aria-label={children ? undefined : label}
        {...props}
      >
        {iconPosition === "start" && icon}
        {children}
        {iconPosition === "end" && icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
