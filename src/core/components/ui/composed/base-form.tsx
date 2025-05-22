/**
 * Base form components for standardizing form implementations
 * This file provides shared form patterns to reduce duplication across the codebase
 */
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField as PrimitiveFormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/core/components/ui/primitives/form';
import { Button } from '@/core/components/ui/primitives/button';
import { cn } from '@/utils/cn';
import type { StandardFormComponentProps, FormRowProps } from '../types/form-types';

/**
 * Props for StandardForm component
 */
export interface StandardFormProps<TSchema extends z.ZodType<any, any>> 
  extends StandardFormComponentProps<TSchema> {
  /** Children render prop receiving form methods */
  children: React.ReactNode | ((methods: ReturnType<typeof useForm>) => React.ReactNode);
  /** Optional footer with submit/cancel buttons */
  footer?: React.ReactNode;
  /** Submit button text */
  submitText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Class name for the form */
  className?: string;
  /** Class name for the form wrapper */
  wrapperClassName?: string;
  /** Is the form submitting */
  isSubmitting?: boolean;
  /** Callback for cancel button */
  onCancel?: () => void;
  /** Form ID */
  id?: string;
}

/**
 * Standardized form component that handles common form patterns
 * Reduces duplication across form implementations
 */
export function StandardForm<TSchema extends z.ZodType<any, any>>({
  schema,
  defaultValues,
  onSubmit,
  children,
  footer,
  submitText = 'Submit',
  cancelText = 'Cancel',
  className,
  wrapperClassName,
  isSubmitting,
  onCancel,
  id,
  formOptions = {},
}: StandardFormProps<TSchema>) {
  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
    ...formOptions,
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  });

  return (
    <div className={cn('space-y-4', wrapperClassName)}>
      <FormProvider {...form}>
        <Form {...form}>
          <form 
            id={id} 
            className={cn('space-y-4', className)} 
            onSubmit={handleSubmit}
          >
            {typeof children === 'function' ? children(form) : children}
            
            {footer || (
              <div className="flex justify-end space-x-2">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    {cancelText}
                  </Button>
                )}
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {submitText}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}

/**
 * Standardized form row component for consistent layout
 */
export function FormRow({
  label,
  description,
  required,
  children,
  className,
}: FormRowProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <div className="flex items-center">
          <span className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </span>
        </div>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}

// Re-export primitive form components for convenience and consistency
export { 
  PrimitiveFormField as FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
}; 