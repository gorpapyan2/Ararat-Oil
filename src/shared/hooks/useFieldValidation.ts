import { useCallback } from "react";
import { z } from "zod";
import { useTranslation } from "react-i18next";

/**
 * Specialized form field validation hooks for common field types
 *
 * This hook provides validation schemas for credit cards, URLs, postal codes,
 * and other specialized field types with proper i18n support.
 *
 * @returns An object containing specialized field validation schemas
 */
export function useFieldValidation() {
  const { t } = useTranslation();

  /**
   * Credit Card validation schema
   */
  const creditCardSchema = useCallback(
    (required: boolean = true) => {
      const schema = z
        .string()
        .min(13, t("validation.creditCard.invalidLength"))
        .max(19, t("validation.creditCard.invalidLength"))
        .regex(/^[0-9]+$/, t("validation.creditCard.numbersOnly"))
        .refine(
          (cardNumber) => {
            // Luhn algorithm for credit card validation
            let sum = 0;
            let shouldDouble = false;

            // Loop through values starting from the rightmost digit
            for (let i = cardNumber.length - 1; i >= 0; i--) {
              let digit = parseInt(cardNumber.charAt(i));

              if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
              }

              sum += digit;
              shouldDouble = !shouldDouble;
            }

            return sum % 10 === 0;
          },
          { message: t("validation.creditCard.invalid") }
        );

      return required ? schema : schema.optional();
    },
    [t]
  );

  /**
   * Credit Card Expiration Date validation (MM/YY format)
   */
  const expirationDateSchema = useCallback(
    (required: boolean = true) => {
      const schema = z
        .string()
        .regex(
          /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
          t("validation.expirationDate.format")
        )
        .refine(
          (expDate) => {
            const [month, yearStr] = expDate.split("/");
            const year = parseInt(`20${yearStr}`);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            // Check if the expiration date is in the future
            return (
              year > currentYear ||
              (year === currentYear && parseInt(month) >= currentMonth)
            );
          },
          { message: t("validation.expirationDate.expired") }
        );

      return required ? schema : schema.optional();
    },
    [t]
  );

  /**
   * CVV Code validation
   */
  const cvvSchema = useCallback(
    (required: boolean = true) => {
      const schema = z
        .string()
        .min(3, t("validation.cvv.tooShort"))
        .max(4, t("validation.cvv.tooLong"))
        .regex(/^[0-9]+$/, t("validation.cvv.numbersOnly"));

      return required ? schema : schema.optional();
    },
    [t]
  );

  /**
   * URL validation with optional HTTPS requirement
   */
  const urlSchema = useCallback(
    (requireHttps: boolean = false) => {
      // Base URL schema
      const baseSchema = z.string().url(t("validation.url.invalid"));

      // Return a new schema with HTTPS requirement if needed
      if (requireHttps) {
        return baseSchema.refine((url) => url.startsWith("https://"), {
          message: t("validation.url.httpsRequired"),
        });
      }

      return baseSchema;
    },
    [t]
  );

  /**
   * Postal/Zip Code validation with country-specific formats
   */
  const postalCodeSchema = useCallback(
    (country: string = "US") => {
      // Define regex patterns for different countries
      const patterns: Record<string, { pattern: RegExp; message: string }> = {
        US: {
          pattern: /^\d{5}(-\d{4})?$/,
          message: t("validation.postalCode.usFormat"),
        },
        CA: {
          pattern: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
          message: t("validation.postalCode.caFormat"),
        },
        UK: {
          pattern: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
          message: t("validation.postalCode.ukFormat"),
        },
        // Add more countries as needed
      };

      const countryPattern = patterns[country] || patterns.US;

      return z.string().regex(countryPattern.pattern, countryPattern.message);
    },
    [t]
  );

  /**
   * ID number validation (Social Security, Tax ID, etc.)
   */
  const idNumberSchema = useCallback(
    (
      type: "ssn" | "taxId" | "custom" = "ssn",
      customPattern?: RegExp,
      customMessage?: string
    ) => {
      const patterns: Record<string, { pattern: RegExp; message: string }> = {
        ssn: {
          pattern: /^\d{3}-\d{2}-\d{4}$/,
          message: t("validation.id.ssnFormat"),
        },
        taxId: {
          pattern: /^\d{2}-\d{7}$/,
          message: t("validation.id.taxIdFormat"),
        },
        custom: {
          pattern: customPattern || /^\d+$/,
          message: customMessage || t("validation.id.invalid"),
        },
      };

      const patternToUse = patterns[type];

      return z.string().regex(patternToUse.pattern, patternToUse.message);
    },
    [t]
  );

  /**
   * Date range validation (ensures start date is before end date)
   */
  const dateRangeSchema = useCallback(() => {
    return z
      .object({
        startDate: z.date({
          required_error: t("validation.dateRange.startRequired"),
          invalid_type_error: t("validation.dateRange.startInvalid"),
        }),
        endDate: z.date({
          required_error: t("validation.dateRange.endRequired"),
          invalid_type_error: t("validation.dateRange.endInvalid"),
        }),
      })
      .refine((data) => data.startDate < data.endDate, {
        message: t("validation.dateRange.startBeforeEnd"),
        path: ["endDate"], // Attach the error to the end date field
      });
  }, [t]);

  return {
    creditCardSchema,
    expirationDateSchema,
    cvvSchema,
    urlSchema,
    postalCodeSchema,
    idNumberSchema,
    dateRangeSchema,
  };
}
