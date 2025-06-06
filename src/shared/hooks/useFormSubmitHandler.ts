import { useState, useCallback } from "react";
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { useToast } from "@/hooks";
import { useTranslation } from "react-i18next";

/**
 * Options for the form submission handler
 */
export interface UseFormSubmitHandlerOptions {
  /**
   * Custom success message to show when form submission is successful
   */
  successMessage?: string;

  /**
   * Custom error message to show when form submission fails
   */
  errorMessage?: string;

  /**
   * Whether to reset the form after successful submission
   */
  resetOnSuccess?: boolean;

  /**
   * Optional callback to run after success but before toast
   */
  onSuccess?: () => void;

  /**
   * Optional callback to run on error but before toast
   */
  onError?: (error: Error) => void;

  /**
   * Whether to show a success toast notification
   */
  showSuccessToast?: boolean;

  /**
   * Whether to show an error toast notification
   */
  showErrorToast?: boolean;
}

/**
 * A hook to handle form submission with loading state, error handling, and toast notifications
 *
 * @param form The form instance from useForm or useZodForm
 * @param onSubmit The async function to call when the form is submitted
 * @param options Additional options for controlling the submission behavior
 * @returns An object containing the loading state and a handleSubmit function
 */
export function useFormSubmitHandler<TFormValues extends FieldValues>(
  form: UseFormReturn<TFormValues>,
  onSubmit: (data: TFormValues) => Promise<void> | void,
  options: UseFormSubmitHandlerOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    successMessage = t("common.formSubmitSuccess"),
    errorMessage = t("common.unknownError"),
    resetOnSuccess = false,
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const clearError = useCallback(() => {
    setFormError(null);
  }, []);

  const submitHandler = useCallback(
    async (data: TFormValues) => {
      setIsSubmitting(true);
      setFormError(null);

      try {
        await onSubmit(data);

        if (onSuccess) {
          onSuccess();
        }

        if (resetOnSuccess) {
          form.reset();
        }

        if (showSuccessToast) {
          toast({
            title: successMessage,
            variant: "success",
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);

        const errorMessage =
          error instanceof Error
            ? error.message
            : typeof error === "string"
              ? error
              : t("common.unknownError");

        setFormError(errorMessage);

        if (onError && error instanceof Error) {
          onError(error);
        }

        if (showErrorToast) {
          toast({
            title: t("common.formSubmitError"),
            description: errorMessage,
            variant: "destructive",
          });
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      onSubmit,
      resetOnSuccess,
      form,
      successMessage,
      onSuccess,
      onError,
      showSuccessToast,
      showErrorToast,
      toast,
      t,
    ]
  );

  const handleSubmit = useCallback(() => {
    return form.handleSubmit(submitHandler);
  }, [form, submitHandler]);

  return {
    isSubmitting,
    formError,
    setFormError,
    handleSubmit: handleSubmit(),
    clearError,
  };
}
