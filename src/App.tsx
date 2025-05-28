import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/core/providers/theme-provider";
import { BreadcrumbProvider } from "@/core/providers/BreadcrumbProvider";
import { ErrorBoundary } from "@/shared/components/enhanced/ErrorBoundary";
import { MainLayout } from "@/layouts/MainLayout";
import { Loading } from "@/core/components/ui/loading";
import { AuthGuard } from "@/features/auth/components/AuthGuard";
import { APP_ROUTES } from "@/core/config/routes";

// Lazy load pages for better performance
const DashboardPage = lazy(() => import("@/features/dashboard").then(module => ({ default: module.DashboardPage })));
const AuthPage = lazy(() => import("@/pages/Auth"));
const FuelManagementPage = lazy(() => import("@/pages/FuelManagement"));
const FuelSuppliesPage = lazy(() => import("@/pages/fuel-management/FuelSuppliesPage"));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage").then(module => ({ default: module.SalesPage })));
const ShiftsPage = lazy(() => import("@/features/shifts").then(module => ({ default: module.ShiftsPage })));
const ExpensesPage = lazy(() => import("@/features/finance").then(module => ({ default: module.ExpensesPage })));
const TransactionsPage = lazy(() => import("@/features/finance").then(module => ({ default: module.TransactionsPage })));
const EmployeesPage = lazy(() => import("@/features/employees").then(module => ({ default: module.EmployeesPage })));
const SettingsPage = lazy(() => import("@/features/settings").then(module => ({ default: module.SettingsPage })));
const DebugPage = lazy(() => import("@/pages/dev/DevTools"));
const NotFoundPage = lazy(() => import("@/pages/NotFound"));

// React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading fallback component
const PageLoadingFallback: React.FC = () => (
  <Loading variant="page" text="Loading page..." />
);

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthGuard>
    {children}
  </AuthGuard>
);

// Main App component
const App: React.FC = () => {
  return (
    <ErrorBoundary
      fallback={(error, resetError) => (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Application Error
            </h1>
            <p className="text-gray-600 mb-4">
              {error.message || "A critical error occurred. Please refresh the page or contact support."}
            </p>
            <div className="space-x-4">
              <button
                onClick={resetError}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider>
            <BreadcrumbProvider>
              <div className="min-h-screen bg-background">
                <Routes>
                  {/* Public auth route */}
                  <Route
                    path={APP_ROUTES.AUTH.path}
                    element={
                      <ErrorBoundary
                        fallback={(error, resetError) => (
                          <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                            <div className="text-center max-w-md">
                              <h2 className="text-xl font-semibold text-red-600 mb-4">
                                Something went wrong
                              </h2>
                              <p className="text-gray-600 mb-4">
                                {error.message || "An unexpected error occurred while loading this page."}
                              </p>
                              <button
                                onClick={resetError}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                              >
                                Try again
                              </button>
                            </div>
                          </div>
                        )}
                      >
                        <Suspense fallback={<PageLoadingFallback />}>
                          <AuthPage />
                        </Suspense>
                      </ErrorBoundary>
                    }
                  />

                  {/* Protected routes with layout */}
                  <Route
                    path="/*"
                    element={
                      <ProtectedRoute>
                        <MainLayout>
                          <Routes>
                            {/* Dashboard */}
                            <Route
                              path={APP_ROUTES.DASHBOARD.path}
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <DashboardPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            {/* Fuel Management */}
                            <Route
                              path="/fuel-management"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <FuelManagementPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/fuel-management/fuel-supplies"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <FuelSuppliesPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            {/* Finance */}
                            <Route
                              path="/finance/sales"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <SalesPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/finance/shifts"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <ShiftsPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/finance/expenses"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <ExpensesPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/finance/transactions"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <TransactionsPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            {/* Legacy redirects */}
                            <Route
                              path="/fuel-supplies"
                              element={<Navigate to="/fuel-management/fuel-supplies" replace />}
                            />
                            <Route
                              path="/sales"
                              element={<Navigate to="/finance/sales" replace />}
                            />
                            <Route
                              path="/shifts"
                              element={<Navigate to="/finance/shifts" replace />}
                            />
                            <Route
                              path="/expenses"
                              element={<Navigate to="/finance/expenses" replace />}
                            />
                            <Route
                              path="/transactions"
                              element={<Navigate to="/finance/transactions" replace />}
                            />

                            {/* Other routes */}
                            <Route
                              path="/employees"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <EmployeesPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/settings"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <SettingsPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            <Route
                              path="/debug"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <DebugPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />

                            {/* Catch all - 404 */}
                            <Route
                              path="*"
                              element={
                                <ErrorBoundary
                                  fallback={(error, resetError) => (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
                                      <div className="text-center max-w-md">
                                        <h2 className="text-xl font-semibold text-red-600 mb-4">
                                          Something went wrong
                                        </h2>
                                        <p className="text-gray-600 mb-4">
                                          {error.message || "An unexpected error occurred while loading this page."}
                                        </p>
                                        <button
                                          onClick={resetError}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                        >
                                          Try again
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                >
                                  <Suspense fallback={<PageLoadingFallback />}>
                                    <NotFoundPage />
                                  </Suspense>
                                </ErrorBoundary>
                              }
                            />
                          </Routes>
                        </MainLayout>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>
            </BreadcrumbProvider>
          </ThemeProvider>
        </BrowserRouter>

        {/* React Query Devtools - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
