import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn, FieldValues } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

interface UseZodFormProps<TSchema extends z.ZodType, TFieldValues extends FieldValues> extends Omit<UseFormProps<TFieldValues>, "resolver"> {
  schema: TSchema;
}

/**
 * A hook that integrates React Hook Form with Zod validation.
 * 
 * @param props The form props including the Zod schema
 * @returns A React Hook Form useForm instance with Zod validation
 * 
 * @example
 * ```tsx
 * const formSchema = z.object({
 *   email: z.string().email("Please enter a valid email"),
 *   password: z.string().min(8, "Password must be at least 8 characters"),
 * });
 * 
 * const form = useZodForm({
 *   schema: formSchema,
 *   defaultValues: {
 *     email: "",
 *     password: "",
 *   },
 * });
 * ```
 */
export function useZodForm<
  TSchema extends z.ZodType,
  TFieldValues extends z.infer<TSchema> = z.infer<TSchema>
>({
  schema,
  ...formProps
}: UseZodFormProps<TSchema, TFieldValues>): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    ...formProps,
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
      options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting,
  };
} 