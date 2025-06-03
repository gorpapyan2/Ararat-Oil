import React, { Component, ErrorInfo, ReactNode, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Layout Components
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { ThemeProvider } from "@/core/providers/theme-provider";

// Loading Component
import { Loading } from "@/core/components/ui/loading";

// Lazy load components for better performance
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const NavigationPage = lazy(() => import('@/features/dashboard/pages/NavigationPage').then(m => ({ default: m.NavigationPage })));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));
const DataSyncPage = lazy(() => import('@/features/data-sync/pages/DataSyncPage').then(m => ({ default: m.DataSyncPage })));

// Employees
const EmployeesPage = lazy(() => import("@/features/employees/pages/EmployeesPage").then(m => ({ default: m.EmployeesPage })));

// Finance
const FinancePage = lazy(() => import("@/features/finance/pages/FinancePage").then(m => ({ default: m.FinancePage })));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage").then(m => ({ default: m.SalesPage })));
const ShiftsPage = lazy(() => import("@/features/shifts/pages/ShiftsPage").then(m => ({ default: m.ShiftsPage })));
const ExpensesPage = lazy(() => import("@/features/expenses/pages/ExpensesPage").then(m => ({ default: m.ExpensesPage })));

// Settings
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));

// Fuel Management
const FuelManagementDashboard = lazy(() => import("@/features/fuel-management/pages/FuelManagementDashboard").then(m => ({ default: m.FuelManagementDashboard })));
const FuelPricesPage = lazy(() => import("@/features/fuel-management/pages/FuelPricesPage"));
const TanksPage = lazy(() => import("@/features/fuel-management/pages/TanksPage"));
const FuelSuppliesPage = lazy(() => import("@/features/fuel-management/pages/FuelSuppliesPage"));
const FillingSystemsPage = lazy(() => import("@/features/fuel-management/pages/FillingSystemsPage"));
const ProvidersPage = lazy(() => import("@/features/fuel-management/pages/ProvidersPage"));
const FuelSalesPage = lazy(() => import("@/features/fuel-management/pages/FuelSalesPage"));

// Error Boundary Component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error("React Error Boundary caught an error:", error);
  
  return (
    <div className="min-h-screen flex-center">
      <div className="card max-w-md w-full">
        <div className="card-header text-center">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-card-foreground">Something went wrong</h1>
        </div>
        <div className="card-content space-y-4">
          <p className="text-muted-foreground">
            The application encountered an unexpected error and needs to be restarted.
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              Error Details (click to expand)
            </summary>
            <div className="bg-muted p-4 rounded-md text-xs font-mono">
              <p><strong>Error:</strong> {error.name}</p>
              <p><strong>Message:</strong> {error.message}</p>
              <p><strong>Stack:</strong></p>
              <pre className="whitespace-pre-wrap overflow-x-auto">
                {error.stack}
              </pre>
            </div>
          </details>
          <div className="flex gap-2">
            <button
              onClick={resetErrorBoundary}
              className="btn btn-primary flex-1"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-secondary flex-1"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// Create QueryClient with proper configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        console.error(`Query failed (attempt ${failureCount + 1}):`, error);
        return failureCount < 2;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: (failureCount, error) => {
        console.error(`Mutation failed (attempt ${failureCount + 1}):`, error);
        return failureCount < 1;
      },
    },
  },
});

// Loading Fallback Component
function LoadingFallback() {
  return <Loading variant="page" text="Loading Ararat Oil Management System..." />;
}

// Protected Route Component
function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </MainLayout>
  );
}

// Public Route Component
function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Authentication Routes */}
                <Route 
                  path="/auth" 
                  element={
                    <PublicRoute>
                      <AuthPage />
                    </PublicRoute>
                  } 
                />

                {/* Dashboard */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={<Navigate to="/" replace />} 
                />

                {/* Employees */}
                <Route 
                  path="/employees" 
                  element={
                    <ProtectedRoute>
                      <EmployeesPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Fuel Management Routes */}
                <Route 
                  path="/fuel" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel/tanks" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel/inventory" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel/pumps" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management" 
                  element={
                    <ProtectedRoute>
                      <FuelManagementDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/tanks" 
                  element={
                    <ProtectedRoute>
                      <TanksPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/filling-systems" 
                  element={
                    <ProtectedRoute>
                      <FillingSystemsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/fuel-supplies" 
                  element={
                    <ProtectedRoute>
                      <FuelSuppliesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/providers" 
                  element={
                    <ProtectedRoute>
                      <ProvidersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/prices" 
                  element={
                    <ProtectedRoute>
                      <FuelPricesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/fuel-management/sales" 
                  element={
                    <ProtectedRoute>
                      <FuelSalesPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Finance Routes */}
                <Route 
                  path="/finance" 
                  element={
                    <ProtectedRoute>
                      <FinancePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/finance/reports" 
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/finance/expenses" 
                  element={
                    <ProtectedRoute>
                      <ExpensesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/finance/sales" 
                  element={
                    <ProtectedRoute>
                      <SalesPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Management Routes */}
                <Route 
                  path="/management" 
                  element={
                    <ProtectedRoute>
                      <EmployeesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/management/shifts" 
                  element={
                    <ProtectedRoute>
                      <ShiftsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Reports Routes */}
                <Route 
                  path="/reports" 
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports/daily" 
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/reports/monthly" 
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Settings Routes */}
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings/system" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings/users" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings/backup" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings/integrations" 
                  element={
                    <ProtectedRoute>
                      <DataSyncPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Navigation Page */}
                <Route 
                  path="/navigation" 
                  element={
                    <ProtectedRoute>
                      <NavigationPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Catch all - redirect to dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              <ReactQueryDevtools initialIsOpen={false} />
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;

