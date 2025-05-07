import { useAuth } from "@/hooks/useAuth";
import { LoginFormStandardized } from "@/components/auth/LoginFormStandardized";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff } from "lucide-react";

const AuthForm = () => {
  const { signIn, user, isLoading: authLoading, isOffline } = useAuth();

  // If we're offline, show a special login form with an option to continue in offline mode
  if (isOffline) {
    return (
      <div className="flex justify-center items-center min-h-screen p-4 flex-col">
        <Alert variant="default" className="w-full max-w-md mb-4">
          <WifiOff className="h-4 w-4 mr-2" />
          <AlertDescription>
            Network connection unavailable. You can continue in offline mode with limited functionality.
          </AlertDescription>
        </Alert>
        
        <Button 
          className="w-full max-w-md"
          onClick={() => signIn("offline@example.com", "offline")}
        >
          Continue in Offline Mode
        </Button>
      </div>
    );
  }

  return (
    <LoginFormStandardized 
      onLogin={signIn}
      user={user}
      isLoading={authLoading}
    />
  );
};

export default AuthForm;
