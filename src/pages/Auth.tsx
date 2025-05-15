import { useAuth } from '@/features/auth';
import { LoginForm } from '@/features/auth';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from 'react-router-dom';
import type { LoginCredentials } from '@/features/auth';

export default function Auth() {
  const { user, login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials);
    if (!error) {
      navigate('/dashboard');
    }
  };

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert>
          <AlertDescription>
            You are already logged in. Redirecting to dashboard...
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate('/dashboard')} className="mt-4">
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
