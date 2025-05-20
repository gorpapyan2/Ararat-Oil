import { useState, useCallback } from "react";
import { useDialog } from "./useDialog";

interface UseMultiStepDialogOptions<T = any> {
  /**
   * Total number of steps in the multi-step dialog
   * @default 3
   */
  totalSteps?: number;
  
  /**
   * Initial open state of the dialog
   * @default false
   */
  defaultOpen?: boolean;
  
  /**
   * Initial step to show
   * @default 1
   */
  defaultStep?: number;
  
  /**
   * Initial form data
   * @default {}
   */
  defaultData?: Partial<T>;
  
  /**
   * Callback when the dialog is opened
   */
  onOpen?: () => void;
  
  /**
   * Callback when the dialog is closed
   */
  onClose?: () => void;
  
  /**
   * Callback when form data is updated
   */
  onDataChange?: (data: Partial<T>) => void;
  
  /**
   * Callback when all steps are completed and final submission happens
   */
  onComplete?: (data: T) => void | Promise<void>;
}

/**
 * A hook for managing multi-step dialogs
 */
export function useMultiStepDialog<T = any>({
  totalSteps = 3,
  defaultOpen = false,
  defaultStep = 1,
  defaultData = {} as Partial<T>,
  onOpen,
  onClose,
  onDataChange,
  onComplete,
}: UseMultiStepDialogOptions<T> = {}) {
  // Use the base dialog hook
  const dialog = useDialog({ defaultOpen });
  
  // Step management
  const [currentStep, setCurrentStep] = useState(defaultStep);
  
  // Form data management
  const [formData, setFormData] = useState<Partial<T>>(defaultData);
  
  // Loading state for final submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Progress percentage (0-100)
   */
  const progress = Math.round((currentStep / totalSteps) * 100);
  
  /**
   * Move to the next step if not at the last step
   */
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, totalSteps]);
  
  /**
   * Move to the previous step if not at the first step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);
  
  /**
   * Go to a specific step
   */
  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);
  
  /**
   * Update form data
   */
  const updateFormData = useCallback((data: Partial<T>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...data };
      onDataChange?.(newData);
      return newData;
    });
  }, [onDataChange]);
  
  /**
   * Reset the dialog state
   */
  const reset = useCallback(() => {
    setCurrentStep(defaultStep);
    setFormData(defaultData);
    setIsSubmitting(false);
  }, [defaultStep, defaultData]);
  
  /**
   * Handle dialog open
   */
  const open = useCallback(() => {
    dialog.open();
    onOpen?.();
  }, [dialog, onOpen]);
  
  /**
   * Handle dialog close
   */
  const close = useCallback(() => {
    dialog.close();
    onClose?.();
    // Optional: could defer the reset to after animation completes
    setTimeout(reset, 300);
  }, [dialog, onClose, reset]);
  
  /**
   * Handle dialog open change
   */
  const onOpenChange = useCallback((open: boolean) => {
    dialog.onOpenChange(open);
    if (!open) {
      onClose?.();
      // Optional: could defer the reset to after animation completes
      setTimeout(reset, 300);
    } else {
      onOpen?.();
    }
  }, [dialog, onOpen, onClose, reset]);
  
  /**
   * Complete all steps and submit the form
   */
  const complete = useCallback(async () => {
    if (onComplete) {
      setIsSubmitting(true);
      try {
        await onComplete(formData as T);
      } finally {
        setIsSubmitting(false);
        close();
      }
    } else {
      close();
    }
  }, [onComplete, formData, close]);
  
  /**
   * Check if a step is complete
   */
  const isStepComplete = useCallback((step: number) => {
    return step < currentStep;
  }, [currentStep]);
  
  /**
   * Check if a step is the current step
   */
  const isCurrentStep = useCallback((step: number) => {
    return step === currentStep;
  }, [currentStep]);
  
  /**
   * Get the status of a step
   */
  const getStepStatus = useCallback((step: number) => {
    if (step < currentStep) return "complete";
    if (step === currentStep) return "current";
    return "pending";
  }, [currentStep]);
  
  return {
    // Base dialog properties
    isOpen: dialog.isOpen,
    open,
    close,
    onOpenChange,
    triggerRef: dialog.triggerRef,
    
    // Step management
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    progress,
    isStepComplete,
    isCurrentStep,
    getStepStatus,
    
    // Form data management
    formData,
    updateFormData,
    
    // Submission
    isSubmitting,
    setIsSubmitting,
    complete,
    
    // Misc
    reset,
  };
} 