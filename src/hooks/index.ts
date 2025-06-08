// Central hooks export file - Clean and simple

// Re-export from individual hook files (these files exist and re-export from core/shared)
export * from "./useAuth";
export * from "./useToast";
export * from "./useDialog";
export * from "./useTransactionCreation";
export * from "./useConfirmationDialog";
export * from "./useProfileDialog";
export * from "./use-keyboard-navigation";
export * from "./api";

// Direct exports from core hooks for compatibility
export { useTheme } from "@/core/hooks/useTheme";
export { useLocalStorage } from "@/core/hooks/useLocalStorage";

// Direct exports from shared hooks
export { useIsMobile } from "@/shared/hooks/useIsMobile";
export { useMediaQuery } from "@/shared/hooks/useMediaQuery";
export { usePageBreadcrumbs } from "@/shared/hooks/usePageBreadcrumbs";
export { useZodForm, useFormSubmitHandler, useZodFormWithSubmit } from "@/shared/hooks/use-form";
export { useFieldValidation } from "@/shared/hooks/useFieldValidation";
export { useFormSchemas } from "@/shared/hooks/useFormSchemas";

// Export types that components might need
export type ToastVariant = "default" | "success" | "error" | "warning";
export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};