import { z } from "zod";
import { emailSchema, passwordSchema, matchField } from "@/shared/schemas";

/**
 * Auth-specific schemas for form validation
 */

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: matchField(
    passwordSchema,
    "password",
    "Passwords must match"
  ),
  terms: z
    .boolean()
    .refine((val) => val, "You must agree to the terms and conditions"),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: matchField(
    passwordSchema,
    "password",
    "Passwords must match"
  ),
  token: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
  confirmPassword: matchField(
    passwordSchema,
    "newPassword",
    "Passwords must match"
  ),
});
