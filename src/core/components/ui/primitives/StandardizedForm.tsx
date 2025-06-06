import { ReactNode } from "react";
import { UseFormReturn, SubmitHandler, FormProvider } from "react-hook-form";

/**
 * StandardizedForm - A wrapper component that automatically includes FormProvider
 *
 * This component ensures that all form fields can access the form context.
 * Use this component instead of creating form elements manually to avoid
 * the "Cannot destructure property 'getFieldState' of 'useFormContext(...)' as it is null" error.
 *
 * @example
 * ```tsx
 * const form = useZodForm({
 *   schema: mySchema,
 *   defaultValues: { name: "" }
 * });
 *
 * return (
 *   <StandardizedForm
 *     form={form}
 *     onSubmit={(data) => console.log(data)}
 *     className="space-y-4"
 *   >
 *     <FormInput name="name" label="Name" form={form} />
 *     <Button type="submit">Submit</Button>
 *   </StandardizedForm>
 * );
 * ```
 */
interface StandardizedFormProps<T extends Record<string, unknown>> {
  /** The form instance from useZodForm or useForm */
  form: UseFormReturn<T>;

  /** The submit handler function */
  onSubmit: SubmitHandler<T>;

  /** Children elements to render inside the form */
  children: ReactNode;

  /** Additional class names to apply to the form element */
  className?: string;

  /** Any additional props to pass to the form element */
  [key: string]: unknown;
}

export function StandardizedForm<T extends Record<string, unknown>>({
  form,
  onSubmit,
  children,
  className = "",
  ...props
}: StandardizedFormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
}
