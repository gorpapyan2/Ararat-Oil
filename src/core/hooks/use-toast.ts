// Re-export the useToast hook from the main implementation
export { useToast } from "./useToast";
export type { ToastOptions, ToastVariant } from "./useToast";

// Note: Convenience exports should be used within components by calling useToast()
// Example usage:
// const { toast, success, error, warning, info, dismiss } = useToast();
