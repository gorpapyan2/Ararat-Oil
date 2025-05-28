import { useState, useCallback } from "react";
import { useToast } from "./use-toast";
import { z } from "zod";

// Define the schema for the login form
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional().default(false),
});

// Define a user type
interface User {
  id: string;
  email: string;
  name: string;
}

export type LoginFormData = z.infer<typeof loginSchema>;

export type AuthProvider = "google" | "github" | "microsoft" | "apple";

interface UseLoginDialogOptions {
  onLoginSuccess?: (user: User) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
  onSocialLogin?: (provider: AuthProvider) => Promise<void>;
  initialValues?: Partial<LoginFormData>;
  redirectUrl?: string;
  availableProviders?: AuthProvider[];
}

export function useLoginDialog({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick,
  onSocialLogin,
  initialValues,
  redirectUrl,
  availableProviders = ["google", "github"],
}: UseLoginDialogOptions = {}) {
  // Dialog state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<AuthProvider | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const { toast } = useToast();

  // Open/close handlers
  const openDialog = useCallback(() => {
    setIsOpen(true);
    setAuthError(null);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setAuthError(null);
  }, []);

  // Form submission handler
  const handleSubmit = useCallback(
    async (data: LoginFormData) => {
      setIsSubmitting(true);
      setAuthError(null);

      try {
        // In a real app, this would call your auth service
        // For example: const user = await authService.login(data.email, data.password);

        // Simulate API call and success for this example
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // If login failed for some reason:
        if (data.email === "fail@example.com") {
          throw new Error("Invalid email or password");
        }

        const mockUser = {
          id: "user-123",
          email: data.email,
          name: "Test User",
        };

        toast({
          title: "Login successful",
          description: "You have been logged in successfully.",
        });

        onLoginSuccess?.(mockUser);
        closeDialog();

        // Redirect if URL is provided
        if (redirectUrl) {
          window.location.href = redirectUrl;
        }

        return true;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Authentication failed";
        setAuthError(errorMessage);

        toast({
          title: "Login failed",
          description: errorMessage || "Please check your credentials and try again",
          variant: "destructive",
        });

        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast, onLoginSuccess, closeDialog, redirectUrl]
  );

  // Social login handler
  const handleSocialLogin = useCallback(
    async (provider: AuthProvider) => {
      if (!onSocialLogin) return;

      setSocialLoading(provider);
      setAuthError(null);

      try {
        await onSocialLogin(provider);
        // Most social login implementations will handle redirects themselves,
        // so we might not need to do anything here
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : `Authentication with ${provider} failed`;
        setAuthError(errorMessage);

        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setSocialLoading(null);
      }
    },
    [onSocialLogin, toast]
  );

  // Sign up handler
  const handleSignUpClick = useCallback(() => {
    closeDialog();
    onSignUpClick?.();
  }, [closeDialog, onSignUpClick]);

  // Forgot password handler
  const handleForgotPasswordClick = useCallback(() => {
    onForgotPasswordClick?.();
  }, [onForgotPasswordClick]);

  // Get default values for the form
  const getDefaultValues = useCallback(() => {
    return {
      email: initialValues?.email || "",
      password: initialValues?.password || "",
      rememberMe: initialValues?.rememberMe || false,
    };
  }, [initialValues]);

  return {
    // Dialog state
    isOpen,
    setIsOpen,
    isSubmitting,
    socialLoading,
    authError,

    // Dialog actions
    openDialog,
    closeDialog,
    handleSubmit,
    handleSocialLogin,
    handleSignUpClick,
    handleForgotPasswordClick,

    // Data and config
    getDefaultValues,
    availableProviders,
  };
}
