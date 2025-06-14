
import * as React from "react";
import { useState } from "react";
import { cn } from "@/shared/utils";
import {
  Button,
  ButtonProps,
  buttonVariants,
} from "@/core/components/ui/button";
import { VariantProps } from "class-variance-authority";

/**
 * Props for the ToggleButton component
 */
export interface ToggleButtonProps extends Omit<ButtonProps, "onClick" | "variant"> {
  /**
   * Whether the toggle is active (pressed)
   * @default false
   */
  isActive?: boolean;

  /**
   * Callback when the toggle state changes
   */
  onToggle?: (isActive: boolean) => void;

  /**
   * Active variant to use when the button is toggled on
   * @default "default"
   */
  activeVariant?: VariantProps<typeof buttonVariants>["variant"];

  /**
   * Inactive variant to use when the button is toggled off
   * @default "outline"
   */
  inactiveVariant?: VariantProps<typeof buttonVariants>["variant"];

  /**
   * Value for the toggle button (used in groups)
   */
  value?: string;
}

/**
 * ToggleButton component for toggling between two states
 *
 * Use for options that can be turned on/off or for segmented controls
 */
export const ToggleButton = React.forwardRef<
  HTMLButtonElement,
  ToggleButtonProps
>(
  (
    {
      className,
      isActive: isActiveProp = false,
      onToggle,
      activeVariant = "default",
      inactiveVariant = "outline",
      children,
      value,
      ...props
    },
    ref
  ) => {
    // Use internal state if no external control is provided
    const [internalIsActive, setInternalIsActive] = useState(isActiveProp);
    const isControlled = onToggle !== undefined;
    const isActive = isControlled ? isActiveProp : internalIsActive;

    // Determine which variant to use based on the active state
    const variant = isActive ? activeVariant : inactiveVariant;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isControlled && onToggle) {
        onToggle(!isActive);
      } else {
        setInternalIsActive(!internalIsActive);
      }
    };

    return (
      <Button
        className={cn(isActive && "ring-2 ring-ring ring-offset-1", className)}
        ref={ref}
        variant={variant}
        data-state={isActive ? "active" : "inactive"}
        aria-pressed={isActive}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ToggleButton.displayName = "ToggleButton";
