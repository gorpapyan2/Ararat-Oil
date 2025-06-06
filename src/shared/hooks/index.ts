/**
 * Optimized hooks index for better tree-shaking
 * Using selective exports to reduce bundle size
 */

// Base hooks
export * from "./base";

// Form hooks
export * from "./form";

// Individual hooks that exist
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

// Memory optimization hooks - export all functions
export * from "./useMemorySafe";
export * from "./useOptimizedEventListeners";

// Responsive hooks
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

// Keyboard navigation
export { useKeyboardNavigation } from "./use-keyboard-navigation";

// API and UI directories
export * from "./api";
export * from "./ui";
