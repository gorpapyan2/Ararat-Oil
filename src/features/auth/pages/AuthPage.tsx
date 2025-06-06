import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Fuel, Lock, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader } from '@/core/components/ui/card';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { useAuth } from '@/core/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

export const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, user, isLoading: authLoading, isOffline } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  // Force dark theme for auth page
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // Don't remove dark class on unmount to avoid flashing
    };
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await signIn(loginForm.email, loginForm.password);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Successfully signed in! Redirecting...');
        // Navigation will happen automatically via useEffect
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4 animate-pulse">
            <Fuel className="w-6 h-6 text-white" />
          </div>
          <p className="text-slate-400 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-6">
            <Fuel className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Welcome back
          </h1>
          <p className="text-slate-400 text-sm">
            Sign in to your account to continue
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6">
            <Alert className="border-red-900/50 bg-red-950/50 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {success && (
          <div className="mb-6">
            <Alert className="border-green-900/50 bg-green-950/50 text-green-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{success}</AlertDescription>
            </Alert>
          </div>
        )}

        {isOffline && (
          <div className="mb-6">
            <Alert className="border-amber-900/50 bg-amber-950/50 text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You are currently offline. Please check your internet connection.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Login Card */}
        <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <h2 className="text-lg font-medium text-white text-center">Sign In</h2>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-slate-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                    required
                    disabled={isLoading || authLoading || isOffline}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-slate-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                    required
                    disabled={isLoading || authLoading || isOffline}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-400 transition-colors"
                    disabled={isLoading || authLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500/20 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-400">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || authLoading || isOffline}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="pt-4 text-center">
              <p className="text-xs text-slate-500">
                Need access? Contact your system administrator
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Company Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            © 2024 Ararat Oil Management System
          </p>
        </div>
      </motion.div>
    </div>
  );
}; 