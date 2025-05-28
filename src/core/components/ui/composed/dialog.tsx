import * as React from "react";
import { X } from "lucide-react";

import { cn } from "@/shared/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/core/components/ui/styled/dialog";
import { Button, ButtonProps } from "@/core/components/ui/button";

/**
 * Standard Dialog component with consistent styling and behavior
 */
export interface StandardDialogProps {
  /** Dialog title */
  title: string;
  /** Optional dialog description */
  description?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Optional trigger element that opens the dialog */
  trigger?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Whether the dialog is currently open */
  isOpen?: boolean;
  /** Called when the open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional custom width for the dialog */
  width?: "sm" | "md" | "lg" | "xl" | "full";
  /** Optional custom height for the dialog */
  height?: "auto" | "sm" | "md" | "lg" | "xl" | "full";
  /** Whether to show a close button in the header */
  showCloseButton?: boolean;
  /** Optional additional class names */
  className?: string;
}

/**
 * Standard Dialog component with rich styling and consistent behavior
 */
function StandardDialog({
  title,
  description,
  children,
  trigger,
  footer,
  isOpen,
  onOpenChange,
  width = "md",
  height = "auto",
  showCloseButton = true,
  className,
}: StandardDialogProps) {
  // Map width/height to specific classes
  const widthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-full",
  };

  const heightClasses = {
    auto: "",
    sm: "max-h-[300px]",
    md: "max-h-[500px]",
    lg: "max-h-[700px]",
    xl: "max-h-[900px]",
    full: "max-h-screen",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          widthClasses[width],
          heightClasses[height],
          "overflow-hidden flex flex-col",
          className
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
          {showCloseButton && (
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          )}
        </DialogHeader>
        <div className="overflow-auto flex-1">{children}</div>
        {footer && <DialogFooter className="mt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Reference to the trigger element
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Title of the dialog
   */
  title: string;
  /**
   * Description text for the confirmation
   */
  description: string;
  /**
   * Callback fired when the confirmation is accepted
   */
  onConfirm: () => void;
  /**
   * Callback fired when the confirmation is canceled
   */
  onCancel?: () => void;
  /**
   * Text for the confirm button
   * @default "Confirm"
   */
  confirmText?: string;
  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  /**
   * Props for the confirm button
   */
  confirmButtonProps?: ButtonProps;
  /**
   * Props for the cancel button
   */
  cancelButtonProps?: ButtonProps;
  /**
   * Whether the dialog is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * Confirm dialog component for user confirmations with confirm/cancel buttons
 */
function ConfirmDialog({
  open,
  onOpenChange,
  triggerRef,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmButtonProps,
  cancelButtonProps,
  isLoading = false,
  className,
}: ConfirmDialogProps) {
  // Handle confirm action
  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            {...cancelButtonProps}
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            {...confirmButtonProps}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Props for the AlertMessageDialog component
 */
export interface AlertMessageDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Reference to the trigger element
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Title of the alert
   */
  title: string;
  /**
   * Description text for the alert
   */
  description: string;
  /**
   * Severity level of the alert
   * @default "info"
   */
  severity?: "info" | "warning" | "danger";
  /**
   * Text for the acknowledge button
   * @default "OK"
   */
  buttonText?: string;
  /**
   * Props for the acknowledge button
   */
  buttonProps?: ButtonProps;
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * Alert message dialog for displaying important information to users
 */
function AlertMessageDialog({
  open,
  onOpenChange,
  triggerRef,
  title,
  description,
  severity = "info",
  buttonText = "OK",
  buttonProps,
  className,
}: AlertMessageDialogProps) {
  // Map severity to button variant
  const buttonVariantMap: Record<string, ButtonProps["variant"]> = {
    info: "default",
    warning: "secondary",
    danger: "destructive",
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <Button
            variant={buttonVariantMap[severity]}
            onClick={() => onOpenChange(false)}
            {...buttonProps}
          >
            {buttonText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Props for the DeleteConfirmDialog component
 */
export interface DeleteConfirmDialogProps {
  /**
   * Controls whether the dialog is open
   */
  open: boolean;
  /**
   * Callback fired when the dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
  /**
   * Reference to the trigger element
   */
  triggerRef?: React.RefObject<HTMLElement>;
  /**
   * Title of the dialog
   * @default "Confirm Deletion"
   */
  title?: string;
  /**
   * Description text for the confirmation
   */
  description: string;
  /**
   * Callback fired when the deletion is confirmed
   */
  onConfirm: () => void;
  /**
   * Callback fired when the deletion is canceled
   */
  onCancel?: () => void;
  /**
   * Text for the delete button
   * @default "Delete"
   */
  deleteText?: string;
  /**
   * Text for the cancel button
   * @default "Cancel"
   */
  cancelText?: string;
  /**
   * Whether the dialog is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Optional class name for styling
   */
  className?: string;
}

/**
 * Delete confirmation dialog with destructive styling
 */
function DeleteConfirmDialog({
  open,
  onOpenChange,
  triggerRef,
  title = "Confirm Deletion",
  description,
  onConfirm,
  onCancel,
  deleteText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
  className,
}: DeleteConfirmDialogProps) {
  // Handle confirm action
  const handleConfirm = () => {
    onConfirm();
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={className}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {deleteText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export {
  StandardDialog,
  ConfirmDialog,
  AlertMessageDialog,
  DeleteConfirmDialog,
};
