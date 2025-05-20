import * as React from 'react';
import { cn } from '@/utils/cn';
import { 
  useForm, 
  UseFormReturn, 
  FieldValues, 
  SubmitHandler, 
  UseFormProps,
  FieldPath,
  FieldErrors,
  Controller,
  ControllerProps,
  ControllerRenderProps
} from 'react-hook-form';
import { Label } from '@/core/components/ui/label';
import { Input } from "@/core/components/ui/primitives/input";
import { Checkbox } from '@/core/components/ui/checkbox';
import { RadioGroup } from '@/core/components/ui/radiogroup';
import { Select } from "@/core/components/ui/primitives/select";
import { Textarea } from '@/core/components/ui/textarea';

/**
 * Base props for all Form Field components
 */
interface FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  name: TName;
  form: UseFormReturn<TFieldValues>;
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

/**
 * Form component that provides context for form fields
 */
const Form = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
>({
  children,
  className,
  onSubmit,
  formProps,
  form,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onSubmit?: SubmitHandler<TFieldValues>;
  formProps?: UseFormProps<TFieldValues, TContext>;
  form?: UseFormReturn<TFieldValues>;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit">) => {
  // Create form if not provided
  const formInstance = form || useForm<TFieldValues>({ ...formProps });
  
  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={onSubmit ? formInstance.handleSubmit(onSubmit) : undefined}
      {...props}
    >
      {children}
    </form>
  );
};

/**
 * FormField component that provides context for form control components
 */
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  children,
}: {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  children: React.ReactNode;
}) => {
  return (
    <FormFieldContext.Provider value={{ name, form }}>
      {children}
    </FormFieldContext.Provider>
  );
};

/**
 * Hook to get the current form field context
 */
const useFormField = () => {
  const context = React.useContext(FormFieldContext);
  if (!context) {
    throw new Error("useFormField must be used within a FormField");
  }
  return context;
};

/**
 * FormItem component for grouping a label, input, and error message
 */
interface FormItemProps {
  children: React.ReactNode;
  className?: string;
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    );
  }
);
FormItem.displayName = "FormItem";

/**
 * FormLabel component for labeling form controls
 */
interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof Label> {
  optional?: boolean;
}

const FormLabel = React.forwardRef<React.ElementRef<typeof Label>, FormLabelProps>(
  ({ className, optional, children, ...props }, ref) => {
    return (
      <Label
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
        {optional && <span className="ml-1 text-muted-foreground text-xs">(Optional)</span>}
      </Label>
    );
  }
);
FormLabel.displayName = "FormLabel";

/**
 * FormDescription component for providing additional context
 */
interface FormDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const FormDescription = React.forwardRef<HTMLParagraphElement, FormDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
FormDescription.displayName = "FormDescription";

/**
 * FormMessage component for displaying validation errors
 */
interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: FieldErrors;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, error, ...props }, ref) => {
    const { name, form } = useFormField();
    const fieldError = error || form.formState.errors[name];
    const message = fieldError?.message as string | undefined;

    if (!message && !children) {
      return null;
    }

    return (
      <p
        ref={ref}
        className={cn("text-xs font-medium text-destructive", className)}
        {...props}
      >
        {children || message}
      </p>
    );
  }
);
FormMessage.displayName = "FormMessage";

/**
 * FormControl component for managing form control state
 */
interface FormControlProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  children: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode;
  render?: (props: { field: ControllerRenderProps<TFieldValues, TName> }) => React.ReactNode;
}

const FormControl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  render,
}: FormControlProps<TFieldValues, TName>) => {
  const { name, form } = useFormField() as FormFieldContextValue<TFieldValues, TName>;
  
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field }) => ((render || children)({ field }))}
    />
  );
};

/**
 * Form component with all its subcomponents
 */
const FormRoot = Object.assign(Form, {
  Field: FormField,
  Item: FormItem,
  Label: FormLabel,
  Control: FormControl,
  Description: FormDescription,
  Message: FormMessage,
  useFormField,
});

export { FormRoot as Form };
