import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { AuthConfig } from "../types/auth.types";
import { Loading } from "@/core/components/ui/loading";
import { APP_ROUTES } from "@/core/config/routes";

interface AuthGuardProps {
  children: React.ReactNode;
  config?: AuthConfig;
}

export function AuthGuard({ children, config }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Loading variant="page" text="Checking authentication..." />
    );
  }

  if (!user) {
    return <Navigate to={APP_ROUTES.AUTH.path} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
