/**
 * Core form field components
 * These components wrap React Hook Form with standardized UI elements
 */
import React from "react";
import {
  UseFormReturn,
  Controller,
  FieldPath,
  FieldValues,
  ControllerRenderProps,
} from "react-hook-form";
import { cn } from "@/shared/utils/cn";
import { Calendar } from "@/core/components/ui/primitives/calendar";
import { format } from "date-fns";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { Label } from "@/core/components/ui/primitives/label";
import { Input } from "@/core/components/ui/primitives/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem as PrimitiveFormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";

interface FormItemProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Rename the local FormItem to LegacyFormItem to avoid conflict
export const LegacyFormItem = ({
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
        <label htmlFor={id} className="block text-sm font-medium">
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

// Create a base field component to reduce duplication
function BaseFormField({
  name,
  label,
  placeholder,
  description,
  type = "text",
  className,
  fieldClassName,
  labelClassName,
  renderInput,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  renderInput?: (field: ControllerRenderProps<FieldValues>) => React.ReactNode;
  required?: boolean;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <PrimitiveFormItem className={cn("space-y-2", className)}>
          <FormLabel className={cn(labelClassName)}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            {renderInput ? (
              renderInput(field)
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                className={cn(fieldClassName)}
                {...field}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </PrimitiveFormItem>
      )}
    />
  );
}

// Use the base field for all specific implementations
export function TextField({
  name,
  label,
  placeholder,
  description,
  className,
  fieldClassName,
  labelClassName,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  required?: boolean;
}) {
  return (
    <BaseFormField
      name={name}
      label={label}
      placeholder={placeholder}
      description={description}
      className={className}
      fieldClassName={fieldClassName}
      labelClassName={labelClassName}
      required={required}
    />
  );
}

export function PasswordField({
  name,
  label,
  placeholder,
  description,
  className,
  fieldClassName,
  labelClassName,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  required?: boolean;
}) {
  return (
    <BaseFormField
      name={name}
      label={label}
      placeholder={placeholder}
      description={description}
      type="password"
      className={className}
      fieldClassName={fieldClassName}
      labelClassName={labelClassName}
      required={required}
    />
  );
}

export function EmailField({
  name,
  label,
  placeholder,
  description,
  className,
  fieldClassName,
  labelClassName,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  required?: boolean;
}) {
  return (
    <BaseFormField
      name={name}
      label={label}
      placeholder={placeholder}
      description={description}
      type="email"
      className={className}
      fieldClassName={fieldClassName}
      labelClassName={labelClassName}
      required={required}
    />
  );
}

// Preserve original exports but reduce code duplication
export function NumberField({
  name,
  label,
  placeholder,
  description,
  className,
  fieldClassName,
  labelClassName,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  className?: string;
  fieldClassName?: string;
  labelClassName?: string;
  required?: boolean;
}) {
  return (
    <BaseFormField
      name={name}
      label={label}
      placeholder={placeholder}
      description={description}
      type="number"
      className={className}
      fieldClassName={fieldClassName}
      labelClassName={labelClassName}
      required={required}
    />
  );
}

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
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
    </LegacyFormItem>
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
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
    </LegacyFormItem>
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
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
    </LegacyFormItem>
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
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
    </LegacyFormItem>
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
  /**
   * @deprecated Use FormStandardDatePicker instead
   * Format string for displaying the date
   * @default "PP" (e.g., "Apr 29, 2021")
   */
  dateFormat?: string;
}

/**
 * @deprecated Use FormStandardDatePicker instead
 */
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
  dateFormat = "PP",
  className,
}: FormDatePickerProps<TFieldValues, TName>) {
  // Use state to handle dynamic import
  const [DatePickerComponent, setDatePickerComponent] = React.useState<React.ComponentType<Record<string, unknown>> | null>(null);

  React.useEffect(() => {
    // Dynamic import to avoid circular dependencies
    import("@/shared/components/common/datepicker")
      .then((module) => {
        setDatePickerComponent(() => module.FormStandardDatePicker);
      })
      .catch((error) => {
        console.error("Failed to load DatePicker component:", error);
      });
  }, []);

  // Log deprecation warning
  React.useEffect(() => {
    console.warn(
      "FormDatePicker is deprecated and will be removed in a future version. " +
        "Please use FormStandardDatePicker from @/shared/components/common/datepicker instead."
    );
  }, []);

  if (!DatePickerComponent) {
    // Loading fallback
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <DatePickerComponent
      name={name}
      control={form.control}
      label={label}
      description={description}
      required={required}
      placeholder={placeholder}
      dateFormat={dateFormat}
      className={className}
    />
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
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
              value={field.value ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? undefined
                    : parseFloat(e.target.value);
                field.onChange(value);
              }}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </LegacyFormItem>
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
  orientation?: "horizontal" | "vertical";
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
  orientation = "horizontal",
  className,
}: FormRadioGroupProps<TFieldValues, TName>) {
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      <div
        className={cn(
          "space-y-2",
          orientation === "horizontal" && "flex space-x-6 space-y-0"
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
    </LegacyFormItem>
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
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
                if (e.key === " " || e.key === "Enter") {
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
    </LegacyFormItem>
  );
}

// Re-export the FormProvider for convenience
export { FormProvider };

// Simplified versions for any form types
export interface SimpleFormCurrencyInputProps extends FormItemProps {
  name: string;
  form: UseFormReturn<FieldValues>;
  placeholder?: string;
  symbol?: string;
}

export function SimpleFormCurrencyInput({
  name,
  form,
  label,
  description,
  required,
  placeholder,
  symbol = "$",
  className,
}: SimpleFormCurrencyInputProps) {
  const {
    control,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
              value={field.value ?? ""}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? undefined
                    : parseFloat(e.target.value);
                field.onChange(value);
              }}
              onBlur={field.onBlur}
            />
          </div>
        )}
      />
    </LegacyFormItem>
  );
}

export interface SimpleFormSelectProps extends FormItemProps {
  name: string;
  form: UseFormReturn<FieldValues>;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SimpleFormSelect({
  name,
  form,
  label,
  description,
  required,
  options,
  placeholder,
  className,
}: SimpleFormSelectProps) {
  const {
    register,
    formState: { errors },
  } = form;
  const error = errors[name]?.message as string | undefined;

  return (
    <LegacyFormItem
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
    </LegacyFormItem>
  );
}
