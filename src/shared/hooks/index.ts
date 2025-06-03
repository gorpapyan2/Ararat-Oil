// Re-export base hooks
export * from "./base";

// Re-export form hooks
export * from "./form";

// Re-export UI hooks
export * from "./ui";

// Re-export API hooks
export * from "./api";

// Individual hooks
export { useConfirmationDialog } from "./useConfirmationDialog";
export { useFormSchemas } from "./useFormSchemas";
export { useFormValidation } from "./useFormValidation";
export { useBreadcrumbs } from "./useBreadcrumbs";
export { useRoutePrefetch } from "./useRoutePrefetch";
export { useCommonValidation } from "./useCommonValidation";
export { useMultiStepDialog } from "./useMultiStepDialog";
export { useZodForm } from "./useZodForm";
export { usePageBreadcrumbs } from "./usePageBreadcrumbs";
export { useFormSubmitHandler } from "./useFormSubmitHandler";
export { useFieldValidation } from "./useFieldValidation";
export { useEffectOnce } from "./useEffectOnce";

// Memory safe hooks
export * from "./useMemorySafe";

// Event listener hooks
export * from "./useOptimizedEventListeners";

// Responsive hooks - export both the main hook and common individual functions
export { 
  useResponsive,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useMediaQuery,
  useBreakpoint,
  useIsPortrait,
  useHasHover,
  usePrefersReducedMotion,
  usePrefersDarkMode
} from "./useResponsive";

// Re-export from use-keyboard-navigation
export * from "./use-keyboard-navigation";

// Re-export from use-form
export * from "./use-form";
