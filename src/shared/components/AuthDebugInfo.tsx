import React from 'react';
import { supabase } from '@/core/api';
import { Badge } from '@/core/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/core/components/ui/card';
import { Button } from '@/core/components/ui/button';
import { User, Shield, Key, LogIn } from 'lucide-react';

export function AuthDebugInfo() {
  const [authInfo, setAuthInfo] = React.useState<{
    user: any;
    session: any;
    isAuthenticated: boolean;
    error?: string;
  }>({
    user: null,
    session: null,
    isAuthenticated: false
  });

  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const checkAuth = async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setAuthInfo({
          user: null,
          session: null,
          isAuthenticated: false,
          error: sessionError.message
        });
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      setAuthInfo({
        user: userData.user,
        session: sessionData.session,
        isAuthenticated: !!userData.user && !userError,
        error: userError?.message
      });
    } catch (error) {
      setAuthInfo({
        user: null,
        session: null,
        isAuthenticated: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  const handleQuickLogin = async () => {
    setIsLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'dev@example.com',
        password: 'password123'
      });

      if (error) {
        console.error('Login error:', error);
        setAuthInfo(prev => ({ ...prev, error: error.message }));
      } else {
        console.log('Login successful:', data);
        await checkAuth(); // Refresh auth info
      }
    } catch (error) {
      console.error('Login exception:', error);
      setAuthInfo(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Login failed' 
      }));
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Don't show in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Authentication Debug Info
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-600" />
          <span className="text-sm">Status:</span>
          <Badge className={authInfo.isAuthenticated ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"}>
            {authInfo.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Badge>
        </div>
        
        {authInfo.user && (
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-gray-600" />
            <span className="text-sm">User ID:</span>
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              {authInfo.user.id}
            </code>
          </div>
        )}
        
        {authInfo.user?.email && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Email:</span>
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              {authInfo.user.email}
            </code>
          </div>
        )}

        {authInfo.session && (
          <div className="flex items-center gap-2">
            <span className="text-sm">Session Expires:</span>
            <code className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
              {new Date(authInfo.session.expires_at * 1000).toLocaleString()}
            </code>
          </div>
        )}
        
        {authInfo.error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            Error: {authInfo.error}
          </div>
        )}

        {!authInfo.isAuthenticated && (
          <div className="pt-2">
            <Button 
              onClick={handleQuickLogin}
              disabled={isLoggingIn}
              size="sm"
              className="w-full"
            >
              <LogIn className="h-3 w-3 mr-2" />
              {isLoggingIn ? 'Logging in...' : 'Quick Login (dev@example.com)'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 