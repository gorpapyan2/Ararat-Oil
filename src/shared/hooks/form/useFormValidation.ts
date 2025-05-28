import { z } from "zod";
import type { UseFormProps } from "react-hook-form";

// These will be updated to import from the shared directory once migrated
// For now, we'll keep the relative imports to existing hooks
import { useZodForm } from "../../../hooks/useZodForm";
import { useFormSubmitHandler } from "../../../hooks/useFormSubmitHandler";
import { useCommonValidation } from "../../../hooks/useCommonValidation";
import { useFieldValidation } from "../../../hooks/useFieldValidation";
import { useFormSchemas } from "../../../hooks/useFormSchemas";

/**
 * Options for the form validation hook
 */
export interface UseFormValidationOptions<TSchema extends z.ZodSchema>
  extends Omit<UseFormProps<z.infer<TSchema>>, "resolver"> {
  /**
   * The Zod schema to validate against
   */
  schema: TSchema;

  /**
   * Function to handle form submission
   */
  onSubmit: (data: z.infer<TSchema>) => Promise<void> | void;

  /**
   * Additional options for the form submission handler
   */
  submitOptions?: {
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
  };
}

/**
 * A consolidated hook for form validation that integrates useZodForm and useFormSubmitHandler
 *
 * This hook provides a unified API for handling form validation and submission.
 *
 * @param options Configuration options including schema, default values, and submit handler
 * @returns An object containing form methods, submission handler, and loading state
 */
export function useFormValidation<TSchema extends z.ZodSchema>({
  schema,
  onSubmit,
  submitOptions,
  ...formOptions
}: UseFormValidationOptions<TSchema>) {
  // Set up the form with Zod validation
  const form = useZodForm({
    schema,
    ...formOptions,
  });

  // Set up the form submission handler and capture the typed submit handler
  const formHandler = useFormSubmitHandler(
    form,
    onSubmit as (data: z.infer<TSchema>) => Promise<void> | void,
    submitOptions
  );

  // Access validation utilities
  const validationUtils = {
    common: useCommonValidation(),
    fields: useFieldValidation(),
    schemas: useFormSchemas(),
  };

  // Return the form methods, submission handler, and validation utils
  return {
    form,
    isSubmitting: formHandler.isSubmitting,
    handleSubmit: formHandler.handleSubmit,
    validation: validationUtils,
  };
}

/**
 * Export individual hooks for users who need more granular control
 */
export {
  useZodForm,
  useFormSubmitHandler,
  useCommonValidation,
  useFieldValidation,
  useFormSchemas,
};
