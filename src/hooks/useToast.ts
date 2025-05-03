import { useAppStore } from "@/store/useAppStore";
import { v4 as uuidv4 } from "uuid";
import { Toast, ToastType } from "@/types/toast";
import type { ToastOptions } from "@/types/toast.d";
import * as React from "react";

// Create the consolidated hook
export const useToast = () => {
  const { addToast, removeToast, updateToast, toasts } = useAppStore();

  const toast = (options: ToastOptions) => {
    const id = uuidv4();
    const toastData = {
      id,
      title: options.title,
      description: options.description || options.message,
      message: options.message || options.description || "", 
      duration: options.duration || 5000,
      type: options.type || "info",
      variant: options.variant,
      action: options.action,
      onOpenChange: options.onOpenChange,
      createdAt: new Date(),
    } as Toast;

    addToast(toastData);

    // Auto dismiss after duration
    if (options.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, options.duration || 5000);
    }

    // Return an object with the id and control functions
    return {
      id,
      dismiss: () => removeToast(id),
      update: (newOptions: Partial<ToastOptions>) => {
        updateToast(id, {
          ...newOptions,
        });
      },
    };
  };

  // Convenience methods for different toast types
  const success = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "success" });
    
  const error = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "error" });
    
  const warning = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "warning" });
    
  const info = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "info" });

  return {
    toasts, // Return current toasts array for rendering
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
    update: updateToast,
  };
};

// Singleton pattern for use outside of React components
const { toast, success, error, warning, info, dismiss } = useToast();
export { toast, success, error, warning, info, dismiss };
