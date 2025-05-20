import * as React from "react";
import { cn } from "@/shared/utils";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogHeader,
  AlertDialog,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/core/components/ui/styled/dialog';
import { Button, ButtonProps } from "@/core/components/ui/primitives/button";

/**
 * Props for StandardDialog component
 */
export interface StandardDialogProps {
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
   * Optional description text
   */
  description?: string;
  /**
   * Dialog content
   */
  children: React.ReactNode;
  /**
   * Footer actions, typically buttons
   */
  actions?: React.ReactNode;
  /**
   * Optional class name for the dialog container
   */
  className?: string;
  /**
   * Whether to show a close button in the top right
   * @default true
   */
  showCloseButton?: boolean;
  /**
   * Maximum width class for the dialog
   * @default "sm:max-w-md"
   */
  maxWidth?: string;
}

/**
 * Standard dialog component with header, content, and footer sections
 */
export function StandardDialog({
  open,
  onOpenChange,
  triggerRef,
  title,
  description,
  children,
  actions,
  className,
  showCloseButton = true,
  maxWidth = "sm:max-w-md",
}: StandardDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(maxWidth, className)}
        title={title}
        screenReaderDescription={description}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-4">{children}</div>
        
        {actions && <DialogFooter>{actions}</DialogFooter>}
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
export function ConfirmDialog({
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
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      title={title}
      description={description}
      className={className}
    >
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
export function AlertMessageDialog({
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
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      title={title}
      description={description}
      severity={severity}
      className={className}
    >
      <AlertDialogHeader>
        <AlertDialogTitle severity={severity}>{title}</AlertDialogTitle>
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
export function DeleteConfirmDialog({
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
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
      triggerRef={triggerRef}
      title={title}
      description={description}
      severity="danger"
      className={className}
    >
      <AlertDialogHeader>
        <AlertDialogTitle severity="danger">{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      
      <AlertDialogFooter className="mt-4">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
        >
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
    </AlertDialog>
  );
} 