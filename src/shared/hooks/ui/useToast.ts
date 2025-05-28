/**
 * Toast variant options
 */
export type ToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "destructive";

/**
 * Toast notification options
 */
export interface ToastOptions {
  /**
   * The title of the toast
   */
  title: string;

  /**
   * Optional description for additional details
   */
  description?: string;

  /**
   * Style variant for the toast
   */
  variant?: ToastVariant;

  /**
   * Duration in milliseconds before auto-dismissing
   * Set to null to prevent auto-dismiss
   */
  duration?: number | null;

  /**
   * Type alias for backward compatibility
   */
  type?: string;

  /**
   * Message alias for description
   */
  message?: string;

  /**
   * Optional action component or configuration
   */
  action?: React.ReactNode | { label: string; onClick: () => void };

  /**
   * Callback for open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Toast return type
 */
export interface ToastReturn {
  /**
   * Unique identifier for the toast
   */
  id: string;

  /**
   * Function to dismiss the toast
   */
  dismiss: () => void;

  /**
   * Function to update the toast options
   */
  update: (newOptions: Partial<ToastOptions>) => void;
}

/**
 * Hook for displaying toast notifications
 *
 * This hook provides a standardized way to display toast notifications across the application.
 * It abstracts the underlying implementation to provide a consistent API.
 *
 * @returns Functions for displaying and managing toast notifications
 *
 * @example
 * ```tsx
 * const { toast, success, error } = useToast();
 *
 * // Display a default toast
 * toast({ title: "Note", description: "This is a toast notification" });
 *
 * // Display a success toast
 * success({ title: "Success", description: "Operation completed successfully" });
 *
 * // Display an error toast
 * error({ title: "Error", description: "An error occurred" });
 * ```
 */
export function useToast() {
  /**
   * Display a toast notification
   */
  const toast = (options: ToastOptions): ToastReturn => {
    console.log("TOAST:", options);
    // In a real implementation, this would trigger a toast notification
    return {
      id: "placeholder-id",
      dismiss: () => console.log("Dismissing toast"),
      update: (newOptions: Partial<ToastOptions>) =>
        console.log("Updating toast", newOptions),
    };
  };

  /**
   * Dismiss all active toast notifications
   */
  const dismiss = (toastId?: string) => {
    console.log("DISMISS TOAST:", toastId || "all");
    // In a real implementation, this would dismiss toasts
  };

  // Convenience methods for different toast types
  const success = (options: Omit<ToastOptions, "variant">) =>
    toast({ ...options, variant: "success" });

  const error = (options: Omit<ToastOptions, "variant">) =>
    toast({ ...options, variant: "destructive" });

  const warning = (options: Omit<ToastOptions, "variant">) =>
    toast({ ...options, variant: "warning" });

  const info = (options: Omit<ToastOptions, "variant">) =>
    toast({ ...options, variant: "info" });

  return {
    toast,
    dismiss,
    success,
    error,
    warning,
    info,
  };
}
