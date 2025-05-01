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

// Import Auth directly since it's needed for initial load
import Auth from "@/pages/Auth";

// Lazy load other page components with prefetching for critical routes
const DashboardNew = lazy(() => 
  import(/* webpackPrefetch: true */ "@/pages/DashboardNew")
);
const FuelManagement = lazy(() => 
  import(/* webpackPrefetch: true */ "@/pages/FuelManagement")
);
const EmployeesNew = lazy(() => import("@/pages/EmployeesNew"));
const SalesNew = lazy(() => 
  import(/* webpackPrefetch: true */ "@/pages/SalesNew")
);
const PetrolProviders = lazy(() => import("@/pages/PetrolProviders"));
const Expenses = lazy(() => import("@/pages/Expenses"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const Shifts = lazy(() => import("@/pages/Shifts"));
const ShiftClose = lazy(() => import("@/pages/ShiftClose"));
const Todo = lazy(() => import("@/pages/Todo"));
const Settings = lazy(() => 
  import(/* webpackPrefetch: true */ "@/pages/Settings")
);
// Fix for named export

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    console.log("Auth is loading...");
    return <Loading variant="fullscreen" text="Checking authentication..." />;
  }

  console.log("Auth state:", user ? "Authenticated" : "Not authenticated");
  
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
                        <FuelManagement />
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
                  path="/shifts"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shifts..." />}>
                        <Shifts />
                      </Suspense>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/shifts/close"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<Loading variant="fullscreen" text="Loading shift close..." />}>
                        <ShiftClose />
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
                        <Todo />
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
                {/* Catch-all route to redirect any unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AdminShell>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
