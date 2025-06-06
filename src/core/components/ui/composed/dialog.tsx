import React from "react";
import {
  StandardDialog,
  StandardDialogProps,
  ConfirmDialog,
  ConfirmDialogProps,
  DeleteConfirmDialog,
  DeleteConfirmDialogProps,
} from "./base-dialog";

/**
 * Props for AlertMessageDialog component
 */
export interface AlertMessageDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Handler for when the dialog should close */
  onOpenChange: (open: boolean) => void;
  /** Alert title */
  title: React.ReactNode;
  /** Alert message/content */
  message: React.ReactNode;
  /** Alert type - affects styling */
  type?: "info" | "warning" | "error" | "success";
  /** Close button text */
  closeText?: string;
  /** Handler for close button click */
  onClose?: () => void;
}

/**
 * Standardized alert message dialog component
 * For displaying informational messages, warnings, errors, etc.
 */
export function AlertMessageDialog({
  isOpen,
  onOpenChange,
  title,
  message,
  type = "info",
  closeText = "OK",
  onClose,
}: AlertMessageDialogProps) {
  const handleClose = () => {
    onClose?.();
    onOpenChange(false);
  };

  return (
    <StandardDialog
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              type === "error"
                ? "bg-red-600 text-white hover:bg-red-700"
                : type === "warning"
                ? "bg-yellow-600 text-white hover:bg-yellow-700"
                : type === "success"
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {closeText}
          </button>
        </div>
      }
    >
      <div className="py-4">
        {typeof message === "string" ? <p>{message}</p> : message}
      </div>
    </StandardDialog>
  );
}

// Re-export all dialog components and types
export {
  StandardDialog,
  ConfirmDialog,
  DeleteConfirmDialog,
};

export type {
  StandardDialogProps,
  ConfirmDialogProps,
  DeleteConfirmDialogProps,
}; 