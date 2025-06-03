/**
 * Form Validation: Centralized exports for all form validation hooks
 *
 * This file provides a convenient way to import all form validation hooks
 * from a single location, improving maintainability and reducing imports.
 *
 * @example
 * // Instead of multiple imports:
 * import { useZodForm } from './hooks/useZodForm';
 * import { useCommonValidation } from './hooks/useCommonValidation';
 *
 * // You can use:
 * import { useZodForm, useCommonValidation } from './hooks/form-validation';
 */

export { useZodForm } from "./useZodForm";
export { useFormSubmitHandler } from "./useFormSubmitHandler";
export { useCommonValidation } from "./useCommonValidation";
export { useFieldValidation } from "./useFieldValidation";
export { useFormSchemas } from "./useFormSchemas";

// Export the consolidated hook as well
export { useFormValidation } from "./useFormValidation";

// Types
export type { UseFormSubmitHandlerOptions } from "./useFormSubmitHandler";
