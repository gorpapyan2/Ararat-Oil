/**
 * Core form field components
 * These components wrap React Hook Form with standardized UI elements
 */
import React from 'react';
import { 
  UseFormReturn, 
  Controller,
  FieldPath,
  FieldValues
} from 'react-hook-form';
import { cn } from '@/utils/cn';
import { Calendar } from "@/core/components/ui/primitives/calendar";
import { format } from 'date-fns';

interface FormItemProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const FormItem = ({
  label,
  description,
  error,
  required,
  className,
  children,
}: FormItemProps & { children: React.ReactNode }) => {
  const id = React.useId();
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

// Basic text input field
export interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  type?: string;
  placeholder?: string;
}

export function FormInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  type = "text",
  placeholder,
  className,
}: FormInputProps<TFieldValues, TName>) {
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error}
      required={required}
      className={className}
    >
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md"
        {...register(name)}
      />
    </FormItem>
  );
}

// Select dropdown
export interface FormSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function FormSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  options,
  placeholder,
  className,
}: FormSelectProps<TFieldValues, TName>) {
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error}
      required={required}
      className={className}
    >
      <select
        id={name}
        className="w-full px-3 py-2 border rounded-md"
        {...register(name)}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormItem>
  );
}

// Checkbox field
export interface FormCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
}

export function FormCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  className,
}: FormCheckboxProps<TFieldValues, TName>) {
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      error={error}
      className={cn("flex items-start space-x-2 space-y-0", className)}
    >
      <div className="flex h-5 items-center">
        <input
          id={name}
          type="checkbox"
          className="h-4 w-4 rounded border"
          {...register(name)}
        />
      </div>
      <div className="space-y-1 leading-none">
        {label && (
          <label htmlFor={name} className="text-sm font-medium">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </FormItem>
  );
}

// Textarea field
export interface FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  placeholder?: string;
  rows?: number;
}

export function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  placeholder,
  rows = 4,
  className,
}: FormTextareaProps<TFieldValues, TName>) {
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error}
      required={required}
      className={className}
    >
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded-md resize-y"
        {...register(name)}
      />
    </FormItem>
  );
}

// Date picker
export interface FormDatePickerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  placeholder?: string;
}

export function FormDatePicker<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  placeholder,
  className,
}: FormDatePickerProps<TFieldValues, TName>) {
  const { control, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error}
      required={required} 
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <input
              id={name}
              value={field.value ? format(field.value, 'PP') : ''}
              placeholder={placeholder}
              className="w-full px-3 py-2 border rounded-md"
              readOnly
              onClick={() => {/* Open date picker */}}
            />
            <div className="absolute top-full left-0 z-10 mt-1 hidden">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </div>
          </div>
        )}
      />
    </FormItem>
  );
}

// Currency input
export interface FormCurrencyInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  placeholder?: string;
  symbol?: string;
}

export function FormCurrencyInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  placeholder,
  symbol = "$",
  className,
}: FormCurrencyInputProps<TFieldValues, TName>) {
  const { control, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error} 
      required={required}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">{symbol}</span>
            </div>
            <input
              id={name}
              type="number"
              placeholder={placeholder}
              className="w-full pl-7 pr-3 py-2 border rounded-md"
              value={field.value ?? ''}
              onChange={(e) => {
                const value = e.target.value === '' ? undefined : parseFloat(e.target.value);
                field.onChange(value);
              }}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </FormItem>
  );
}

// Radio group
export interface FormRadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  options: { value: string; label: string }[];
  orientation?: 'horizontal' | 'vertical';
}

export function FormRadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  required,
  options,
  orientation = 'horizontal',
  className,
}: FormRadioGroupProps<TFieldValues, TName>) {
  const { register, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error} 
      required={required}
      className={className}
    >
      <div 
        className={cn(
          "space-y-2",
          orientation === 'horizontal' && "flex space-x-6 space-y-0"
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <input
              id={`${name}-${option.value}`}
              type="radio"
              value={option.value}
              className="h-4 w-4"
              {...register(name)}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="ml-2 text-sm font-medium"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </FormItem>
  );
}

// Switch toggle
export interface FormSwitchProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends FormItemProps {
  name: TName;
  form: UseFormReturn<TFieldValues>;
  switchLabel?: string;
}

export function FormSwitch<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  form,
  label,
  description,
  switchLabel,
  className,
}: FormSwitchProps<TFieldValues, TName>) {
  const { control, formState: { errors } } = form;
  const error = errors[name]?.message as string | undefined;
  
  return (
    <FormItem 
      label={label} 
      description={description} 
      error={error}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center space-x-2">
            <div 
              role="checkbox"
              aria-checked={field.value}
              tabIndex={0}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                field.value ? "bg-primary" : "bg-gray-300"
              )}
              onClick={() => field.onChange(!field.value)}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  field.onChange(!field.value);
                }
              }}
            >
              <span 
                className={cn(
                  "inline-block h-4 w-4 rounded-full bg-gray-50 transition-transform",
                  field.value ? "translate-x-6" : "translate-x-1"
                )}
              />
            </div>
            {switchLabel && (
              <span className="text-sm font-medium">{switchLabel}</span>
            )}
          </div>
        )}
      />
    </FormItem>
  );
} 