// Dialog hooks
export {
  useDialog,
  useConfirmDialog,
  useAlertDialog,
  useMultiStepDialog,
  useConfirmationDialog,
  useLoginDialog,
} from "./useDialog";

// Entity-specific dialog hooks
export { useEmployeeDialog } from "./useEmployeeDialog";
export { useSalesDialog } from "./useSalesDialog";
export { useTankDialog } from "./useTankDialog";
export { useProfileDialog } from "./useProfileDialog";

// Form hooks
export { useZodForm, useFormSubmitHandler } from "./use-form";

// Toast hooks
export {
  useToast,
  toast,
  success,
  error,
  warning,
  info,
  dismiss,
} from "./use-toast";

// Export API hooks
export * from "./api";
