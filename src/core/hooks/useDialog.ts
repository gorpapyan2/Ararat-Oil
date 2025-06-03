import { useState, useCallback, useRef } from "react";

/**
 * Hook for managing dialog state
 * @returns Dialog state management utilities
 */
export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  /**
   * Open the dialog
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close the dialog
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Toggle the dialog state
   */
  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  /**
   * Handle open state change
   */
  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
    onOpenChange,
    triggerRef,
  };
}

/**
 * Props for useConfirmDialog hook
 */
export interface UseConfirmDialogProps {
  /**
   * Callback to execute on confirmation
   */
  onConfirm?: () => void;
  /**
   * Callback to execute on cancellation
   */
  onCancel?: () => void;
}

/**
 * Hook for managing confirmation dialogs
 * @param props Optional callbacks for confirm and cancel actions
 * @returns Confirmation dialog state and handlers
 */
export function useConfirmDialog(props?: UseConfirmDialogProps) {
  const { onConfirm: propOnConfirm, onCancel: propOnCancel } = props || {};
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);

  /**
   * Open the confirmation dialog
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * Close the confirmation dialog
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle the confirm action
   */
  const onConfirm = useCallback(async () => {
    try {
      setIsLoading(true);
      if (propOnConfirm) {
        await Promise.resolve(propOnConfirm());
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error in confirmation action:", error);
    } finally {
      setIsLoading(false);
    }
  }, [propOnConfirm]);

  /**
   * Handle the cancel action
   */
  const onCancel = useCallback(() => {
    if (propOnCancel) {
      propOnCancel();
    }
    setIsOpen(false);
  }, [propOnCancel]);

  /**
   * Handle dialog open state change
   */
  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    onConfirm,
    onCancel,
    onOpenChange,
    isLoading,
    triggerRef,
  };
}

/**
 * Props for useAlertDialog hook
 */
export interface UseAlertDialogProps {
  /**
   * Default severity for the alert
   * @default "info"
   */
  defaultSeverity?: "info" | "warning" | "danger";
  /**
   * Callback to execute when the alert is acknowledged
   */
  onAcknowledge?: () => void;
}

/**
 * Return type for useAlertDialog hook
 */
export interface UseAlertDialogReturn {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  open: (params?: {
    title?: string;
    description?: string;
    severity?: "info" | "warning" | "danger";
  }) => void;
  close: () => void;
  onOpenChange: (open: boolean) => void;
  onAcknowledge: () => void;
  triggerRef: React.RefObject<HTMLElement>;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  severity: "info" | "warning" | "danger";
  setSeverity: (severity: "info" | "warning" | "danger") => void;
}

/**
 * Hook for managing alert dialogs with dynamic content
 * @param props Optional props for alert dialog
 * @returns Alert dialog state and handlers
 */
export function useAlertDialog(
  props?: UseAlertDialogProps
): UseAlertDialogReturn {
  const { defaultSeverity = "info", onAcknowledge: propOnAcknowledge } =
    props || {};

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"info" | "warning" | "danger">(
    defaultSeverity
  );

  const triggerRef = useRef<HTMLElement>(null);

  /**
   * Open the alert dialog with optional parameters
   */
  const open = useCallback(
    (params?: {
      title?: string;
      description?: string;
      severity?: "info" | "warning" | "danger";
    }) => {
      if (params?.title) {
        setTitle(params.title);
      }
      if (params?.description) {
        setDescription(params.description);
      }
      if (params?.severity) {
        setSeverity(params.severity);
      }
      setIsOpen(true);
    },
    []
  );

  /**
   * Close the alert dialog
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle acknowledge action
   */
  const onAcknowledge = useCallback(() => {
    if (propOnAcknowledge) {
      propOnAcknowledge();
    }
    setIsOpen(false);
  }, [propOnAcknowledge]);

  /**
   * Handle dialog open state change
   */
  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    onOpenChange,
    onAcknowledge,
    triggerRef,
    title,
    setTitle,
    description,
    setDescription,
    severity,
    setSeverity,
  };
}

// Export hooks from their individual files
export { useMultiStepDialog } from "@/shared/hooks/useMultiStepDialog";
export { useConfirmationDialog } from "@/shared/hooks/useConfirmationDialog";
export { useLoginDialog } from "@/features/auth/hooks/useLoginDialog";
