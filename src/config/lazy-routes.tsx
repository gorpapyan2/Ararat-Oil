/**
 * Lazy Loading Routes Configuration
 * 
 * This file defines lazy-loaded components for better code splitting
 * and reduced initial bundle size.
 */

import React, { Suspense } from 'react';
import { createLazyComponent, performanceMonitor } from '@/utils/bundle-optimization';
import { Loading } from '@/shared/components/ui/Loading';

// Loading fallback component
const PageLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loading size="lg" variant="fuel" text="Loading page..." />
  </div>
);

// Create lazy loader for each feature
const createFeatureLazyPage = (featureName: string, pageName: string) => {
  performanceMonitor.startTiming(`${featureName}-${pageName}`);
  
  return createLazyComponent(
    () => import(`@/features/${featureName}/pages/${pageName}`),
    { preload: false }
  );
};

// Lazy-loaded page components
export const LazyPages = {
  // Dashboard
  Dashboard: createFeatureLazyPage('dashboard', 'DashboardPage'),
  
  // Finance
  FinanceRevenue: createFeatureLazyPage('finance', 'RevenueAnalyticsPage'),
  FinanceExpenses: createFeatureLazyPage('finance', 'ExpensesPage'),
  FinanceTransactions: createFeatureLazyPage('finance', 'TransactionsPage'),
  FinancePaymentMethods: createFeatureLazyPage('finance', 'PaymentMethodsPage'),
  ExpenseCreate: createFeatureLazyPage('finance', 'ExpenseCreate'),
  ExpenseForm: createFeatureLazyPage('finance', 'ExpenseForm'),
  
  // Fuel Management
  FuelManagement: createFeatureLazyPage('fuel-management', 'FuelManagementPage'),
  FuelDashboard: createFeatureLazyPage('fuel-management', 'FuelDashboardPage'),
  FuelSales: createFeatureLazyPage('fuel-management', 'FuelSalesPage'),
  PetrolProviders: createFeatureLazyPage('fuel-management', 'PetrolProviders'),
  
  // Sales
  Sales: createFeatureLazyPage('sales', 'SalesPage'),
  
  // Shifts
  Shifts: createFeatureLazyPage('shifts', 'Shifts'),
  ShiftDetails: createFeatureLazyPage('shifts', 'ShiftDetails'),
  
  // Settings
  Settings: createFeatureLazyPage('settings', 'SettingsPage'),
  AppearanceSettings: createFeatureLazyPage('settings', 'AppearanceSettings'),
  AccountSettings: createFeatureLazyPage('settings', 'AccountSettings'),
  
  // Navigation
  Navigation: createFeatureLazyPage('navigations', 'NavigationPage'),
  
  // Layout
  Index: createFeatureLazyPage('layout', 'Index'),
};

// Wrapper component with Suspense
export const createLazyRoute = (LazyComponent: React.LazyExoticComponent<any>) => {
  return (props: any) => (
    <Suspense fallback={<PageLoadingFallback />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Preloading strategies
export const preloadStrategies = {
  // Preload pages likely to be visited next
  preloadByRoute: (currentRoute: string) => {
    const preloadMap: Record<string, string[]> = {
      '/dashboard': ['finance', 'fuel-management', 'sales'],
      '/finance': ['finance-expenses', 'finance-revenue'],
      '/fuel-management': ['fuel-sales', 'petrol-providers'],
      '/sales': ['shifts'],
      '/settings': ['appearance-settings', 'account-settings'],
    };
    
    const toPreload = preloadMap[currentRoute] || [];
    toPreload.forEach(route => {
      // Preload after a delay to not impact current page performance
      setTimeout(() => {
        import(`@/features/${route}/index.ts`).catch(() => {
          // Ignore preload failures
        });
      }, 2000);
    });
  },
  
  // Preload on user interaction (hover, focus)
  preloadOnInteraction: (featureName: string) => {
    return {
      onMouseEnter: () => {
        import(`@/features/${featureName}/index.ts`).catch(() => {});
      },
      onFocus: () => {
        import(`@/features/${featureName}/index.ts`).catch(() => {});
      },
    };
  },
  
  // Preload critical features immediately
  preloadCritical: () => {
    const criticalFeatures = ['dashboard', 'finance'];
    
    criticalFeatures.forEach(feature => {
      setTimeout(() => {
        import(`@/features/${feature}/index.ts`).catch(() => {});
      }, 1000);
    });
  },
};

// Route-based code splitting helper
export const useRoutePreloading = (currentRoute: string) => {
  React.useEffect(() => {
    preloadStrategies.preloadByRoute(currentRoute);
  }, [currentRoute]);
};

// Bundle size monitoring hook
export const useBundleMonitoring = () => {
  React.useEffect(() => {
    // Report bundle performance after page load
    const timeout = setTimeout(() => {
      performanceMonitor.generateReport();
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, []);
};

export default {
  LazyPages,
  createLazyRoute,
  preloadStrategies,
  useRoutePreloading,
  useBundleMonitoring,
}; 