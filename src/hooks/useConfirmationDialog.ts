import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

export type ConfirmationVariant =
  | "default"
  | "destructive"
  | "warning"
  | "info";

export interface ConfirmationOptions {
  title?: string;
  message: string;
  variant?: ConfirmationVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface UseConfirmationDialogOptions {
  defaultOptions?: Partial<ConfirmationOptions>;
}

export function useConfirmationDialog({
  defaultOptions = {},
}: UseConfirmationDialogOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: defaultOptions.title || "Confirm Action",
    message: defaultOptions.message || "Are you sure you want to proceed?",
    variant: defaultOptions.variant || "default",
    confirmLabel: defaultOptions.confirmLabel || "Confirm",
    cancelLabel: defaultOptions.cancelLabel || "Cancel",
    onConfirm: defaultOptions.onConfirm,
    onCancel: defaultOptions.onCancel,
  });

  const { toast } = useToast();

  const openDialog = useCallback(
    (customOptions?: Partial<ConfirmationOptions>) => {
      if (customOptions) {
        setOptions((prev) => ({
          ...prev,
          ...customOptions,
        }));
      }
      setIsOpen(true);
    },
    []
  );

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (options?.onConfirm) {
      options.onConfirm();
    }
    setIsOpen(false);
  }, [options, setIsOpen]);

  const handleCancel = useCallback(() => {
    if (options?.onCancel) {
      options.onCancel();
    }
    setIsOpen(false);
  }, [options, setIsOpen]);

  return {
    isOpen,
    setIsOpen,
    isLoading,
    options,
    openDialog,
    closeDialog,
    handleConfirm,
    handleCancel,
  };
}
