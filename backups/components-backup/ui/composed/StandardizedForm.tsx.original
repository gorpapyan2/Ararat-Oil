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
interface StandardizedFormProps<TFieldValues extends Record<string, any>> {
  /** The form instance from useZodForm or useForm */
  form: UseFormReturn<TFieldValues>;
  
  /** The submit handler function */
  onSubmit: SubmitHandler<TFieldValues>;
  
  /** Children elements to render inside the form */
  children: ReactNode;
  
  /** Additional class names to apply to the form element */
  className?: string;
  
  /** Any additional props to pass to the form element */
  [key: string]: any;
}

export function StandardizedForm<TFieldValues extends Record<string, any>>({
  form,
  onSubmit,
  children,
  className = "",
  ...props
}: StandardizedFormProps<TFieldValues>) {
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