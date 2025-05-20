import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '../hooks/useAuthGuard';
import type { AuthConfig } from '../types/auth.types';

interface AuthGuardProps {
  children: React.ReactNode;
  config?: AuthConfig;
}

export function AuthGuard({ children, config }: AuthGuardProps) {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthGuard(config);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
} 