import * as React from "react";
import { cn } from "@/shared/utils";
import { AlertTriangle } from "lucide-react";
import { Button, ButtonProps } from "@/core/components/ui/primitives/button";
import { StandardDialog } from "./StandardDialog";

/**
 * Props for DeleteConfirmDialog component
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
 * DeleteConfirmDialog component
 * 
 * A specialized dialog component for confirming deletion actions.
 * Shows a warning icon and provides confirm/cancel buttons with appropriate styling.
 * 
 * @example
 * ```tsx
 * <DeleteConfirmDialog
 *   open={isDeleteDialogOpen}
 *   onOpenChange={setIsDeleteDialogOpen}
 *   description="Are you sure you want to delete this item? This action cannot be undone."
 *   onConfirm={handleDelete}
 * />
 * ```
 */
export function DeleteConfirmDialog({
  open,
  onOpenChange,
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
  
  const actions = (
    <>
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
        {isLoading ? "Deleting..." : deleteText}
      </Button>
    </>
  );

  return (
    <StandardDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      actions={actions}
      className={cn("sm:max-w-md", className)}
    >
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="rounded-full bg-destructive/10 p-3">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-center text-sm text-muted-foreground">
          This action cannot be undone. Please confirm that you want to proceed with deletion.
        </p>
      </div>
    </StandardDialog>
  );
} 