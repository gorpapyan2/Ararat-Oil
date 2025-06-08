
import { useState } from "react";
import { z } from "zod";
import { useAuth } from "../hooks/useAuth";
import { formatAuthError } from "../utils/auth.utils";
import type { LoginCredentials } from "../types/auth.types";
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
import { Alert, AlertDescription } from "@/core/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export function LoginForm() {
  const { t } = useTranslation();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  // Create schema inside the component where hooks can be called
  const loginSchema = z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Password must be at least 6 characters"),
  });

  // Type for the form values based on the schema
  type LoginFormData = z.infer<typeof loginSchema>;

  // Default values
  const defaultValues: LoginFormData = {
    email: "",
    password: "",
  };

  // Submit handler
  const handleSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    try {
      const credentials: LoginCredentials = {
        email: data.email,
        password: data.password,
      };

      await login(credentials);
      return true;
    } catch (error) {
      setAuthError(formatAuthError(error));
      return false;
    }
  };

  return (
    <StandardForm
      schema={loginSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitText={
        isLoading
          ? t("auth.signingIn") || "Signing in..."
          : t("auth.signIn.button") || "Sign in"
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
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.email") || "Email"}</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("auth.password") || "Password"}</FormLabel>
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
