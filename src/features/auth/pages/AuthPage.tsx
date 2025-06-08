import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Fuel, Lock, Mail, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/core/components/ui/button';
import { Card, CardContent, CardHeader } from '@/core/components/ui/card';
import { Alert, AlertDescription } from '@/core/components/ui/alert';
import { WindowContainer } from '@/shared/components/layout/WindowContainer';
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
  const [rememberMe, setRememberMe] = useState(false);

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

  const breadcrumbItems = [
    { label: 'Ararat Oil Management', href: '/' },
    { label: 'Authentication', href: '/auth' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <WindowContainer
        title="Authentication"
        subtitle="Verifying your access credentials..."
        breadcrumbItems={breadcrumbItems}
      >
        <div className="flex items-center justify-center py-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-natural-accent to-natural-accent/80 rounded-2xl mb-6 shadow-2xl shadow-natural-accent/30 ring-2 ring-natural-accent/20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Fuel className="w-8 h-8 text-core-primary" />
              </motion.div>
            </div>
            <h3 className="text-lg font-semibold text-core-white mb-2">Checking authentication</h3>
            <p className="text-core-secondary text-sm font-medium">Please wait while we verify your session...</p>
          </motion.div>
        </div>
      </WindowContainer>
    );
  }

  return (
    <WindowContainer
      title="Authentication Portal"
      subtitle="Secure access to the Ararat Oil Management System"
      breadcrumbItems={breadcrumbItems}
    >
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-natural-accent via-natural-accent/90 to-natural-accent/80 rounded-3xl shadow-2xl shadow-natural-accent/30 ring-2 ring-natural-accent/20 relative">
            <Fuel className="w-10 h-10 text-core-primary" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-status-operational rounded-full flex items-center justify-center ring-2 ring-background">
              <Shield className="w-3 h-3 text-background" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-core-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-core-secondary text-base font-medium max-w-md mx-auto leading-relaxed">
              Sign in to access your fuel management dashboard and operations center
            </p>
          </div>
        </motion.div>

        {/* Status Messages */}
        <motion.div variants={itemVariants} className="space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Alert className="border-status-critical/40 bg-status-critical/10 text-status-critical backdrop-blur-sm shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm font-medium pl-2">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Alert className="border-status-operational/40 bg-status-operational/10 text-status-operational backdrop-blur-sm shadow-lg">
                <CheckCircle2 className="h-5 w-5" />
                <AlertDescription className="text-sm font-medium pl-2">{success}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          {isOffline && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <Alert className="border-status-warning/40 bg-status-warning/10 text-status-warning backdrop-blur-sm shadow-lg">
                <AlertCircle className="h-5 w-5" />
                <AlertDescription className="text-sm font-medium pl-2">
                  Connection offline. Please check your internet connection to continue.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </motion.div>

        {/* Main Login Card */}
        <motion.div variants={itemVariants}>
          <Card className="border-core-tertiary/40 bg-card/90 backdrop-blur-2xl shadow-2xl shadow-black/25 ring-1 ring-core-tertiary/30 relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-natural-accent/5 via-transparent to-core-tertiary/5 pointer-events-none" />
            
            <CardHeader className="space-y-2 pb-8 text-center relative">
              <h2 className="text-2xl font-bold text-core-white tracking-tight">Sign In</h2>
              <p className="text-core-secondary text-sm font-medium">
                Enter your credentials to access the system
              </p>
            </CardHeader>

            <CardContent className="space-y-8 relative">
              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-core-light flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-4 bg-background/60 border border-core-tertiary/50 rounded-xl text-core-white placeholder-core-secondary/80 focus:border-natural-accent/60 focus:ring-2 focus:ring-natural-accent/25 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-inner hover:border-core-tertiary/70"
                      required
                      disabled={isLoading || authLoading || isOffline}
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <div className="w-2 h-2 bg-natural-accent/60 rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-core-light flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-4 pr-12 bg-background/60 border border-core-tertiary/50 rounded-xl text-core-white placeholder-core-secondary/80 focus:border-natural-accent/60 focus:ring-2 focus:ring-natural-accent/25 focus:outline-none transition-all duration-300 backdrop-blur-sm shadow-inner hover:border-core-tertiary/70"
                      required
                      disabled={isLoading || authLoading || isOffline}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-core-secondary hover:text-core-light transition-colors duration-200 group"
                      disabled={isLoading || authLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      ) : (
                        <Eye className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-5 h-5 rounded-md border-2 border-core-tertiary bg-background/60 text-natural-accent focus:ring-natural-accent/25 focus:ring-offset-0 transition-colors duration-200"
                      />
                      {rememberMe && (
                        <CheckCircle2 className="w-3 h-3 text-natural-accent absolute top-1 left-1 pointer-events-none" />
                      )}
                    </div>
                    <span className="text-sm text-core-secondary group-hover:text-core-light transition-colors duration-200 font-medium">
                      Remember me for 30 days
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-natural-accent hover:text-natural-accent/80 transition-colors duration-200 font-semibold hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading || authLoading || isOffline}
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                  className="w-full py-4 px-6 bg-gradient-to-r from-natural-accent via-natural-accent to-natural-accent/90 hover:from-natural-accent/95 hover:via-natural-accent/90 hover:to-natural-accent/85 disabled:from-core-tertiary disabled:via-core-tertiary disabled:to-core-tertiary disabled:text-core-secondary text-core-primary font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-natural-accent/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-xl shadow-natural-accent/25 hover:shadow-2xl hover:shadow-natural-accent/40 disabled:shadow-none relative overflow-hidden"
                >
                  {/* Button shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transition-transform duration-700 hover:translate-x-full" />
                  
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-core-primary/30 border-t-core-primary rounded-full"
                      />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span>Sign In to Dashboard</span>
                  )}
                </motion.button>
              </form>

              {/* Security Notice */}
              <div className="pt-6 border-t border-core-tertiary/30">
                <div className="flex items-center justify-center space-x-2 text-xs text-core-secondary/80 font-medium">
                  <Shield className="w-4 h-4 text-status-operational" />
                  <span>Secured by enterprise-grade encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Information */}
        <motion.div variants={itemVariants}>
          <div className="bg-card/50 backdrop-blur-xl border border-core-tertiary/30 rounded-2xl p-6 shadow-xl">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-status-operational rounded-full animate-pulse" />
                <p className="text-sm font-semibold text-core-white">
                  System Status: Online
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-core-secondary font-medium">
                  © 2024 Ararat Oil Management System
                </p>
                <p className="text-xs text-core-secondary/80">
                  Professional fuel operations management platform
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </WindowContainer>
  );
};