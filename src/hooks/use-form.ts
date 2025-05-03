import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormProps, UseFormReturn, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

/**
 * Props for useZodForm hook
 */
interface UseZodFormProps<TSchema extends z.ZodType> extends Omit<UseFormProps<z.infer<TSchema>>, "resolver"> {
  schema: TSchema;
}

/**
 * A hook that combines React Hook Form with Zod schema validation
 */
export function useZodForm<TSchema extends z.ZodType>({ 
  schema, 
  ...formProps 
}: UseZodFormProps<TSchema>): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...formProps,
    resolver: zodResolver(schema),
  });
}

/**
 * Options for useFormSubmitHandler hook
 */
interface UseFormSubmitHandlerOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * A hook that handles form submission with loading state
 */
export function useFormSubmitHandler<TFormValues>(
  form: UseFormReturn<TFormValues>,
  onSubmit: SubmitHandler<TFormValues>,
  options: UseFormSubmitHandlerOptions = {}
) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: SubmitHandler<TFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      options.onSuccess?.();
    } catch (error) {
      options.onError?.(error instanceof Error ? error : new Error("An unknown error occurred"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitHandler = form.handleSubmit(handleSubmit);

  return {
    isSubmitting,
    onSubmit: onSubmitHandler,
  };
}

/**
 * A hook that combines useZodForm and useFormSubmitHandler
 */
export function useZodFormWithSubmit<TSchema extends z.ZodType>({
  schema,
  onSubmit,
  options,
  ...formProps
}: UseZodFormProps<TSchema> & {
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  options?: UseFormSubmitHandlerOptions;
}) {
  const form = useZodForm({ schema, ...formProps });
  const { isSubmitting, onSubmit: handleSubmit } = useFormSubmitHandler(form, onSubmit, options);

  return {
    form,
    isSubmitting,
    onSubmit: handleSubmit,
  };
} 