
import { z } from "zod";
import {
  FieldValues,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldPath,
  RegisterOptions,
  Control,
  FieldErrors,
} from "react-hook-form";
import { ReactNode } from "react";

export interface BaseFieldProps<TFieldValues extends FieldValues = FieldValues> {
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
  validation?: RegisterOptions;
  control?: Control<TFieldValues>;
}

export interface FormRowProps {
  label?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export interface ValueFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TValue = unknown,
> extends BaseFieldProps<TFieldValues> {
  value?: TValue;
  defaultValue?: TValue;
  onChange?: (value: TValue) => void;
}

export interface StandardFormComponentProps<TSchema extends z.ZodSchema> {
  schema: TSchema;
  defaultValues?: z.infer<TSchema>;
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  formOptions?: Omit<UseFormProps<z.infer<TSchema>>, "resolver" | "defaultValues">;
}

export interface FormRenderProps<TSchema extends z.ZodSchema>
  extends StandardFormComponentProps<TSchema> {
  form: UseFormReturn<z.infer<TSchema>>;
  isSubmitting?: boolean;
  formErrors?: FieldErrors<z.infer<TSchema>>;
  children?: ReactNode | ((form: UseFormReturn<z.infer<TSchema>>) => ReactNode);
}

export interface FieldRenderOptions<
  TFieldValues extends FieldValues = FieldValues,
  TValue = unknown,
> {
  id: string;
  name: FieldPath<TFieldValues>;
  value: TValue;
  disabled?: boolean;
  onChange: (value: TValue) => void;
  onBlur: () => void;
  hasError: boolean;
  errorMessage?: string;
  ref: React.Ref<HTMLElement>;
}

export interface FormSubmissionState {
  isSubmitting: boolean;
  isSubmitSuccessful?: boolean;
  isSubmitError?: boolean;
  submitError?: Error | null;
}

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  DATE = "date",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
  FILE = "file",
}

export interface FieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  type: FieldType;
  options?: Array<{
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
  }>;
  render?: (props: FieldRenderOptions) => ReactNode;
}
