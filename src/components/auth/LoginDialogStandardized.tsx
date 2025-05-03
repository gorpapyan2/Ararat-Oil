import { 
  StandardDialog,
  Button,
  Checkbox,
  Label,
  Input,
  Separator,
  Alert, 
  AlertDescription,
  FormInput 
} from "@/components/ui";

import { 
  useZodForm, 
  useFormSubmitHandler,
  useLoginDialog 
} from "@/hooks";

import { 
  loginSchema, 
  LoginFormData, 
  AuthProvider 
} from "@/hooks/useLoginDialog";

import { useTranslation } from "react-i18next";
import { IconAlertCircle } from "@tabler/icons-react";

// Import social login icons
import { 
  IconBrandGoogle, 
  IconBrandGithub, 
  IconBrandMicrosoft, 
  IconBrandApple 
} from "@tabler/icons-react";

interface LoginDialogStandardizedProps {
  onLoginSuccess?: (user: any) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
  onSocialLogin?: (provider: AuthProvider) => Promise<void>;
  initialValues?: Partial<LoginFormData>;
  redirectUrl?: string;
  availableProviders?: AuthProvider[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginDialogStandardized({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick,
  onSocialLogin,
  initialValues,
  redirectUrl,
  availableProviders,
  open,
  onOpenChange,
}: LoginDialogStandardizedProps) {
  const { t } = useTranslation();
  
  const {
    isOpen: hookIsOpen,
    setIsOpen: setHookIsOpen,
    isSubmitting,
    socialLoading,
    authError,
    handleSubmit: submitLogin,
    handleSocialLogin,
    handleSignUpClick,
    handleForgotPasswordClick,
    getDefaultValues,
    availableProviders: hookProviders,
  } = useLoginDialog({
    onLoginSuccess,
    onSignUpClick,
    onForgotPasswordClick,
    onSocialLogin,
    initialValues,
    redirectUrl,
    availableProviders,
  });
  
  // Use controlled state if provided, otherwise use the hook's state
  const isOpen = open !== undefined ? open : hookIsOpen;
  const setIsOpen = onOpenChange || setHookIsOpen;
  const providers = availableProviders || hookProviders;
  
  const form = useZodForm({
    schema: loginSchema,
    defaultValues: getDefaultValues(),
  });
  
  const { onSubmit } = useFormSubmitHandler<LoginFormData>(
    form,
    submitLogin
  );
  
  // Map provider to icon
  const getProviderIcon = (provider: AuthProvider) => {
    switch (provider) {
      case "google":
        return <IconBrandGoogle className="h-4 w-4" />;
      case "github":
        return <IconBrandGithub className="h-4 w-4" />;
      case "microsoft":
        return <IconBrandMicrosoft className="h-4 w-4" />;
      case "apple":
        return <IconBrandApple className="h-4 w-4" />;
    }
  };
  
  // Format provider name for display
  const formatProviderName = (provider: AuthProvider) => {
    return provider.charAt(0).toUpperCase() + provider.slice(1);
  };
  
  return (
    <StandardDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      maxWidth="sm:max-w-md"
    >
      {/* Error message */}
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <IconAlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      {/* Login form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <FormInput
          name="email"
          label={t("auth.login.email")}
          form={form}
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        
        <FormInput
          name="password"
          label={t("auth.login.password")}
          form={form}
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              {...form.register("rememberMe")}
            />
            <Label 
              htmlFor="remember" 
              className="text-sm cursor-pointer"
            >
              {t("auth.login.rememberMe")}
            </Label>
          </div>
          
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0"
            onClick={handleForgotPasswordClick}
          >
            {t("auth.login.forgotPassword")}
          </Button>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting 
            ? t("auth.login.loggingIn") 
            : t("auth.login.loginButton")}
        </Button>
      </form>
      
      {/* Social logins */}
      {providers && providers.length > 0 && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t("auth.login.orContinueWith")}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {providers.map((provider) => (
              <Button
                key={provider}
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => handleSocialLogin(provider)}
                disabled={isSubmitting || socialLoading !== null}
              >
                {getProviderIcon(provider)}
                <span className="ml-2">
                  {socialLoading === provider 
                    ? t("auth.login.connecting") 
                    : formatProviderName(provider)}
                </span>
              </Button>
            ))}
          </div>
        </>
      )}
      
      {/* Sign up link */}
      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">
          {t("auth.login.noAccount")}{" "}
        </span>
        <Button
          type="button"
          variant="link"
          size="sm"
          className="p-0"
          onClick={handleSignUpClick}
        >
          {t("auth.login.signUp")}
        </Button>
      </div>
    </StandardDialog>
  );
} 