import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  UseFormProps,
  UseFormReturn,
  FieldValues,
} from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

/**
 * Options for the useZodForm hook
 */
interface UseZodFormOptions<TSchema extends z.ZodSchema>
  extends Omit<UseFormProps<z.infer<TSchema>>, "resolver"> {
  /**
   * The Zod schema to validate against
   */
  schema: TSchema;
}

/**
 * A hook that integrates react-hook-form with Zod validation
 *
 * @param options Configuration options including schema and form options
 * @returns The react-hook-form methods with Zod validation
 */
export function useZodForm<TSchema extends z.ZodSchema>({
  schema,
  ...formOptions
}: UseZodFormOptions<TSchema>): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...formOptions,
    resolver: zodResolver(schema),
  });
}

/**
 * A utility function to create a form submission handler with loading state and error handling.
 *
 * @param onSubmit The function to call when the form is submitted
 * @param options Additional options for form submission
 * @returns A submit handler with loading state
 *
 * @example
 * ```tsx
 * const handleSubmit = useFormSubmitHandler(async (data) => {
 *   await saveData(data);
 *   toast.success("Data saved successfully");
 * }, {
 *   onError: (error) => {
 *     toast.error(error.message || "An error occurred");
 *   }
 * });
 * ```
 */
export function useFormSubmitHandler<TData>(
  onSubmit: (data: TData) => Promise<void> | void,
  options?: {
    onError?: (error: Error) => void;
    onSuccess?: () => void;
  }
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: TData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      options?.onSuccess?.();
    } catch (error) {
      options?.onError?.(
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
}
