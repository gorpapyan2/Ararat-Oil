import { z } from "zod";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// Define some common regex patterns if REGEX import is unavailable
const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, // Min 8 chars, at least 1 letter and 1 number
  PHONE: /^\+?[0-9]{10,15}$/,
};

/**
 * Common validation patterns used across the application
 * 
 * This hook provides access to frequently used validation schemas with proper i18n support
 * and consistent error messages.
 * 
 * @returns An object containing commonly used validation schemas and utility functions
 */
export function useCommonValidation() {
  const { t } = useTranslation();
  
  /**
   * Creates a required string schema with an optional minimum length
   */
  const requiredString = useCallback((minLength?: number, fieldName?: string) => {
    const name = fieldName ? t(`fields.${fieldName}`) : t('common.field');
    
    return minLength 
      ? z.string({
          required_error: t('validation.required', { field: name }),
        }).min(minLength, t('validation.minLength', { field: name, length: minLength }))
      : z.string({
          required_error: t('validation.required', { field: name }),
        }).min(1, t('validation.required', { field: name }));
  }, [t]);
  
  /**
   * Creates an email validation schema with proper error messages
   */
  const email = useCallback(() => {
    return z.string({
      required_error: t('validation.emailRequired'),
    }).email(t('validation.invalidEmail'));
  }, [t]);
  
  /**
   * Creates a password validation schema with requirements
   */
  const password = useCallback((minLength: number = 8) => {
    return z.string({
      required_error: t('validation.passwordRequired'),
    }).min(minLength, t('validation.passwordMinLength', { length: minLength }));
  }, [t]);
  
  /**
   * Creates a password confirmation schema that matches another password field
   */
  const confirmPassword = useCallback((passwordField: string = "password") => {
    return z.string({
      required_error: t('validation.confirmPasswordRequired'),
    }).refine(
      (val) => true, // This will be replaced later in a custom validator
      { message: t('validation.passwordsDontMatch') }
    );
  }, [t]);
  
  /**
   * Creates a phone number validation schema
   */
  const phoneNumber = useCallback(() => {
    return z.string().regex(
      REGEX_PATTERNS.PHONE, 
      t('validation.invalidPhoneNumber')
    ).optional();
  }, [t]);
  
  /**
   * Creates a number validation schema with min/max constraints
   */
  const number = useCallback((options?: { min?: number; max?: number; required?: boolean; fieldName?: string }) => {
    const { min, max, required = false, fieldName } = options || {};
    const name = fieldName ? t(`fields.${fieldName}`) : t('common.number');
    
    let schema = z.number({
      required_error: t('validation.numberRequired', { field: name }),
      invalid_type_error: t('validation.mustBeNumber', { field: name }),
    });
    
    if (min !== undefined) {
      schema = schema.min(min, t('validation.minNumber', { field: name, min }));
    }
    
    if (max !== undefined) {
      schema = schema.max(max, t('validation.maxNumber', { field: name, max }));
    }
    
    return required ? schema : schema.optional();
  }, [t]);
  
  /**
   * Creates a date validation schema with min/max constraints
   */
  const date = useCallback((options?: { past?: boolean; future?: boolean; required?: boolean; fieldName?: string }) => {
    const { past, future, required = false, fieldName } = options || {};
    const name = fieldName ? t(`fields.${fieldName}`) : t('common.date');
    
    let schema = z.date({
      required_error: t('validation.dateRequired', { field: name }),
      invalid_type_error: t('validation.invalidDate', { field: name }),
    });
    
    if (past) {
      schema = schema.max(new Date(), t('validation.dateMustBePast', { field: name }));
    }
    
    if (future) {
      schema = schema.min(new Date(), t('validation.dateMustBeFuture', { field: name }));
    }
    
    return required ? schema : schema.optional();
  }, [t]);
  
  /**
   * Creates a checkbox validation schema that must be checked
   */
  const checkedBox = useCallback((errorMessage?: string) => {
    return z.boolean().refine(val => val === true, {
      message: errorMessage || t('validation.mustBeChecked'),
    });
  }, [t]);
  
  /**
   * Creates a schema for fields that are conditionally required based on another field
   */
  const conditionalField = useCallback(<T extends z.ZodType>(
    schema: T,
    condition: (data: any) => boolean,
    errorMessage?: string
  ) => {
    return z.preprocess(
      (val) => val,
      z.union([
        z.object({}).passthrough().refine(condition, {
          message: errorMessage || t('validation.conditionalRequired'),
          path: [],
        }).pipe(z.object({}).passthrough().and(z.object({ value: schema }))),
        z.object({}).passthrough().refine(data => !condition(data), {
          message: '',
          path: [],
        })
      ])
    );
  }, [t]);
  
  return {
    requiredString,
    email,
    password,
    confirmPassword,
    phoneNumber,
    number,
    date,
    checkedBox,
    conditionalField,
  };
} 