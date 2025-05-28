import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { AuthConfig } from "../types/auth.types";
import { hasRequiredRole } from "../utils/auth.utils";
import { APP_ROUTES } from "@/core/config/routes";

export function useAuthGuard(config: AuthConfig = {}) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate(APP_ROUTES.AUTH.path);
        return;
      }

      if (config.requiredRole && !hasRequiredRole(user, config.requiredRole)) {
        navigate(config.redirectTo || "/unauthorized");
      }
    }
  }, [user, isLoading, config.requiredRole, config.redirectTo, navigate]);

  return {
    isAuthenticated: !!user,
    isLoading,
    user,
  };
}
