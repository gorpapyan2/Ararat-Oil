/**
 * This file re-exports toast components from the primitives directory.
 * This helps maintain backward compatibility with existing imports.
 */

export {
  Toaster,
  Toast,
  ToastProvider,
  ToastViewport,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastVariants,
  type ToastProps,
  type ToastActionElement,
  type ToasterProps,
} from "@/core/components/ui/primitives/toast";
