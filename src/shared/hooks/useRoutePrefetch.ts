import { useCallback, useEffect } from "react";

export type PrefetchStrategy = "hover" | "visible" | "eager" | "idle";

interface PrefetchOptions {
  strategy?: PrefetchStrategy;
  timeout?: number;
}

/**
 * Hook for prefetching routes
 * @param routePath The path of the route to prefetch
 * @param options Prefetch options
 * @returns Handlers for prefetching (onMouseEnter, onFocus)
 */
export function useRoutePrefetch(
  routePath: string,
  options: PrefetchOptions = {}
) {
  const { strategy = "hover", timeout = 2000 } = options;

  // Map route paths to their respective module imports
  const prefetchRoute = useCallback(() => {
    const routeModules: Record<string, () => Promise<{ default: React.ComponentType }>> = {
      "/": () => import("@/features/dashboard/pages/DashboardNew"),
      "/fuel-management": () => import("@/features/fuel-management/pages").then(module => ({ default: module.FuelManagementDashboard })),
      "/sales": () => import("@/features/sales/pages/SalesNew"),
      "/employees": () => import("@/features/employees/pages").then(module => ({ default: module.EmployeesPage })),
      "/expenses": () => import("@/features/expenses/pages/ExpensesPage").then(module => ({ default: module.ExpensesPage })),
      "/settings": () => import("@/features/settings/pages/SettingsPage").then(module => ({ default: module.SettingsPage })),
      "/settings/profile": () => import("@/features/settings/pages/ProfileSettings"),
      "/settings/appearance": () => import("@/features/settings/pages/AppearanceSettings"),
      "/settings/notifications": () => import("@/features/settings/pages/NotificationSettings"),
      "/settings/security": () => import("@/features/settings/pages/SecuritySettings"),
    };

    if (routeModules[routePath]) {
      return routeModules[routePath]();
    }

    return Promise.resolve();
  }, [routePath]);

  // Implement different prefetch strategies
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (strategy === "eager") {
      // Prefetch immediately
      prefetchRoute();
    } else if (strategy === "idle") {
      // Use requestIdleCallback or setTimeout as fallback
      if ("requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(() => prefetchRoute());
      } else {
        timeoutId = setTimeout(prefetchRoute, timeout);
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [prefetchRoute, strategy, timeout]);

  // Return handlers for manual triggering
  return {
    onMouseEnter: strategy === "hover" ? prefetchRoute : undefined,
    onFocus: strategy === "hover" ? prefetchRoute : undefined,
    prefetch: prefetchRoute,
  };
}
