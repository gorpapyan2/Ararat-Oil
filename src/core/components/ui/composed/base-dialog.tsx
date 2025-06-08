
/**
 * Base dialog components for standardizing dialog implementations
 * This file provides shared dialog patterns to reduce duplication across the codebase
 */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/core/components/ui/primitives/dialog";
import { Button } from "@/core/components/ui/buttons/button";
import { cn } from "@/shared/utils/cn";

/**
 * Props for StandardDialog component
 */
export interface StandardDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Handler for when the dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title?: React.ReactNode;
  /** Dialog description */
  description?: React.ReactNode;
  /** Dialog content */
  children: React.ReactNode;
  /** Custom footer content */
  footer?: React.ReactNode;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Handler for submit button click */
  onSubmit?: () => void | Promise<void>;
  /** Is the dialog in a loading/submitting state */
  isSubmitting?: boolean;
  /** Class name for the dialog content */
  className?: string;
  /** Form ID if the dialog contains a form */
  formId?: string;
}

/**
 * Standardized dialog component that handles common dialog patterns
 * Reduces duplication across dialog implementations
 */
export function StandardDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  children,
  footer,
  submitText = "Save",
  cancelText = "Cancel",
  onSubmit,
  isSubmitting,
  className,
  formId,
}: StandardDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("sm:max-w-[425px]", className)}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
        )}

        <div className="py-4">{children}</div>

        {footer || (
          <DialogFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {cancelText}
            </Button>
            {onSubmit ? (
              <Button type="button" onClick={onSubmit} disabled={isSubmitting}>
                {submitText}
              </Button>
            ) : (
              <Button type="submit" form={formId} disabled={isSubmitting}>
                {submitText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Props for ConfirmDialog component
 */
export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Handler for when the dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: React.ReactNode;
  /** Dialog message/content */
  message: React.ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Handler for confirm button click */
  onConfirm: () => void | Promise<void>;
  /** Is the dialog in a loading/submitting state */
  isSubmitting?: boolean;
  /** Confirm button variant */
  confirmVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

/**
 * Standardized confirmation dialog component
 * Handles common patterns for confirmation/delete dialogs
 */
export function ConfirmDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  isSubmitting,
  confirmVariant = "default",
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="py-4">{message}</div>

        <DialogFooter className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Props for DeleteConfirmDialog component
 */
export interface DeleteConfirmDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Handler for when the dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Name of the item being deleted */
  itemName?: string;
  /** Custom message (if not using itemName) */
  message?: React.ReactNode;
  /** Handler for confirm button click */
  onConfirm: () => void | Promise<void>;
  /** Is the dialog in a loading/submitting state */
  isSubmitting?: boolean;
  /** Delete button text */
  deleteText?: string;
  /** Cancel button text */
  cancelText?: string;
}

/**
 * Standardized delete confirmation dialog component
 * Handles common patterns for deletion confirmations
 */
export function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  itemName,
  message,
  onConfirm,
  isSubmitting,
  deleteText = "Delete",
  cancelText = "Cancel",
}: DeleteConfirmDialogProps) {
  const displayMessage = message || (
    <p>
      Are you sure you want to delete{" "}
      {itemName ? <strong>{itemName}</strong> : "this item"}? This action cannot
      be undone.
    </p>
  );

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Confirm Deletion"
      message={displayMessage}
      confirmText={deleteText}
      cancelText={cancelText}
      onConfirm={onConfirm}
      isSubmitting={isSubmitting}
      confirmVariant="destructive"
    />
  );
}

// Re-export dialog primitives for easy access
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
