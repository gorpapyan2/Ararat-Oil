import { useAuth } from "@/hooks/useAuth";
import { LoginFormStandardized } from "@/components/auth/LoginFormStandardized";

const AuthForm = () => {
  const { signIn, user, isLoading: authLoading } = useAuth();

  return (
    <LoginFormStandardized 
      onLogin={signIn}
      user={user}
      isLoading={authLoading}
    />
  );
};

export default AuthForm;
