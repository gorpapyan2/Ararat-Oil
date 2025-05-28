import { useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { useToast } from "@/shared/hooks/ui";

/**
 * Options for form submission handler
 */
export interface UseFormSubmitHandlerOptions {
  /**
   * Custom success message to show after submission
   */
  successMessage?: string;

  /**
   * Custom error message to show when submission fails
   */
  errorMessage?: string;

  /**
   * Whether to reset the form after successful submission
   */
  resetOnSuccess?: boolean;

  /**
   * Callback to run after successful submission but before toast
   */
  onSuccess?: () => void;

  /**
   * Callback to run when submission fails but before toast
   */
  onError?: (error: Error) => void;

  /**
   * Whether to show success toasts
   */
  showSuccessToast?: boolean;

  /**
   * Whether to show error toasts
   */
  showErrorToast?: boolean;
}

/**
 * A utility function to create a form submission handler with loading state and error handling.
 *
 * @param form The react-hook-form methods
 * @param onSubmit The function to call when the form is submitted
 * @param options Additional options for form submission
 * @returns A submit handler with loading state
 *
 * @example
 * ```tsx
 * const form = useZodForm({ schema });
 * const formHandler = useFormSubmitHandler(form, async (data) => {
 *   await saveData(data);
 * }, {
 *   successMessage: "Data saved successfully",
 *   resetOnSuccess: true
 * });
 * ```
 */
export function useFormSubmitHandler<TData extends FieldValues>(
  form: UseFormReturn<TData>,
  onSubmit: (data: TData) => Promise<void> | void,
  options: UseFormSubmitHandlerOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);

      // Run success callback
      options.onSuccess?.();

      // Show success toast if enabled
      if (options.showSuccessToast !== false && options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
        });
      }

      // Reset form if requested
      if (options.resetOnSuccess) {
        form.reset();
      }
    } catch (error) {
      console.error("Form submission error:", error);

      // Run error callback
      options.onError?.(error as Error);

      // Show error toast if enabled
      if (options.showErrorToast !== false) {
        toast({
          title: "Error",
          description:
            options.errorMessage ||
            (error as Error).message ||
            "An error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return {
    handleSubmit,
    isSubmitting,
  };
}
