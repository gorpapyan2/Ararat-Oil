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
export function useRoutePrefetch(routePath: string, options: PrefetchOptions = {}) {
  const { strategy = "hover", timeout = 2000 } = options;

  // Map route paths to their respective module imports
  const prefetchRoute = useCallback(() => {
    const routeModules: Record<string, () => Promise<any>> = {
      "/": () => import("@/pages/DashboardNew"),
      "/fuel-management": () => import("@/pages/FuelManagement"),
      "/sales": () => import("@/pages/SalesNew"),
      "/employees": () => import("@/pages/EmployeesNew"),
      "/expenses": () => import("@/pages/Expenses"),
      "/settings": () => import("@/pages/settings"),
      "/settings/profile": () => import("@/pages/settings/ProfileSettings"),
      "/settings/appearance": () => import("@/pages/settings/AppearanceSettings"),
      "/settings/notifications": () => import("@/pages/settings/NotificationSettings"),
      "/settings/security": () => import("@/pages/settings/SecuritySettings"),
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
        (window as any).requestIdleCallback(() => prefetchRoute());
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