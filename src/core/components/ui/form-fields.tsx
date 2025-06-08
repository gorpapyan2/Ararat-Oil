
/**
 * This file re-exports form-fields components from the primitives directory.
 * This helps maintain backward compatibility with existing imports.
 */

export {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormSwitch,
  FormRadioGroup,
  FormCurrencyInput,
  FormDatePicker,
  CustomFormField,
} from "@/core/components/ui/primitives/form-fields";

export type {
  FormInputProps,
  FormSelectProps,
  FormCheckboxProps,
  FormTextareaProps,
  FormSwitchProps,
  FormRadioGroupProps,
  FormCurrencyInputProps,
  FormDatePickerProps,
} from "@/core/components/ui/primitives/form-fields";
