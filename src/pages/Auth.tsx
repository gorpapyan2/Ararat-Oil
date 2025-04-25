import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";

const AuthForm = () => {
  const { signIn, user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setError("");
    setEmail("");
    setPassword("");
  };

  if (authLoading) {
    return <Loading variant="fullscreen" text="Loading authentication..." />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Sign into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              type="email"
              disabled={isSubmitting}
              className="bg-background"
            />
            <Input
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              type="password"
              disabled={isSubmitting}
              className="bg-background"
            />
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loading variant="inline" size="sm" text="Signing In..." />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="text-sm mt-4 text-center text-muted-foreground">
            Contact your administrator for account access
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
