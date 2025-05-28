import { z } from "zod";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// Define some common regex patterns
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
  const requiredString = useCallback(
    (minLength?: number, fieldName?: string) => {
      const name = fieldName ? t(`fields.${fieldName}`) : t("common.field");

      return minLength
        ? z
            .string({
              required_error: t("validation.required", { field: name }),
            })
            .min(
              minLength,
              t("validation.minLength", { field: name, length: minLength })
            )
        : z
            .string({
              required_error: t("validation.required", { field: name }),
            })
            .min(1, t("validation.required", { field: name }));
    },
    [t]
  );

  /**
   * Creates an email validation schema with proper error messages
   */
  const email = useCallback(() => {
    return z
      .string({
        required_error: t("validation.emailRequired"),
      })
      .email(t("validation.invalidEmail"));
  }, [t]);

  /**
   * Creates a password validation schema with requirements
   */
  const password = useCallback(
    (minLength: number = 8) => {
      return z
        .string({
          required_error: t("validation.passwordRequired"),
        })
        .min(
          minLength,
          t("validation.passwordMinLength", { length: minLength })
        )
        .refine(
          (val) => REGEX_PATTERNS.PASSWORD.test(val),
          t("validation.passwordRequirements")
        );
    },
    [t]
  );

  /**
   * Creates a phone number validation schema
   */
  const phone = useCallback(() => {
    return z
      .string()
      .optional()
      .refine(
        (val) => !val || REGEX_PATTERNS.PHONE.test(val),
        t("validation.invalidPhone")
      );
  }, [t]);

  /**
   * Creates a number validation schema with min/max constraints
   */
  const number = useCallback(
    (options?: { min?: number; max?: number; fieldName?: string }) => {
      const name = options?.fieldName
        ? t(`fields.${options.fieldName}`)
        : t("common.field");
      let schema = z.number({
        required_error: t("validation.required", { field: name }),
        invalid_type_error: t("validation.mustBeNumber", { field: name }),
      });

      if (options?.min !== undefined) {
        schema = schema.min(
          options.min,
          t("validation.minValue", { field: name, value: options.min })
        );
      }

      if (options?.max !== undefined) {
        schema = schema.max(
          options.max,
          t("validation.maxValue", { field: name, value: options.max })
        );
      }

      return schema;
    },
    [t]
  );

  /**
   * Creates a date validation schema
   */
  const date = useCallback(
    (options?: { min?: Date; max?: Date; fieldName?: string }) => {
      const name = options?.fieldName
        ? t(`fields.${options.fieldName}`)
        : t("common.field");
      let schema = z.date({
        required_error: t("validation.required", { field: name }),
        invalid_type_error: t("validation.mustBeDate", { field: name }),
      });

      if (options?.min) {
        schema = schema.min(
          options.min,
          t("validation.minDate", {
            field: name,
            date: options.min.toLocaleDateString(),
          })
        );
      }

      if (options?.max) {
        schema = schema.max(
          options.max,
          t("validation.maxDate", {
            field: name,
            date: options.max.toLocaleDateString(),
          })
        );
      }

      return schema;
    },
    [t]
  );

  /**
   * Creates a validation schema for matching fields (like password confirmation)
   */
  const matchField = useCallback(
    (field: string, message?: string) => {
      return (val: string, ctx: z.RefinementCtx) => {
        const fieldValue = ctx.path[0] ? (ctx as { data?: Record<string, unknown> }).data?.[field] : undefined;

        if (val !== fieldValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: message || t("validation.fieldsMustMatch"),
          });
          return false;
        }

        return true;
      };
    },
    [t]
  );

  /**
   * Creates an enum validation schema
   */
  const enumValue = useCallback(
    <T extends [string, ...string[]]>(values: T, fieldName?: string) => {
      const name = fieldName ? t(`fields.${fieldName}`) : t("common.field");
      return z.enum(values, {
        required_error: t("validation.required", { field: name }),
        invalid_type_error: t("validation.invalidOption", { field: name }),
      });
    },
    [t]
  );

  return {
    requiredString,
    email,
    password,
    phone,
    number,
    date,
    matchField,
    enumValue,
    patterns: REGEX_PATTERNS,
  };
}
