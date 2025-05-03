import { useEffect } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";
import { ArrowRight } from "lucide-react";
import { FormInput } from "@/components/ui/composed/form-fields";
import { useZodForm, useFormSubmitHandler } from "@/hooks/use-form";

// Define the form validation schema
const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

// Infer the form data type from the schema
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ error?: string }>;
  user: any | null;
  isLoading: boolean;
}

export function LoginFormStandardized({ onLogin, user, isLoading }: LoginFormProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Use the Zod form hook
  const form = useZodForm({
    schema: loginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle form submission with the custom hook
  const { isSubmitting, formError, setFormError, onSubmit } = 
    useFormSubmitHandler<LoginFormData>(
      form,
      async (data) => {
        const { error } = await onLogin(data.email, data.password);
        if (error) {
          setFormError(error);
          return false; // Return false to indicate submission failed
        }
        return true; // Return true to indicate submission succeeded
      }
    );

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <Loading variant="fullscreen" text={t("auth.signIn.loading")} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("auth.signIn.title")}</CardTitle>
          <CardDescription>{t("auth.signIn.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormInput
              name="email"
              label={t("auth.signIn.emailLabel")}
              form={form}
              placeholder={t("auth.signIn.emailPlaceholder")}
              type="email"
              disabled={isSubmitting}
              autoComplete="username"
            />
            
            <FormInput
              name="password"
              label={t("auth.signIn.passwordLabel")}
              form={form}
              placeholder={t("auth.signIn.passwordPlaceholder")}
              type="password"
              disabled={isSubmitting}
              autoComplete="current-password"
            />
            
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? t("auth.signIn.signingIn") : t("auth.signIn.button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          
          <div className="text-sm mt-4 text-center text-muted-foreground">
            {t("auth.signIn.contactAdmin")}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 