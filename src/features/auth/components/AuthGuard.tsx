import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/hooks/useAuth";
import { Loading } from "@/core/components/ui/loading";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading, isOffline } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Loading variant="page" text="Checking authentication..." />
    );
  }

  // If offline, let the user continue to see cached content
  if (isOffline && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
