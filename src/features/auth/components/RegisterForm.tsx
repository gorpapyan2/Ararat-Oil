import { useState } from "react";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { formatAuthError } from "../utils/auth.utils";
import type { RegisterCredentials } from "../types/auth.types";
import { useTranslation } from "react-i18next";
import { StandardForm } from "@/core/components/ui/composed/base-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/core/components/ui/primitives/form";
import { Input } from "@/core/components/ui/primitives/input";
import { Alert, AlertDescription } from "@/core/components/ui/primitives/alert";
import { Control, FieldValues } from "react-hook-form";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function RegisterForm() {
  const { t } = useTranslation();
  const { register: registerUser, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  // Create schema inside the component where hooks can be called
  const registerSchema = z
    .object({
      email: z
        .string({
          required_error: t("auth.emailRequired", "Email is required"),
        })
        .email(t("auth.invalidEmail", "Invalid email address")),
      firstName: z
        .string({
          required_error: t("auth.firstNameRequired", "First name is required"),
        })
        .min(
          2,
          t(
            "auth.firstNameMinLength",
            "First name must be at least 2 characters"
          )
        ),
      lastName: z
        .string({
          required_error: t("auth.lastNameRequired", "Last name is required"),
        })
        .min(
          2,
          t("auth.lastNameMinLength", "Last name must be at least 2 characters")
        ),
      password: z
        .string({
          required_error: t("auth.passwordRequired", "Password is required"),
        })
        .min(
          6,
          t("auth.passwordMinLength", "Password must be at least 6 characters")
        ),
      confirmPassword: z.string({
        required_error: t(
          "auth.confirmPasswordRequired",
          "Please confirm your password"
        ),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.passwordsDontMatch", "Passwords don't match"),
      path: ["confirmPassword"],
    });

  // Type for the form values based on the schema
  type RegisterFormData = z.infer<typeof registerSchema>;

  // Default values
  const defaultValues = {
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  };

  // Submit handler
  const handleSubmit = async (data: RegisterFormData) => {
    setAuthError(null);

    try {
      const credentials: RegisterCredentials = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        confirmPassword: data.confirmPassword,
      };

      await registerUser(credentials);
      return true;
    } catch (error) {
      setAuthError(formatAuthError(error));
      return false;
    }
  };

  return (
    <StandardForm
      schema={registerSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={
        isLoading
          ? t("auth.creatingAccount", "Creating account...")
          : t("auth.createAccount", "Create account")
      }
      className="space-y-4"
    >
      {({ control }) => (
        <>
          {authError && (
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <FormField
            control={control as Control<FieldValues>}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.email", "Email")}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={control as Control<FieldValues>}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.firstName", "First Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control as Control<FieldValues>}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("auth.lastName", "Last Name")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control as Control<FieldValues>}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.password", "Password")}</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control as Control<FieldValues>}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {t("auth.confirmPassword", "Confirm Password")}
                </FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </StandardForm>
  );
}
