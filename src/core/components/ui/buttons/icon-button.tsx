/**
 * Icon Button Component
 *
 * An extension of the base Button component that supports icons.
 * Can render an icon-only button (with accessible label) or an icon with text.
 */

import * as React from "react";
import { cn } from "@/utils";
import { Button, ButtonProps } from "./button";
import { ButtonSizeVariant, IconProps } from "./types";

/**
 * Icon Button Props Interface
 */
export interface IconButtonProps extends Omit<ButtonProps, "size">, IconProps {
  /**
   * Button size variant
   * For icon-only buttons, the "icon" size variant is recommended
   * @default "default"
   */
  size?: ButtonSizeVariant;
}

/**
 * Icon Button Component
 *
 * An accessible button that includes an icon, with optional text.
 * If no children are provided, it renders as an icon-only button and requires an aria-label.
 *
 * @example
 * ```tsx
 * // Icon-only button
 * <IconButton
 *   icon={<PlusIcon />}
 *   label="Add Item"
 *   size="icon"
 *   variant="primary"
 * />
 *
 * // Icon with text
 * <IconButton
 *   icon={<ArrowRightIcon />}
 *   iconPosition="end"
 *   variant="outline"
 * >
 *   Next Step
 * </IconButton>
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      children,
      className,
      size = "default",
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

    // For an icon-only button, use the icon size by default
    const buttonSize = !children && size === "default" ? "icon" : size;

    return (
      <Button
        ref={ref}
        size={buttonSize}
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
