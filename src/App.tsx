import React, { Component, ErrorInfo, ReactNode, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Layout Components
import { MainLayout } from "@/layouts/MainLayout";
import { AuthProvider } from "@/features/auth/components/AuthProvider";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { ThemeProvider } from "@/shared/components/ui/theme-provider";

// Loading Component
import { Loading } from "@/core/components/ui/loading";

// Lazy load components for better performance
const NavigationPage = lazy(() => import('@/features/navigations/pages/NavigationPage').then(m => ({ default: m.NavigationPage })));
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage').then(m => ({ default: m.AuthPage })));
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then(m => ({ default: m.ReportsPage })));

// Management Module Components
const ManagementPage = lazy(() => import("@/features/management/ManagementPage"));
const ManagementEmployeesPage = lazy(() => import("@/features/management/EmployeesPage"));

// Shifts Module Components
const ShiftsMainPage = lazy(() => import("@/features/shifts/pages/ShiftsMainPage"));
const ShiftsManagementPage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftsManagementPage })));
const ShiftsPage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftsPage })));
const ShiftsDashboardPage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftsDashboard })));
const ShiftOpenPage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftOpen })));
const ShiftClosePage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftClose })));
const ShiftDetailsPage = lazy(() => import('./features/shifts').then(module => ({ default: module.ShiftDetails })));

// Employees Module Components
const EmployeesMainPage = lazy(() => import("@/features/employees/pages/EmployeesMainPage"));

// Sales Module Components
const SalesMainPage = lazy(() => import("@/features/sales/pages/SalesMainPage"));

// Finance Module Components
const FinancePage = lazy(() => import("@/features/finance/pages/FinancePage").then(m => ({ default: m.FinancePage })));
const FinanceDashboardPage = lazy(() => import("@/features/finance/pages/FinanceDashboard"));
const ExpensesPage = lazy(() => import("@/features/finance/pages/ExpensesPage"));
const RevenuePage = lazy(() => import("@/features/finance/pages/RevenuePage"));
const PaymentMethodsPage = lazy(() => import("@/features/finance/pages/PaymentMethodsPage"));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage").then(m => ({ default: m.SalesPage })));

// Fuel Module Components
const FuelManagementPage = lazy(() => import("@/features/fuel-management/pages/FuelManagementPage").then(m => ({ default: m.FuelManagementPage })));
const FuelDashboardPage = lazy(() => import("@/features/fuel-management/pages/FuelDashboardPage"));
const TanksPage = lazy(() => import("@/features/fuel-management/pages/TanksPage"));
const FuelSuppliesPage = lazy(() => import("@/features/fuel-management/pages/FuelSuppliesPage"));
const FuelPricesPage = lazy(() => import("@/features/fuel-management/pages/FuelPricesPage"));
const FuelTypesPage = lazy(() => import("@/features/fuel-management/pages/FuelTypesPage"));
const FillingSystemsPage = lazy(() => import("@/features/fuel-management/pages/FillingSystemsPage"));
const ProvidersPage = lazy(() => import("@/features/fuel-management/pages/ProvidersPage"));

// Settings
const SettingsPage = lazy(() => import("@/features/settings/pages/SettingsPage").then(m => ({ default: m.SettingsPage })));

// Error Boundary Component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  console.error("React Error Boundary caught an error:", error);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4 text-card-foreground">Something went wrong</h1>
        </div>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The application encountered an unexpected error and needs to be restarted.
          </p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
              Error Details (click to expand)
            </summary>
            <div className="bg-muted p-4 rounded-md text-xs font-mono text-foreground">
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
    <AuthGuard>
      <MainLayout>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </MainLayout>
    </AuthGuard>
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <Router
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
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

                  {/* Main Dashboard */}
                  <Route 
                    path="/" 
                    element={
                      <ProtectedRoute>
                        <NavigationPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Shifts Module Routes */}
                  <Route 
                    path="/shifts" 
                    element={
                      <ProtectedRoute>
                        <ShiftsMainPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Employees Module Routes */}
                  <Route 
                    path="/employees" 
                    element={
                      <ProtectedRoute>
                        <EmployeesMainPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Sales Module Routes */}
                  <Route 
                    path="/sales" 
                    element={
                      <ProtectedRoute>
                        <SalesMainPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Management Module Routes */}
                  <Route 
                    path="/management" 
                    element={
                      <ProtectedRoute>
                        <ManagementPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/employees" 
                    element={
                      <ProtectedRoute>
                        <ManagementEmployeesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts" 
                    element={
                      <ProtectedRoute>
                        <ShiftsManagementPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts/overview" 
                    element={
                      <ProtectedRoute>
                        <ShiftsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts/dashboard" 
                    element={
                      <ProtectedRoute>
                        <ShiftsDashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts/open" 
                    element={
                      <ProtectedRoute>
                        <ShiftOpenPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts/close" 
                    element={
                      <ProtectedRoute>
                        <ShiftClosePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/management/shifts/details" 
                    element={
                      <ProtectedRoute>
                        <ShiftDetailsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Finance Module Routes */}
                  <Route 
                    path="/finance" 
                    element={
                      <ProtectedRoute>
                        <FinancePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/finance/dashboard" 
                    element={
                      <ProtectedRoute>
                        <FinanceDashboardPage />
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
                    path="/finance/revenue" 
                    element={
                      <ProtectedRoute>
                        <RevenuePage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/finance/payment-methods" 
                    element={
                      <ProtectedRoute>
                        <PaymentMethodsPage />
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

                  {/* Fuel Module Routes */}
                  <Route 
                    path="/fuel" 
                    element={
                      <ProtectedRoute>
                        <FuelManagementPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/dashboard" 
                    element={
                      <ProtectedRoute>
                        <FuelDashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/tanks" 
                    element={
                      <ProtectedRoute>
                        <TanksPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/supplies" 
                    element={
                      <ProtectedRoute>
                        <FuelSuppliesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/prices" 
                    element={
                      <ProtectedRoute>
                        <FuelPricesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/types" 
                    element={
                      <ProtectedRoute>
                        <FuelTypesPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/filling-systems" 
                    element={
                      <ProtectedRoute>
                        <FillingSystemsPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/fuel/providers" 
                    element={
                      <ProtectedRoute>
                        <ProvidersPage />
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

                  {/* Settings Routes */}
                  <Route 
                    path="/settings" 
                    element={
                      <ProtectedRoute>
                        <SettingsPage />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Catch all routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AuthProvider>
            </Router>
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}

export default App;

