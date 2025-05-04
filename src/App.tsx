import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
const CardComponentsPage = lazy(() => import(/* webpackChunkName: "dev-card" */ "@/pages/dev/CardComponentsPage"));
const ButtonComponentsPage = lazy(() => import(/* webpackChunkName: "dev-button" */ "@/pages/dev/ButtonComponentsPage"));
// Fix for named export

const queryClient = new QueryClient();

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

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <AdminShell>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading dashboard..." />}>
                        <DashboardNew />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/fuel-management"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading fuel management..." />}>
                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Fuel Management" />}>
                          <FuelManagement />
                        </ErrorBoundary>
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/filling-systems"
                  element={
                    <RequireAuth>
                      <Navigate
                        to="/fuel-management?tab=filling-systems"
                        replace
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/fuel-supplies"
                  element={
                    <RequireAuth>
                      <Navigate
                        to="/fuel-management?tab=fuel-supplies"
                        replace
                      />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/employees"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading employees..." />}>
                        <EmployeesNew />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/sales"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading sales..." />}>
                        <SalesNew />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/sales/create"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading sales creation form..." />}>
                        <SalesCreate />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/fuel-supplies/create"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading fuel supply creation form..." />}>
                        <FuelSupplyCreate />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shifts..." />}>
                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shifts" />}>
                          <Shifts />
                        </ErrorBoundary>
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts/close"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shift close..." />}>
                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shift Close" />}>
                          <ShiftClose />
                        </ErrorBoundary>
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts/open"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shift open..." />}>
                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shift Open" />}>
                          <ShiftOpen />
                        </ErrorBoundary>
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts/:id"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shift details..." />}>
                        <ErrorBoundary fallback={<ImportErrorFallback pageName="Shift Details" />}>
                          <ShiftDetails />
                        </ErrorBoundary>
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/providers"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading providers..." />}>
                        <PetrolProviders />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading expenses..." />}>
                        <Expenses />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading transactions..." />}>
                        <Transactions />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/todo"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading todo..." />}>
                        <TodoPage />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading settings..." />}>
                        <Settings />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                {/* Development routes */}
                <Route
                  path="/dev"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading dev tools..." />}>
                        <DevTools />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dev/responsive-test"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading responsive test..." />}>
                        <ResponsiveTestPage />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dev/toast-test"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading toast tester..." />}>
                        <ToastTester />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dev/card-components"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading card components..." />}>
                        <CardComponentsPage />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dev/button-components"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading button components..." />}>
                        <ButtonComponentsPage />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                {/* Catch-all route to redirect any unmatched paths */}
                <Route path="*" element={
                  <ErrorBoundary fallback={<ImportErrorFallback pageName="Page Not Found" />}>
                    <Navigate to="/" replace />
                  </ErrorBoundary>
                } />
              </Routes>
            </AdminShell>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
