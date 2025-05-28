import { z } from "zod";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useCommonValidation } from "./useCommonValidation";

// Types of payment methods
type PaymentMethod = "credit" | "debit" | "bank" | "paypal";

/**
 * A type-safe way to create a payment form with conditional fields
 */
const createPaymentForm = (t: Function) => {
  // Base payment method field
  return z
    .object({
      paymentMethod: z.enum(["credit", "debit", "bank", "paypal"] as const),
    })
    .passthrough();
};

/**
 * Hook that provides pre-built schemas for common form types
 *
 * This hook leverages useCommonValidation to create standardized
 * schemas for login, registration, profile, and other common forms.
 *
 * @returns An object containing form schemas for common form types
 */
export function useFormSchemas() {
  const { t } = useTranslation();
  const { requiredString, email, password, confirmPassword, phoneNumber } =
    useCommonValidation();

  // Local implementation of field validation to avoid circular dependencies
  const useLocalFieldValidation = () => {
    // Credit card validation schema
    const creditCardSchema = (required: boolean = true) => {
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
    };

    // Expiration date validation schema
    const expirationDateSchema = (required: boolean = true) => {
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
    };

    // CVV validation schema
    const cvvSchema = (required: boolean = true) => {
      const schema = z
        .string()
        .min(3, t("validation.cvv.tooShort"))
        .max(4, t("validation.cvv.tooLong"))
        .regex(/^[0-9]+$/, t("validation.cvv.numbersOnly"));

      return required ? schema : schema.optional();
    };

    return {
      creditCardSchema,
      expirationDateSchema,
      cvvSchema,
    };
  };

  // Get the local field validation functions
  const { creditCardSchema, expirationDateSchema, cvvSchema } =
    useLocalFieldValidation();

  /**
   * Login form schema
   */
  const loginSchema = useCallback(() => {
    return z.object({
      email: email(),
      password: password(),
      rememberMe: z.boolean().optional(),
    });
  }, [email, password]);

  /**
   * Registration form schema
   */
  const registrationSchema = useCallback(() => {
    return z.object({
      firstName: requiredString(2, "firstName"),
      lastName: requiredString(2, "lastName"),
      email: email(),
      password: password(8),
      confirmPassword: confirmPassword(),
      agreeToTerms: z.boolean().refine((val) => val === true, {
        message: t("validation.mustAgreeToTerms"),
      }),
    });
  }, [requiredString, email, password, confirmPassword, t]);

  /**
   * Profile form schema
   */
  const profileSchema = useCallback(() => {
    return z.object({
      firstName: requiredString(2, "firstName"),
      lastName: requiredString(2, "lastName"),
      email: email(),
      phone: phoneNumber(),
      bio: z.string().max(500, t("validation.bioTooLong")).optional(),
      avatar: z.any().optional(), // File uploads would need specialized handling
    });
  }, [requiredString, email, phoneNumber, t]);

  /**
   * Password change form schema
   */
  const passwordChangeSchema = useCallback(() => {
    return z.object({
      currentPassword: requiredString(1, "currentPassword"),
      newPassword: password(8),
      confirmNewPassword: z
        .string()
        .min(1, t("validation.confirmPasswordRequired"))
        .refine(
          (value, ctx) => {
            // Workaround to access newPassword value
            const formData =
              ctx.path.length > 0 ? (ctx as { _container?: Record<string, unknown> })._container : null;

            if (!formData) return true; // Skip validation if container is not available
            return value === formData.newPassword;
          },
          { message: t("validation.passwordsDontMatch") }
        ),
    });
  }, [requiredString, password, t]);

  /**
   * Address form schema
   */
  const addressSchema = useCallback(() => {
    return z.object({
      addressLine1: requiredString(5, "addressLine1"),
      addressLine2: z.string().optional(),
      city: requiredString(2, "city"),
      state: requiredString(2, "state"),
      postalCode: requiredString(5, "postalCode"),
      country: requiredString(2, "country"),
    });
  }, [requiredString]);

  /**
   * Payment form schema with conditional fields based on payment method
   */
  const paymentSchema = useCallback(() => {
    // Base schema with payment method field
    const baseSchema = z.object({
      paymentMethod: z.enum(["credit", "debit", "bank", "paypal"] as const),
    });

    // Define conditional fields based on payment method
    return baseSchema.and(
      z.discriminatedUnion("paymentMethod", [
        // Credit/Debit Card
        z.object({
          paymentMethod: z.enum(["credit", "debit"] as const),
          cardNumber: creditCardSchema(),
          cardExpiration: expirationDateSchema(),
          cvv: cvvSchema(),
        }),

        // Bank Transfer
        z.object({
          paymentMethod: z.literal("bank"),
          accountNumber: requiredString(5, "accountNumber"),
          routingNumber: requiredString(9, "routingNumber"),
        }),

        // PayPal
        z.object({
          paymentMethod: z.literal("paypal"),
          paypalEmail: email(),
        }),
      ])
    );
  }, [
    requiredString,
    email,
    creditCardSchema,
    expirationDateSchema,
    cvvSchema,
  ]);

  return {
    loginSchema,
    registrationSchema,
    profileSchema,
    passwordChangeSchema,
    addressSchema,
    paymentSchema,
  };
}
