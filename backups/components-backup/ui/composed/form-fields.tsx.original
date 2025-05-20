import * as React from "react";
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input, type InputProps } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ControllerRenderProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Path } from "react-hook-form";

// Common props for all form fields
interface FormFieldBaseProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  form: UseFormReturn<TFieldValues>;
  className?: string;
}

// FormInput component
export interface FormInputProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  type?: InputProps["type"];
  placeholder?: string;
  autoComplete?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function FormInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  type = "text",
  placeholder,
  autoComplete,
  className,
  inputClassName,
  disabled,
}: FormInputProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              className={inputClassName}
              value={field.value || ""}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormSelect component
export interface FormSelectProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  options: { value: string; label: string; colorClass?: string }[];
  placeholder?: string;
  selectClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  onChange?: (value: string) => void;
  renderOption?: (option: { value: string; label: string; colorClass?: string }) => React.ReactNode;
}

export function FormSelect<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  options,
  placeholder = "Select an option",
  className,
  selectClassName,
  contentClassName,
  itemClassName,
  onChange,
  renderOption,
}: FormSelectProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              onChange?.(value);
            }} 
            value={field.value || ""}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className={selectClassName}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className={contentClassName}>
              {options.map(option => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                  className={itemClassName}
                >
                  {renderOption ? renderOption(option) : option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormCheckbox component
export interface FormCheckboxProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  disabled?: boolean;
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  className,
  disabled = false,
}: FormCheckboxProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}

// FormTextarea component
export interface FormTextareaProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  placeholder?: string;
  rows?: number;
  textareaClassName?: string;
}

export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  placeholder,
  rows,
  className,
  textareaClassName,
}: FormTextareaProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              className={textareaClassName}
              value={field.value || ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormSwitch component
export interface FormSwitchProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  switchLabel: string;
}

export function FormSwitch<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  switchLabel,
  className,
}: FormSwitchProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between space-y-0", className)}>
          <div className="space-y-0.5">
            {label && <FormLabel>{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
          </div>
          <FormControl>
            <div className="flex items-center space-x-2">
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <span className="text-sm text-muted-foreground">{switchLabel}</span>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormRadioGroup component
export interface FormRadioGroupProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  options: { value: string; label: string }[];
  orientation?: "horizontal" | "vertical";
}

export function FormRadioGroup<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  options,
  orientation = "vertical",
  className,
}: FormRadioGroupProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              className={orientation === "horizontal" ? "flex space-x-4" : "space-y-1"}
            >
              {options.map(option => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} />
                  <FormLabel className="font-normal">{option.label}</FormLabel>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormCurrencyInput component
export interface FormCurrencyInputProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  placeholder?: string;
  symbol?: string;
  inputClassName?: string;
  disabled?: boolean;
}

export function FormCurrencyInput<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  placeholder,
  symbol = "֏",
  className,
  inputClassName,
  disabled,
}: FormCurrencyInputProps<TFieldValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <CurrencyInput
              value={field.value || 0}
              onChange={field.onChange}
              placeholder={placeholder}
              symbol={symbol}
              onBlur={field.onBlur}
              name={field.name}
              className={inputClassName}
              disabled={disabled}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormDatePicker component
export interface FormDatePickerProps<TFieldValues extends FieldValues> extends FormFieldBaseProps<TFieldValues> {
  placeholder?: string;
  disabled?: (date: Date) => boolean;
  buttonClassName?: string;
}

export function FormDatePicker<TFieldValues extends FieldValues>({
  name,
  label,
  description,
  form,
  placeholder = "Select date",
  disabled,
  className,
  buttonClassName,
}: FormDatePickerProps<TFieldValues>) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                    buttonClassName
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder}</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  setIsOpen(false);
                }}
                disabled={disabled}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// FormField - For custom field rendering while maintaining form structure
interface CustomFormFieldProps<T extends Record<string, any>> {
  name: string;
  label: string;
  form: UseFormReturn<T>;
  description?: string | React.ReactNode;
  className?: string;
  render: (field: ControllerRenderProps<T>) => React.ReactNode;
}

export function CustomFormField<T extends Record<string, any>>({
  name,
  label,
  form,
  description,
  className,
  render,
}: CustomFormFieldProps<T>) {
  return (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <Controller
        control={form.control}
        name={name as Path<T>}
        render={({ field, fieldState }) => (
          <>
            <FormControl>
              {render(field)}
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            {fieldState.error && (
              <FormMessage>{fieldState.error.message}</FormMessage>
            )}
          </>
        )}
      />
    </FormItem>
  );
} 