
import { useState, useCallback } from "react";

/**
 * Field-level validation utilities
 */
export function useFieldValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((fieldName: string, value: any, validator: (val: any) => string | null) => {
    const error = validator(value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ""
    }));
    return !error;
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const hasErrors = Object.values(errors).some(error => error !== "");

  return {
    errors,
    validateField,
    clearFieldError,
    clearAllErrors,
    hasErrors
  };
}
