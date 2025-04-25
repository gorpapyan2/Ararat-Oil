import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loading } from "@/components/ui/loading";

const AuthForm = () => {
  const { signIn, signUp, user, isLoading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
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
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) setError(error);
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsSubmitting(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) setError(error);
      }
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
    setFullName("");
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    resetForm();
  };

  if (authLoading) {
    return <Loading variant="fullscreen" text="Loading authentication..." />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Sign In" : "Sign Up"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Sign into your account"
              : "Register a new account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                disabled={isSubmitting}
                className="bg-background"
              />
            )}
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
                <Loading variant="inline" size="sm" text={mode === "login" ? "Signing In..." : "Signing Up..."} />
              ) : (
                mode === "login" ? "Sign In" : "Sign Up"
              )}
            </Button>
          </form>
          <div className="text-sm mt-4 text-center">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button 
                  className="underline hover:text-primary" 
                  onClick={toggleMode}
                  type="button"
                  disabled={isSubmitting}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button 
                  className="underline hover:text-primary" 
                  onClick={toggleMode}
                  type="button"
                  disabled={isSubmitting}
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
