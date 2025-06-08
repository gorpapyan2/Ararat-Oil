
import React from 'react';
import { useForm, FormProvider, FieldValues, UseFormReturn, DefaultValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/core/components/ui/primitives/button';
import { Form } from '@/core/components/ui/primitives/form';
import { cn } from '@/shared/utils';

interface StandardFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T) => Promise<boolean> | boolean;
  submitText?: string;
  className?: string;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function StandardForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  submitText = "Submit",
  className,
  children,
}: StandardFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: T) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
        <FormProvider {...form}>
          {children(form)}
        </FormProvider>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : submitText}
        </Button>
      </form>
    </Form>
  );
}
