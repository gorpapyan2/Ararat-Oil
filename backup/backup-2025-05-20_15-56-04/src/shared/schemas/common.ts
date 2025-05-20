import { z } from "zod";

/**
 * Common Zod schema patterns for form validation
 */

// Text field patterns
export const emailSchema = z.string().email("Please enter a valid email address");
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters");
export const requiredString = z.string().min(1, "This field is required");
export const optionalString = z.string().optional();
export const phoneSchema = z.string().regex(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number");
export const urlSchema = z.string().url("Please enter a valid URL");

// Number field patterns
export const positiveNumber = z.number().positive("Must be a positive number");
export const nonNegativeNumber = z.number().min(0, "Cannot be negative");
export const requiredNumber = z.number({
  required_error: "This field is required",
  invalid_type_error: "Must be a number",
});
export const optionalNumber = z.number().optional();
export const integerSchema = z.number().int("Must be a whole number");
export const priceSchema = z.number().min(0, "Price cannot be negative").multipleOf(0.01, "Invalid price format");

// Date field patterns
export const dateSchema = z.date({
  required_error: "Please select a date",
  invalid_type_error: "That's not a date!",
});
export const optionalDateSchema = z.date().optional();
export const futureDate = z.date().min(new Date(), "Date must be in the future");
export const pastDate = z.date().max(new Date(), "Date must be in the past");

// Common identity schemas
export const idSchema = z.string().uuid("Invalid ID format");
export const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format");

// Utility functions
/**
 * Creates a schema for a field that must match another field
 * 
 * @param schema The base schema
 * @param matchField The field to match against
 * @param message The error message
 * @returns A refined schema that validates matches
 * 
 * @example
 * ```tsx
 * const formSchema = z.object({
 *   password: passwordSchema,
 *   confirmPassword: matchField(passwordSchema, "password", "Passwords must match")
 * });
 * ```
 */
export function matchField<T extends z.ZodType>(
  schema: T, 
  matchField: string, 
  message: string
): z.ZodEffects<T> {
  return schema.superRefine((val, ctx) => {
    if (ctx.parent && val !== ctx.parent[matchField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  });
}

/**
 * Creates a schema for conditional validation
 * 
 * @param condition The condition function
 * @param thenSchema The schema to use if condition is true
 * @param elseSchema The schema to use if condition is false
 * @returns A schema that conditionally validates
 * 
 * @example
 * ```tsx
 * const formSchema = z.object({
 *   hasDiscount: z.boolean(),
 *   discountAmount: conditionalSchema(
 *     (data) => data.hasDiscount,
 *     z.number().min(1),
 *     z.number().optional()
 *   )
 * });
 * ```
 */
export function conditionalSchema<T>(
  condition: (data: any) => boolean,
  thenSchema: z.ZodType<T>,
  elseSchema: z.ZodType = z.any()
): z.ZodType {
  return z.preprocess(
    (value) => value,
    z.custom<T>((value, ctx) => {
      const { path, data } = ctx;
      const parsedPath = path.length ? path : ["_"];
      const dataToValidate = parsedPath[0] === "_" ? value : data;
      
      const schema = condition(dataToValidate) ? thenSchema : elseSchema;
      const result = schema.safeParse(value);
      
      if (!result.success) {
        const error = result.error.issues[0];
        ctx.addIssue({
          code: error.code,
          message: error.message,
          path: error.path,
        });
        return z.NEVER;
      }
      
      return value as T;
    })
  );
}

// Form-specific schemas
export const addressSchema = z.object({
  street: requiredString,
  city: requiredString,
  state: requiredString,
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code"),
  country: requiredString,
});

export const nameSchema = z.object({
  firstName: requiredString,
  lastName: requiredString,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const signupSchema = loginSchema.extend({
  confirmPassword: matchField(passwordSchema, "password", "Passwords must match"),
  terms: z.boolean().refine((val) => val, "You must agree to the terms and conditions"),
});

export const paymentMethodSchema = z.object({
  type: z.enum(["card", "bank", "cash", "other"], {
    invalid_type_error: "Please select a payment method",
    required_error: "Please select a payment method",
  }),
  nameOnCard: z.string().optional(),
  cardNumber: z.string().optional().refine(
    (val) => !val || /^\d{16}$/.test(val),
    "Card number must be 16 digits"
  ),
  expirationDate: z.string().optional().refine(
    (val) => !val || /^(0[1-9]|1[0-2])\/\d{2}$/.test(val),
    "Expiration date must be in MM/YY format"
  ),
  cvv: z.string().optional().refine(
    (val) => !val || /^\d{3,4}$/.test(val),
    "CVV must be 3 or 4 digits"
  ),
}); 