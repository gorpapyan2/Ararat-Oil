/**
 * Toast variant options
 */
export type ToastVariant = "default" | "success" | "error" | "warning" | "info" | "destructive";

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
  action?: any;
  
  /**
   * Callback for open state changes
   */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Toast return type
 */
interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (newOptions: Partial<ToastOptions>) => void;
}

/**
 * Hook for displaying toast notifications
 * 
 * This is a placeholder implementation. In a real application,
 * this would integrate with a toast notification system.
 * 
 * @returns Functions for displaying and managing toast notifications
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
      update: (newOptions: Partial<ToastOptions>) => console.log("Updating toast", newOptions)
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
    info
  };
} 