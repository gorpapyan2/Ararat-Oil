/**
 * Routes Configuration
 * 
 * This file contains the route configuration for the application.
 * It defines all routes, their paths, and metadata.
 */

/**
 * Route interface
 */
export interface RouteConfig {
  path: string;
  title: string;
  description?: string;
  auth?: boolean;
  exact?: boolean;
  redirectTo?: string;
  children?: Record<string, RouteConfig>;
}

/**
 * Main application routes
 */
export const APP_ROUTES = {
  // Dashboard route
  DASHBOARD: {
    path: '/',
    title: 'Dashboard',
    description: 'Main dashboard with overview of operations',
    auth: true,
    exact: true,
  },
  
  // Authentication routes
  AUTH: {
    path: '/auth',
    title: 'Authentication',
    auth: false,
    exact: true,
  },
  
  // Fuel Management routes
  FUEL_MANAGEMENT: {
    path: '/fuel-management',
    title: 'Fuel Management',
    description: 'Manage fuel inventory and systems',
    auth: true,
    children: {
      FILLING_SYSTEMS: {
        path: '/fuel-management/filling-systems',
        title: 'Filling Systems',
        description: 'Manage fuel dispensing systems',
        auth: true,
      },
      TANKS: {
        path: '/fuel-management/tanks',
        title: 'Tanks',
        description: 'Manage fuel storage tanks',
        auth: true,
      },
      FUEL_SUPPLIES: {
        path: '/fuel-management/fuel-supplies',
        title: 'Fuel Supplies',
        description: 'Track fuel deliveries and supplies',
        auth: true,
      },
      PROVIDERS: {
        path: '/fuel-management/providers',
        title: 'Providers',
        description: 'Manage fuel suppliers and providers',
        auth: true,
      },
      FUEL_PRICES: {
        path: '/fuel-management/fuel-prices',
        title: 'Fuel Prices',
        description: 'Manage fuel pricing',
        auth: true,
      },
    },
  },
  
  // Finance routes
  FINANCE: {
    path: '/finance',
    title: 'Finance',
    description: 'Financial management and reporting',
    auth: true,
    children: {
      SALES: {
        path: '/finance/sales',
        title: 'Sales',
        description: 'Track and manage sales',
        auth: true,
      },
      SHIFTS: {
        path: '/finance/shifts',
        title: 'Shifts',
        description: 'Manage employee shifts and cash handling',
        auth: true,
      },
      EXPENSES: {
        path: '/finance/expenses',
        title: 'Expenses',
        description: 'Track and manage expenses',
        auth: true,
      },
    },
  },
  
  // Employee management
  EMPLOYEES: {
    path: '/employees',
    title: 'Employees',
    description: 'Manage employee records and access',
    auth: true,
  },
  
  // Synchronization
  SYNC: {
    path: '/syncup',
    title: 'Supabase Sync',
    description: 'Database synchronization tools',
    auth: true,
  },
  
  // Settings routes
  SETTINGS: {
    path: '/settings',
    title: 'Settings',
    description: 'Application settings and preferences',
    auth: true,
    children: {
      PROFILE: {
        path: '/settings/profile',
        title: 'Profile Settings',
        description: 'Manage user profile information',
        auth: true,
      },
      APPEARANCE: {
        path: '/settings/appearance',
        title: 'Appearance Settings',
        description: 'Customize the application appearance',
        auth: true,
      },
      NOTIFICATIONS: {
        path: '/settings/notifications',
        title: 'Notification Settings',
        description: 'Manage notification preferences',
        auth: true,
      },
      SECURITY: {
        path: '/settings/security',
        title: 'Security Settings',
        description: 'Manage security preferences and permissions',
        auth: true,
      },
    },
  },
  
  // Debug/Development routes
  DEBUG: {
    path: '/debug',
    title: 'Debug Tools',
    description: 'Development and debugging tools',
    auth: true,
  },
  
  // Legacy routes (redirects)
  LEGACY: {
    FILLING_SYSTEMS: {
      path: '/filling-systems',
      redirectTo: '/fuel-management/filling-systems',
      title: 'Filling Systems',
      auth: true,
    },
    FUEL_SUPPLIES: {
      path: '/fuel-supplies',
      redirectTo: '/fuel-management/fuel-supplies',
      title: 'Fuel Supplies',
      auth: true,
    },
    SALES: {
      path: '/sales',
      redirectTo: '/finance/sales',
      title: 'Sales',
      auth: true,
    },
    SHIFTS: {
      path: '/shifts',
      redirectTo: '/finance/shifts',
      title: 'Shifts',
      auth: true,
    },
    EXPENSES: {
      path: '/expenses',
      redirectTo: '/finance/expenses',
      title: 'Expenses',
      auth: true,
    },
  },
};

/**
 * Development/test routes
 */
export const DEV_ROUTES = {
  DEV_TOOLS: {
    path: '/dev',
    title: 'Development Tools',
    description: 'Developer tools and utilities',
    auth: true,
  },
  RESPONSIVE_TEST: {
    path: '/dev/responsive-test',
    title: 'Responsive Testing',
    description: 'Test responsive layouts',
    auth: true,
  },
  TOAST_TEST: {
    path: '/dev/toast-test',
    title: 'Toast Testing',
    description: 'Test toast notifications',
    auth: true,
  },
  CARD_COMPONENTS: {
    path: '/dev/card-components',
    title: 'Card Components',
    description: 'View card component variations',
    auth: true,
  },
  BUTTON_COMPONENTS: {
    path: '/dev/button-components',
    title: 'Button Components',
    description: 'View button component variations',
    auth: true,
  },
  HOOKS_SHOWCASE: {
    path: '/dev/hooks-showcase',
    title: 'Hooks Architecture Showcase',
    description: 'Showcase of the refactored hooks architecture',
    auth: true,
  },
  CONNECTION_INFO: {
    path: '/dev/connection-info',
    title: 'Connection Information',
    description: 'View connection status and details',
    auth: true,
  },
};

/**
 * Get full path for a nested route
 * @param parentPath Parent route path
 * @param childPath Child route path
 * @returns Combined path
 */
export function combinePaths(parentPath: string, childPath: string): string {
  // Normalize paths to ensure no double slashes
  const normalizedParent = parentPath.endsWith('/') 
    ? parentPath.slice(0, -1) 
    : parentPath;
    
  const normalizedChild = childPath.startsWith('/') 
    ? childPath 
    : `/${childPath}`;
    
  return `${normalizedParent}${normalizedChild}`;
}

/**
 * Find a route configuration by path
 * @param path Route path to find
 * @returns The route configuration or undefined
 */
export function findRouteByPath(path: string): RouteConfig | undefined {
  // Normalize path for comparison
  const normalizedPath = path.endsWith('/') && path !== '/' 
    ? path.slice(0, -1) 
    : path;
  
  // Helper function to recursively search routes
  const findRoute = (routes: Record<string, RouteConfig>): RouteConfig | undefined => {
    for (const key in routes) {
      const route = routes[key];
      
      // Check if the current route matches
      if (route.path === normalizedPath) {
        return route;
      }
      
      // Check in children
      if (route.children) {
        const childMatch = findRoute(route.children);
        if (childMatch) {
          return childMatch;
        }
      }
    }
    
    return undefined;
  };
  
  // Search in main routes first
  const mainMatch = findRoute(APP_ROUTES as unknown as Record<string, RouteConfig>);
  if (mainMatch) {
    return mainMatch;
  }
  
  // Then search in dev routes
  return findRoute(DEV_ROUTES as unknown as Record<string, RouteConfig>);
} 