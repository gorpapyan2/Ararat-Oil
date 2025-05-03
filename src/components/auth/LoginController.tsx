import { Button } from "@/components/ui";
import { useLoginDialog } from "@/hooks";
import { LoginFormData, AuthProvider } from "@/hooks/useLoginDialog";
import { LoginDialogStandardized } from "./LoginDialogStandardized";
import { IconLogin } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface LoginControllerProps {
  onLoginSuccess?: (user: any) => void;
  onSignUpClick?: () => void;
  onForgotPasswordClick?: () => void;
  onSocialLogin?: (provider: AuthProvider) => Promise<void>;
  initialValues?: Partial<LoginFormData>;
  redirectUrl?: string;
  availableProviders?: AuthProvider[];
  className?: string;
  buttonText?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  children?: React.ReactNode; // Alternative to using the default button
}

export function LoginController({
  onLoginSuccess,
  onSignUpClick,
  onForgotPasswordClick,
  onSocialLogin,
  initialValues,
  redirectUrl,
  availableProviders,
  className,
  buttonText,
  variant = "default",
  size = "default",
  showIcon = true,
  children,
}: LoginControllerProps) {
  const { t } = useTranslation();
  
  const {
    openDialog,
    isOpen,
    setIsOpen,
  } = useLoginDialog({
    onLoginSuccess,
    onSignUpClick,
    onForgotPasswordClick,
    onSocialLogin,
    initialValues,
    redirectUrl,
    availableProviders,
  });
  
  return (
    <>
      {/* Render children or default button */}
      {children ? (
        <div onClick={openDialog}>
          {children}
        </div>
      ) : (
        <Button
          onClick={openDialog}
          className={className}
          variant={variant}
          size={size}
        >
          {showIcon && <IconLogin className="h-4 w-4 mr-2" />}
          {buttonText || t("auth.login.signIn")}
        </Button>
      )}
      
      <LoginDialogStandardized
        open={isOpen}
        onOpenChange={setIsOpen}
        onLoginSuccess={onLoginSuccess}
        onSignUpClick={onSignUpClick}
        onForgotPasswordClick={onForgotPasswordClick}
        onSocialLogin={onSocialLogin}
        initialValues={initialValues}
        redirectUrl={redirectUrl}
        availableProviders={availableProviders}
      />
    </>
  );
} 