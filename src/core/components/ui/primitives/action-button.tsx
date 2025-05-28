import * as React from "react";
import { Button, ButtonProps } from "@/core/components/ui/button";
import { cn } from "@/shared/utils";

/**
 * Props for the ActionButton component
 */
export interface ActionButtonProps extends ButtonProps {
  /**
   * Determines if the action is considered destructive
   * Will automatically use the destructive variant
   * @default false
   */
  isDestructive?: boolean;

  /**
   * Whether to show a confirmation step before executing the action
   * @default false for normal actions, true for destructive actions
   */
  requireConfirmation?: boolean;

  /**
   * Confirmation message to display
   * @default "Are you sure?"
   */
  confirmationMessage?: string;

  /**
   * Label for the confirm button in the confirmation dialog
   * @default "Confirm"
   */
  confirmLabel?: string;

  /**
   * Label for the cancel button in the confirmation dialog
   * @default "Cancel"
   */
  cancelLabel?: string;
}

/**
 * ActionButton component for important actions that may require confirmation
 *
 * For destructive actions like delete, or other important operations
 * that benefit from a confirmation step.
 */
export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      className,
      isDestructive = false,
      requireConfirmation,
      confirmationMessage = "Are you sure?",
      confirmLabel = "Confirm",
      cancelLabel = "Cancel",
      variant,
      onClick,
      children,
      ...props
    },
    ref
  ) => {
    // Default requireConfirmation to true for destructive actions
    const shouldConfirm = requireConfirmation ?? isDestructive;

    // Determine the variant based on whether the action is destructive
    const buttonVariant =
      variant || (isDestructive ? "destructive" : "secondary");

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (shouldConfirm) {
        // Show browser confirmation dialog
        const confirmed = window.confirm(confirmationMessage);
        if (confirmed && onClick) {
          onClick(e);
        }
      } else if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        className={className}
        ref={ref}
        variant={buttonVariant}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";
