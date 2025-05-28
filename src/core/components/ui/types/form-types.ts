/**
 * Type definitions for form components
 * This file centralizes type definitions to improve type safety across form implementations
 */
import { z, ZodTypeDef } from "zod";
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

/**
 * Base form field properties
 */
export interface BaseFieldProps<
  TFieldValues extends FieldValues = FieldValues,
> {
  /** Field name */
  name: FieldPath<TFieldValues>;
  /** Field label */
  label?: string;
  /** Help text */
  description?: string;
  /** Is field required */
  required?: boolean;
  /** Is field disabled */
  disabled?: boolean;
  /** Is field read-only */
  readOnly?: boolean;
  /** Error message */
  error?: string;
  /** Placeholder text */
  placeholder?: string;
  /** CSS class name */
  className?: string;
  /** Additional validation options */
  validation?: RegisterOptions;
  /** Form control instance from react-hook-form */
  control?: Control<TFieldValues>;
}

/**
 * Props for FormRow component
 */
export interface FormRowProps {
  /** Label for the form field */
  label?: string;
  /** Description text for the form field */
  description?: string;
  /** Is the field required */
  required?: boolean;
  /** Children elements */
  children: ReactNode;
  /** Class name for the form row */
  className?: string;
}

/**
 * Type for form field with a value
 */
export interface ValueFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TValue = unknown,
> extends BaseFieldProps<TFieldValues> {
  /** Current field value */
  value?: TValue;
  /** Default field value */
  defaultValue?: TValue;
  /** Handler for value changes */
  onChange?: (value: TValue) => void;
}

/**
 * Props for form components using StandardForm
 */
export interface StandardFormComponentProps<
  TSchema extends z.ZodType<ZodTypeDef, unknown>,
> {
  /** Zod schema for form validation */
  schema: TSchema;
  /** Default values for form fields */
  defaultValues?: z.infer<TSchema>;
  /** Handler for form submission */
  onSubmit: SubmitHandler<z.infer<TSchema>>;
  /** Additional props for the useForm hook */
  formOptions?: Omit<
    UseFormProps<z.infer<TSchema>>,
    "resolver" | "defaultValues"
  >;
}

/**
 * Props for rendered form components
 */
export interface FormRenderProps<TSchema extends z.ZodType<unknown, unknown>>
  extends StandardFormComponentProps<TSchema> {
  /** Form methods from react-hook-form */
  form: UseFormReturn<z.infer<TSchema>>;
  /** Is form submitting */
  isSubmitting?: boolean;
  /** Form-level error messages */
  formErrors?: FieldErrors<z.infer<TSchema>>;
  /** Child components */
  children?: ReactNode | ((form: UseFormReturn<z.infer<TSchema>>) => ReactNode);
}

/**
 * Options for custom form field renderer
 */
export interface FieldRenderOptions<
  TFieldValues extends FieldValues = FieldValues,
  TValue = unknown,
> {
  /** Field ID */
  id: string;
  /** Field name */
  name: FieldPath<TFieldValues>;
  /** Input value */
  value: TValue;
  /** Is field disabled */
  disabled?: boolean;
  /** onChange handler */
  onChange: (value: TValue) => void;
  /** onBlur handler */
  onBlur: () => void;
  /** Are there validation errors */
  hasError: boolean;
  /** Error message */
  errorMessage?: string;
  /** Ref for the input element */
  ref: React.Ref<HTMLElement>;
}

/**
 * Form submission state
 */
export interface FormSubmissionState {
  /** Is form submitting */
  isSubmitting: boolean;
  /** Was submission successful */
  isSubmitSuccessful?: boolean;
  /** Is there a submission error */
  isSubmitError?: boolean;
  /** Any submission error */
  submitError?: Error | null;
}

/**
 * Form field types for dynamic form generation
 */
export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  EMAIL = "email",
  PASSWORD = "password",
  NUMBER = "number",
  DATE = "date",
  TIME = "time",
  DATETIME = "datetime-local",
  CHECKBOX = "checkbox",
  RADIO = "radio",
  SELECT = "select",
  MULTISELECT = "multiselect",
  FILE = "file",
}

/**
 * Configuration for a dynamic form field
 */
export interface FieldConfig<TFieldValues extends FieldValues = FieldValues>
  extends BaseFieldProps<TFieldValues> {
  /** Field type */
  type: FieldType;
  /** Options for select/radio fields */
  options?: Array<{
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
  }>;
  /** Custom renderer */
  render?: (props: FieldRenderOptions) => ReactNode;
}
