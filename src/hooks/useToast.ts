import { useAppStore } from "@/store/useAppStore";
import { v4 as uuidv4 } from "uuid";
import { Toast } from "@/types/toast";

interface ToastOptions {
  title?: string;
  description?: string;
  message?: string;
  duration?: number;
  type?: "success" | "error" | "warning" | "info";
}

export const useToast = () => {
  const { addToast, removeToast } = useAppStore();

  const toast = (options: ToastOptions) => {
    const id = uuidv4();
    const toastData: Toast = {
      id,
      title: options.title,
      description: options.description,
      message: options.message || options.description || "", // Ensure message is not undefined
      duration: options.duration || 5000,
      type: options.type || "info",
      createdAt: new Date(),
    };

    addToast(toastData);

    // Auto dismiss after duration
    if (options.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, options.duration || 5000);
    }

    return id;
  };

  // Convenience methods
  const success = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "success" });
  const error = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "error" });
  const warning = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "warning" });
  const info = (options: Omit<ToastOptions, "type">) =>
    toast({ ...options, type: "info" });

  return {
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
  };
};
