
// Core hooks
export { useLocalStorage } from '@/core/hooks/useLocalStorage';
export { useToast } from '@/core/hooks/useToast';
export { useDialog } from '@/core/hooks/useDialog';

// Form hooks - use the consolidated versions from form directory
export { 
  useZodForm, 
  useFormSubmitHandler, 
  useFormValidation,
  useCommonValidation 
} from './form';

// Field validation hook
export { useFieldValidation } from './useFieldValidation';

// Form schemas hook  
export { useFormSchemas } from './useFormSchemas';
