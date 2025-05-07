import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import { ThemeProvider } from "./components/theme-provider";
import { AdminShell } from "@/layouts/AdminShell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/ui/loading";
import ErrorBoundary from "@/components/ErrorBoundary";
// Import Auth directly since it's needed for initial load
import Auth from "@/pages/Auth";

// Create a fallback component for failed imports
const ImportErrorFallback = ({ pageName }: { pageName: string }) => (
  <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
    <h2 className="text-xl font-semibold mb-4">Failed to load {pageName} page</h2>
    <p className="mb-4">There was an error loading this page. Please try refreshing.</p>
    <button 
      onClick={() => window.location.reload()} 
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      Refresh Page
    </button>
  </div>
);


// Lazy load other page components with prefetching for critical routes
const DashboardNew = lazy(() => 
  import(/* webpackPrefetch: true, webpackChunkName: "dashboard" */ "@/pages/DashboardNew")
);

// New Fuel Management pages
const FuelManagementDashboard = lazy(() => 
  import(/* webpackChunkName: "fuel-dashboard" */ "@/pages/fuel-management/FuelManagementDashboard")
);
const FillingSystemsPage = lazy(() => 
  import(/* webpackChunkName: "filling-systems" */ "@/pages/fuel-management/FillingSystemsPage")
);
const TanksPage = lazy(() => 
  import(/* webpackChunkName: "tanks" */ "@/pages/fuel-management/TanksPage")
);
const FuelSuppliesPage = lazy(() => 
  import(/* webpackChunkName: "fuel-supplies" */ "@/pages/fuel-management/FuelSuppliesPage")
);

// Legacy fuel management page (will be removed later)
const FuelManagement = lazy(() => 
  import(/* webpackChunkName: "fuel-management" */ "@/pages/FuelManagement")
);

const EmployeesNew = lazy(() => 
  import(/* webpackChunkName: "employees" */ "@/pages/EmployeesNew")
);
const SalesNew = lazy(() => 
  import(/* webpackPrefetch: true, webpackChunkName: "sales" */ "@/pages/sales/SalesNew")
);
const SalesCreate = lazy(() => 
  import(/* webpackChunkName: "sales-create" */ "@/pages/sales/SalesCreate")
);
const FuelSupplyCreate = lazy(() => 
  import(/* webpackChunkName: "fuel-supply-create" */ "@/pages/fuel-supplies/FuelSupplyCreate")
);
const PetrolProviders = lazy(() => 
  import(/* webpackChunkName: "petrol-providers" */ "@/pages/PetrolProviders")
);
const Expenses = lazy(() => 
  import(/* webpackChunkName: "expenses" */ "@/pages/Expenses")
);
const Transactions = lazy(() => 
  import(/* webpackChunkName: "transactions" */ "@/pages/Transactions")
);
const TodoPage = lazy(() => 
  import(/* webpackChunkName: "todo" */ "@/components/todo")
);

// Use simple imports for the Shifts components
const Shifts = lazy(() => 
  import(/* webpackChunkName: "shifts" */ "@/pages/shifts/Shifts")
);
const ShiftClose = lazy(() => 
  import(/* webpackChunkName: "shift-close" */ "@/pages/shifts/ShiftClose")
);
const ShiftOpen = lazy(() => 
  import(/* webpackChunkName: "shift-open" */ "@/pages/shifts/ShiftOpen")
);
const ShiftDetails = lazy(() => 
  import(/* webpackChunkName: "shift-details" */ "@/pages/shifts/ShiftDetails")
);

const Settings = lazy(() => 
  import(/* webpackPrefetch: true, webpackChunkName: "settings" */ "@/pages/Settings")
);
// Development pages
const ResponsiveTestPage = lazy(() => import(/* webpackChunkName: "dev-responsive" */ "@/pages/dev/ResponsiveTestPage"));
const ToastTester = lazy(() => import(/* webpackChunkName: "dev-toast" */ "@/pages/dev/ToastTester"));
const DevTools = lazy(() => import(/* webpackChunkName: "dev-tools" */ "@/pages/dev/DevTools"));
const CardComponentsPage = lazy(() => import(/* webpackChunkName: "dev-cards" */ "@/pages/dev/CardComponentsPage"));
const ButtonComponentsPage = lazy(() => import(/* webpackChunkName: "dev-buttons" */ "@/pages/dev/ButtonComponentsPage"));
// Fix for named export

// Add new import for ConnectionInfo
const ConnectionInfo = lazy(() => import(/* webpackChunkName: "dev-connection" */ "@/pages/dev/ConnectionInfo"));
const DebugPage = lazy(() => import(/* webpackChunkName: "debug-page" */ "@/pages/DebugPage"));

// Import the ProvidersPage component
import ProvidersPage from "@/pages/fuel-management/ProvidersPage";
// Import FinancePage directly since it uses a named export
import { FinancePage } from "@/pages/finance/FinancePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loading variant="fullscreen" text="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <AuthProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/auth" element={<Auth />} />
                  
                  {/* Protected routes */}
                  <Route
                    path="/*"
                    element={
                      <RequireAuth>
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <AdminShell>
                                <Suspense fallback={<Loading variant="fullscreen" text="Loading dashboard..." />}>
                                  <DashboardNew />
                                </Suspense>
                              </AdminShell>
                            }
                          />
                          
                          {/* Fuel Management Routes */}
                          <Route
                            path="/fuel-management/*"
                            element={
                              <AdminShell>
                                <Routes>
                                  <Route
                                    index
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading fuel management..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Fuel Management" />}>
                                          <FuelManagementDashboard />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="filling-systems"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading filling systems..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Filling Systems" />}>
                                          <FillingSystemsPage />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="tanks"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading tanks..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Tanks" />}>
                                          <TanksPage />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="fuel-supplies"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading fuel supplies..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Fuel Supplies" />}>
                                          <FuelSuppliesPage />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="fuel-supplies/create"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading fuel supply create form..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Create Fuel Supply" />}>
                                          <FuelSupplyCreate />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="providers"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading providers..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Providers" />}>
                                          <ProvidersPage />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                </Routes>
                              </AdminShell>
                            }
                          />

                          {/* Finance Routes */}
                          <Route
                            path="/finance/*"
                            element={
                              <AdminShell>
                                <Routes>
                                  <Route
                                    index
                                    element={
                                      <ErrorBoundary fallback={<ImportErrorFallback pageName="Finance Management" />}>
                                        <FinancePage />
                                      </ErrorBoundary>
                                    }
                                  />
                                  <Route
                                    path="sales"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading sales..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Sales" />}>
                                          <SalesNew />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="shifts"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shifts..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shifts" />}>
                                          <Shifts />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="expenses"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading expenses..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Expenses" />}>
                                          <Expenses />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                </Routes>
                              </AdminShell>
                            }
                          />

                          {/* Legacy routes - redirect to new structure */}
                          <Route
                            path="/filling-systems"
                            element={<Navigate to="/fuel-management/filling-systems" replace />}
                          />
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
                          
                          {/* Other protected routes */}
                          <Route
                            path="/employees"
                            element={
                              <AdminShell>
                                <Suspense fallback={<Loading variant="fullscreen" text="Loading employees..." />}>
                                  <EmployeesNew />
                                </Suspense>
                              </AdminShell>
                            }
                          />
                          <Route
                            path="/todo"
                            element={
                              <AdminShell>
                                <Suspense fallback={<Loading variant="fullscreen" text="Loading todo..." />}>
                                  <ErrorBoundary fallback={<ImportErrorFallback pageName="Todo" />}>
                                    <TodoPage />
                                  </ErrorBoundary>
                                </Suspense>
                              </AdminShell>
                            }
                          />
                          <Route
                            path="/shifts/*"
                            element={
                              <AdminShell>
                                <Routes>
                                  <Route
                                    index
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shifts..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shifts" />}>
                                          <Shifts />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="open"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Opening shift..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Open Shift" />}>
                                          <ShiftOpen />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path="close"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Closing shift..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Close Shift" />}>
                                          <ShiftClose />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                  <Route
                                    path=":id"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shift details..." />}>
                                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shift Details" />}>
                                          <ShiftDetails />
                                        </ErrorBoundary>
                                      </Suspense>
                                    }
                                  />
                                </Routes>
                              </AdminShell>
                            }
                          />
                          <Route
                            path="/sales/*"
                            element={
                              <AdminShell>
                                <Routes>
                                  <Route
                                    path="create"
                                    element={
                                      <Suspense fallback={<Loading variant="fullscreen" text="Loading sales creation form..." />}>
                                        <SalesCreate />
                                      </Suspense>
                                    }
                                  />
                                </Routes>
                              </AdminShell>
                            }
                          />
                          
                          {/* Development routes */}
                          <Route
                            path="/dev/*"
                            element={
                              <AdminShell>
                                <Routes>
                                  <Route index element={<DevTools />} />
                                  <Route path="responsive-test" element={<ResponsiveTestPage />} />
                                  <Route path="toast-test" element={<ToastTester />} />
                                  <Route path="card-components" element={<CardComponentsPage />} />
                                  <Route path="button-components" element={<ButtonComponentsPage />} />
                                  <Route path="connection-info" element={<ConnectionInfo />} />
                                </Routes>
                              </AdminShell>
                            }
                          />

                          {/* Catch-all route - redirect to shifts instead of dashboard */}
                          <Route path="*" element={<Navigate to="/shifts" replace />} />
                        </Routes>
                      </RequireAuth>
                    }
                  />
                </Routes>
              </AuthProvider>
            </ErrorBoundary>
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
