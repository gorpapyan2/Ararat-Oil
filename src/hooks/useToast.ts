import { useAppStore, selectToasts } from "@/core/store";
import { v4 as uuidv4 } from "uuid";
import { Toast, ToastType } from "@/types/toast";
import type { ToastOptions } from "@/types/toast.d";
import * as React from "react";

/**
 * Type for toast return value
 */
export interface ToastReturn {
  id: string;
  dismiss: () => void;
  update: (newOptions: Partial<ToastOptions>) => void;
}

/**
 * Convert ToastOptions to complete Toast object
 */
const createToastData = (options: ToastOptions, id: string): Toast => ({
  id,
  title: options.title,
  description: options.description || options.message,
  message: options.message || options.description || "", 
  duration: options.duration || 5000,
  type: options.type || "info",
  action: options.action,
  onOpenChange: options.onOpenChange,
  createdAt: new Date(),
});

/**
 * Hook for managing toast notifications
 * 
 * @returns Methods for creating and managing toasts
 */
export const useToast = () => {
  const store = useAppStore();
  const { addToast, removeToast, updateToast } = store;
  const toasts = useAppStore(selectToasts);

  /**
   * Create a new toast
   */
  const toast = React.useCallback((options: ToastOptions): ToastReturn => {
    const id = uuidv4();
    const toastData = createToastData(options, id);

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
  }, [addToast, removeToast, updateToast]);

  // Convenience methods for different toast types
  const success = React.useCallback((options: Omit<ToastOptions, "type">): ToastReturn =>
    toast({ ...options, type: "success" }), [toast]);
    
  const error = React.useCallback((options: Omit<ToastOptions, "type">): ToastReturn =>
    toast({ ...options, type: "error" }), [toast]);
    
  const warning = React.useCallback((options: Omit<ToastOptions, "type">): ToastReturn =>
    toast({ ...options, type: "warning" }), [toast]);
    
  const info = React.useCallback((options: Omit<ToastOptions, "type">): ToastReturn =>
    toast({ ...options, type: "info" }), [toast]);

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
// Non-hook version using the store directly
const getAppStore = useAppStore.getState;

/**
 * Create standalone toast function that doesn't rely on hooks
 */
export const toast = (options: ToastOptions): ToastReturn => {
  const store = getAppStore();
  const id = uuidv4();
  const toastData = createToastData(options, id);

  store.addToast(toastData);

  // Auto dismiss after duration
  if (options.duration !== Infinity) {
    setTimeout(() => {
      getAppStore().removeToast(id);
    }, options.duration || 5000);
  }

  return {
    id,
    dismiss: () => getAppStore().removeToast(id),
    update: (newOptions: Partial<ToastOptions>) => {
      getAppStore().updateToast(id, {
        ...newOptions,
      });
    },
  };
};

/**
 * Create a success toast outside of React components
 */
export const success = (options: Omit<ToastOptions, "type">): ToastReturn =>
  toast({ ...options, type: "success" });
  
/**
 * Create an error toast outside of React components
 */
export const error = (options: Omit<ToastOptions, "type">): ToastReturn =>
  toast({ ...options, type: "error" });
  
/**
 * Create a warning toast outside of React components
 */
export const warning = (options: Omit<ToastOptions, "type">): ToastReturn =>
  toast({ ...options, type: "warning" });
  
/**
 * Create an info toast outside of React components
 */
export const info = (options: Omit<ToastOptions, "type">): ToastReturn =>
  toast({ ...options, type: "info" });

/**
 * Dismiss a toast by ID outside of React components
 */
export const dismiss = (id: string): void => getAppStore().removeToast(id);
